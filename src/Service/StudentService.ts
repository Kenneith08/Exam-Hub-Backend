import { UserRepository } from "../Repositorie/UserRepository";
import { hashPassword } from "../Security/hash";
import { BadRequestError, ConflictError, NotFoundError } from "../middlewares/errors";
import { toPublicUser, PublicUser } from "../Model/User";


export const StudentService = {
  async list(): Promise<PublicUser[]> {
    const students = await UserRepository.findAllByRole("student");
    return students.map(toPublicUser);
  },

  async create(data: { name: string; email: string; password: string }): Promise<PublicUser> {
    if (!data.name || !data.email || !data.password) {
      throw new BadRequestError("Nom, email et mot de passe sont requis.");
    }

    const existing = await UserRepository.findByEmail(data.email);
    if (existing) {
      throw new ConflictError("Un compte existe déjà avec cet email.");
    }

    const passwordHash = await hashPassword(data.password);
    const student = await UserRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: "student",
    });
    return toPublicUser(student);
  },

  async update(
    id: string,
    data: Partial<{ name: string; email: string; password: string; isActive: boolean }>
  ): Promise<PublicUser> {
    const student = await UserRepository.findById(id);
    if (!student || student.role !== "student") {
      throw new NotFoundError("Étudiant introuvable.");
    }

    if (data.email && data.email !== student.email) {
      const existing = await UserRepository.findByEmail(data.email);
      if (existing) {
        throw new ConflictError("Un compte existe déjà avec cet email.");
      }
    }

    const passwordHash = data.password ? await hashPassword(data.password) : undefined;

    const updated = await UserRepository.update(id, {
      name: data.name,
      email: data.email,
      passwordHash,
      isActive: data.isActive,
    });

    return toPublicUser(updated!);
  },

  // Sur ce projet, seules les routes PUT/DELETE /api/students/:id sont
  // imposées par le sujet (pas de route dédiée à la réactivation) :
  // réactiver un compte se fait donc via ce même PUT, avec
  // { isActive: true } dans le corps de la requête.
  async reactivate(id: string): Promise<PublicUser> {
    return this.update(id, { isActive: true });
  },

  async deactivate(id: string): Promise<PublicUser> {
    const student = await UserRepository.findById(id);
    if (!student || student.role !== "student") {
      throw new NotFoundError("Étudiant introuvable.");
    }

    const updated = await UserRepository.update(id, { isActive: false });
    return toPublicUser(updated!);
  },
};
