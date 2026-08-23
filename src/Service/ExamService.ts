import { ExamRepository } from "../Repositorie/ExamRepository";
import { CourseRepository } from "../Repositorie/CourseRepository";
import { Exam } from "../Model/Exam";
import { BadRequestError, ConflictError, NotFoundError } from "../middlewares/errors";

function parseWindow(opensAt: string, closesAt: string): { opensAt: Date; closesAt: Date } {
  const opens = new Date(opensAt);
  const closes = new Date(closesAt);

  if (isNaN(opens.getTime()) || isNaN(closes.getTime())) {
    throw new BadRequestError("Dates de fenêtre de disponibilité invalides.");
  }
  if (closes <= opens) {
    throw new BadRequestError("La date de fin doit être après la date de début.");
  }
  return { opensAt: opens, closesAt: closes };
}

export const ExamService = {
  async list(): Promise<Exam[]> {
    return ExamRepository.findAll();
  },

  async getById(id: string): Promise<Exam> {
    const exam = await ExamRepository.findById(id);
    if (!exam) {
      throw new NotFoundError("Examen introuvable.");
    }
    return exam;
  },

  async create(data: {
    courseId: string;
    title: string;
    description?: string;
    opensAt: string;
    closesAt: string;
  }): Promise<Exam> {
    if (!data.courseId || !data.title || !data.opensAt || !data.closesAt) {
      throw new BadRequestError("Cours, titre et fenêtre de disponibilité sont requis.");
    }

    const course = await CourseRepository.findById(data.courseId);
    if (!course) {
      throw new NotFoundError("Cours introuvable.");
    }

    const { opensAt, closesAt } = parseWindow(data.opensAt, data.closesAt);

    return ExamRepository.create({
      courseId: data.courseId,
      title: data.title,
      description: data.description,
      opensAt,
      closesAt,
    });
  },

  async update(
    id: string,
    data: Partial<{ title: string; description: string; opensAt: string; closesAt: string }>
  ): Promise<Exam> {
    const exam = await this.getById(id);

    let opensAt: Date | undefined;
    let closesAt: Date | undefined;

    if (data.opensAt || data.closesAt) {
      const window = parseWindow(
        data.opensAt ?? exam.opens_at.toISOString(),
        data.closesAt ?? exam.closes_at.toISOString()
      );
      opensAt = window.opensAt;
      closesAt = window.closesAt;
    }

    const updated = await ExamRepository.update(id, {
      title: data.title,
      description: data.description,
      opensAt,
      closesAt,
    });
    return updated!;
  },

  async delete(id: string): Promise<void> {
    await this.getById(id);

    const hasAttempts = await ExamRepository.hasAttempts(id);
    if (hasAttempts) {
      throw new ConflictError("Cet examen possède des tentatives et ne peut pas être supprimé.");
    }

    await ExamRepository.delete(id);
  },
};
