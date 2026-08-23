import { QuestionRepository } from "../Repositorie/QuestionRepository";
import { ChoiceRepository } from "../Repositorie/ChoiceRepository";
import { ExamRepository } from "../Repositorie/ExamRepository";
import { withTransaction } from "../config/database";
import { Question } from "../Model/Question";
import { Choice } from "../Model/Choice";
import { BadRequestError, ConflictError, NotFoundError } from "../middlewares/errors";

export interface ChoiceInput {
  label: string;
  isCorrect: boolean;
}

export interface QuestionWithChoices extends Question {
  choices: Choice[];
}

function validateChoices(choices: ChoiceInput[] | undefined): ChoiceInput[] {
  if (!choices || !Array.isArray(choices)) {
    throw new BadRequestError("La liste des choix est requise.");
  }
  if (choices.length < 2 || choices.length > 6) {
    throw new BadRequestError("Une question doit avoir entre 2 et 6 choix.");
  }
  const correctCount = choices.filter((c) => c.isCorrect).length;
  if (correctCount !== 1) {
    throw new BadRequestError("Une question doit avoir exactement un choix correct.");
  }
  if (choices.some((c) => !c.label || !c.label.trim())) {
    throw new BadRequestError("Chaque choix doit avoir un libellé.");
  }
  return choices;
}

async function assertExamNotLocked(examId: string): Promise<void> {
  const exam = await ExamRepository.findById(examId);
  if (!exam) {
    throw new NotFoundError("Examen introuvable.");
  }

  const locked = await ExamRepository.hasAttempts(examId);
  if (locked) {
    throw new ConflictError(
      "Cet examen a déjà au moins une tentative : ses questions et choix sont verrouillés."
    );
  }
}

export const QuestionService = {
  async listByExam(examId: string): Promise<QuestionWithChoices[]> {
    const exam = await ExamRepository.findById(examId);
    if (!exam) {
      throw new NotFoundError("Examen introuvable.");
    }

    const questions = await QuestionRepository.findByExamId(examId);
    const choices = await ChoiceRepository.findByQuestionIds(questions.map((q) => q.id));

    return questions.map((question) => ({
      ...question,
      choices: choices.filter((c) => c.question_id === question.id),
    }));
  },

  async create(
    examId: string,
    data: { statement: string; points: number; position?: number; choices: ChoiceInput[] }
  ): Promise<QuestionWithChoices> {
    if (!data.statement || !data.statement.trim()) {
      throw new BadRequestError("L'énoncé de la question est requis.");
    }
    if (!data.points || data.points <= 0) {
      throw new BadRequestError("Le nombre de points doit être positif.");
    }
    const choices = validateChoices(data.choices);

    await assertExamNotLocked(examId);

    return withTransaction(async (client) => {
      const question = await QuestionRepository.create(
        {
          examId,
          statement: data.statement,
          points: data.points,
          position: data.position ?? 0,
        },
        client
      );

      const createdChoices: Choice[] = [];
      for (let i = 0; i < choices.length; i++) {
        const choice = await ChoiceRepository.create(
          {
            questionId: question.id,
            label: choices[i].label,
            isCorrect: choices[i].isCorrect,
            position: i,
          },
          client
        );
        createdChoices.push(choice);
      }

      return { ...question, choices: createdChoices };
    });
  },

  async update(
    questionId: string,
    data: Partial<{ statement: string; points: number; position: number; choices: ChoiceInput[] }>
  ): Promise<QuestionWithChoices> {
    const question = await QuestionRepository.findById(questionId);
    if (!question) {
      throw new NotFoundError("Question introuvable.");
    }

    await assertExamNotLocked(question.exam_id);

    if (data.points !== undefined && data.points <= 0) {
      throw new BadRequestError("Le nombre de points doit être positif.");
    }

    const choices = data.choices !== undefined ? validateChoices(data.choices) : undefined;

    return withTransaction(async (client) => {
      const updated = await QuestionRepository.update(questionId, {
        statement: data.statement,
        points: data.points,
        position: data.position,
      });

      let finalChoices: Choice[];
      if (choices) {
        await ChoiceRepository.deleteByQuestionId(questionId, client);
        finalChoices = [];
        for (let i = 0; i < choices.length; i++) {
          const choice = await ChoiceRepository.create(
            { questionId, label: choices[i].label, isCorrect: choices[i].isCorrect, position: i },
            client
          );
          finalChoices.push(choice);
        }
      } else {
        finalChoices = await ChoiceRepository.findByQuestionId(questionId);
      }

      return { ...updated!, choices: finalChoices };
    });
  },

  async delete(questionId: string): Promise<void> {
    const question = await QuestionRepository.findById(questionId);
    if (!question) {
      throw new NotFoundError("Question introuvable.");
    }

    await assertExamNotLocked(question.exam_id);
    await QuestionRepository.delete(questionId);
  },
};
