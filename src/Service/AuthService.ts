import { UserRepository } from "../Repositorie/UserRepository";
import { comparePassword } from "../Security/hash";
import { signToken } from "../Security/jwt";
import { UnauthorizedError } from "../middlewares/errors";
import { toPublicUser, PublicUser } from "../Model/User";

export const AuthService = {
  async login(email: string, password: string): Promise<{ token: string; user: PublicUser }> {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError("Email ou mot de passe incorrect.");
    }

    if (!user.is_active) {
      throw new UnauthorizedError("Ce compte a été désactivé. Contactez un administrateur.");
    }

    const passwordMatches = await comparePassword(password, user.password_hash);
    if (!passwordMatches) {
      throw new UnauthorizedError("Email ou mot de passe incorrect.");
    }

    const token = signToken({ sub: user.id, role: user.role });
    return { token, user: toPublicUser(user) };
  },
};
