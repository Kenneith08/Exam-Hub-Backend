import { CourseRepository } from "../Repositorie/CourseRepository";
import { Course } from "../Model/Course";
import { BadRequestError, ConflictError, NotFoundError } from "../middlewares/errors";

export const CourseService = {
  async list(): Promise<Course[]> {
    return CourseRepository.findAll();
  },

  async create(data: { code: string; name: string; description?: string }): Promise<Course> {
    if (!data.code || !data.name) {
      throw new BadRequestError("Le code et le nom du cours sont requis.");
    }

    const existing = await CourseRepository.findByCode(data.code);
    if (existing) {
      throw new ConflictError("Un cours avec ce code existe déjà.");
    }

    return CourseRepository.create(data);
  },

  async update(
    id: string,
    data: Partial<{ code: string; name: string; description: string }>
  ): Promise<Course> {
    const course = await CourseRepository.findById(id);
    if (!course) {
      throw new NotFoundError("Cours introuvable.");
    }

    if (data.code && data.code !== course.code) {
      const existing = await CourseRepository.findByCode(data.code);
      if (existing) {
        throw new ConflictError("Un cours avec ce code existe déjà.");
      }
    }

    const updated = await CourseRepository.update(id, data);
    return updated!;
  },
  
  async delete(id: string): Promise<void> {
    const course = await CourseRepository.findById(id);
    if (!course) {
      throw new NotFoundError("Cours introuvable.");
    }

    const hasExams = await CourseRepository.hasExams(id);
    if (hasExams) {
      throw new ConflictError("Ce cours possède des examens et ne peut pas être supprimé.");
    }

    await CourseRepository.delete(id);
  },
};
