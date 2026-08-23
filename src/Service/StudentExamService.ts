import { pool, withTransaction } from "../config/database";
import { ExamRepository } from "../Repositorie/ExamRepository";
import { QuestionRepository } from "../Repositorie/QuestionRepository";
import { ChoiceRepository } from "../Repositorie/ChoiceRepository";
import { AttemptRepository } from "../Repositorie/AttemptRepository";
import { AnswerRepository } from "../Repositorie/AnswerRepository";
import { toPublicChoice } from "../Model/Choice";
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from "../middlewares/errors";

interface SubmitAnswerInput {
  questionId: string;
  choiceId: string | null;
}

export const StudentExamService = {
  async listAvailable(studentId: string) {
    const now = new Date();
    const openExams = await ExamRepository.findOpenExams(now);
    const attemptedExamIds = new Set(await AttemptRepository.findExamIdsByStudent(studentId));

    const available = openExams.filter((exam) => !attemptedExamIds.has(exam.id));

    const result = await pool.query<{ id: string; name: string; code: string }>(
      "SELECT id, name, code FROM courses WHERE id = ANY($1::uuid[])",
      [available.map((e) => e.course_id)]
    );
    const coursesById = new Map(result.rows.map((c) => [c.id, c]));

    return available.map((exam) => ({
      id: exam.id,
      title: exam.title,
      description: exam.description,
      opensAt: exam.opens_at,
      closesAt: exam.closes_at,
      course: coursesById.get(exam.course_id) ?? null,
    }));
  },


  async getExamForStudent(studentId: string, examId: string) {
    const exam = await ExamRepository.findById(examId);
    if (!exam) {
      throw new NotFoundError("Examen introuvable.");
    }

    const attempt = await AttemptRepository.findByStudentAndExam(studentId, examId);

    const questions = await QuestionRepository.findByExamId(examId);
    const choices = await ChoiceRepository.findByQuestionIds(questions.map((q) => q.id));

    if (attempt && attempt.submitted_at) {
      const answers = await AnswerRepository.findByAttemptId(attempt.id);
      const answersByQuestion = new Map(answers.map((a) => [a.question_id, a.choice_id]));

      return {
        exam: { id: exam.id, title: exam.title, description: exam.description },
        alreadySubmitted: true,
        score: attempt.score !== null ? Number(attempt.score) : null,
        submittedAt: attempt.submitted_at,
        questions: questions.map((q) => ({
          id: q.id,
          statement: q.statement,
          points: q.points,
          selectedChoiceId: answersByQuestion.get(q.id) ?? null,
          choices: choices
            .filter((c) => c.question_id === q.id)
            .map((c) => ({ id: c.id, label: c.label, isCorrect: c.is_correct })),
        })),
      };
    }

    const now = new Date();
    if (now < exam.opens_at || now > exam.closes_at) {
      throw new ForbiddenError("Cet examen n'est pas disponible en dehors de sa fenêtre.");
    }

    return {
      exam: { id: exam.id, title: exam.title, description: exam.description },
      alreadySubmitted: false,
      questions: questions.map((q) => ({
        id: q.id,
        statement: q.statement,
        points: q.points,
        choices: choices.filter((c) => c.question_id === q.id).map(toPublicChoice), // RG-07
      })),
    };
  },

  async submit(studentId: string, examId: string, answers: SubmitAnswerInput[]) {
    const exam = await ExamRepository.findById(examId);
    if (!exam) {
      throw new NotFoundError("Examen introuvable.");
    }

    const now = new Date();
    if (now < exam.opens_at || now > exam.closes_at) {
      throw new ForbiddenError("La fenêtre de soumission de cet examen est fermée.");
    }

    const existingAttempt = await AttemptRepository.findByStudentAndExam(studentId, examId);
    if (existingAttempt) {
      throw new ConflictError("Vous avez déjà passé cet examen.");
    }

    if (!Array.isArray(answers)) {
      throw new BadRequestError("Le format des réponses est invalide.");
    }

    const questions = await QuestionRepository.findByExamId(examId);
    const choices = await ChoiceRepository.findByQuestionIds(questions.map((q) => q.id));

    const answerByQuestionId = new Map<string, string | null>();
    for (const a of answers) {
      if (!a.questionId) continue;
      answerByQuestionId.set(a.questionId, a.choiceId ?? null);
    }

    return withTransaction(async (client) => {
      let attempt;
      try {
        const result = await client.query(
          `INSERT INTO attempts (student_id, exam_id) VALUES ($1, $2) RETURNING *`,
          [studentId, examId]
        );
        attempt = result.rows[0];
      } catch {
        throw new ConflictError("Vous avez déjà passé cet examen.");
      }

      let totalScore = 0;
      const correction = [];

      for (const question of questions) {
        const selectedChoiceId = answerByQuestionId.get(question.id) ?? null;
        const questionChoices = choices.filter((c) => c.question_id === question.id);
        const correctChoice = questionChoices.find((c) => c.is_correct) ?? null;

        const selectedChoice = selectedChoiceId
          ? questionChoices.find((c) => c.id === selectedChoiceId) ?? null
          : null;

        const validChoiceId = selectedChoice ? selectedChoice.id : null;

        await AnswerRepository.create(
          { attemptId: attempt.id, questionId: question.id, choiceId: validChoiceId },
          client
        );

        const isCorrect = validChoiceId !== null && validChoiceId === correctChoice?.id;
        if (isCorrect) {
          totalScore += Number(question.points);
        }

        correction.push({
          questionId: question.id,
          statement: question.statement,
          points: question.points,
          selectedChoiceId: validChoiceId,
          correctChoiceId: correctChoice?.id ?? null,
          isCorrect,
          choices: questionChoices.map((c) => ({ id: c.id, label: c.label, isCorrect: c.is_correct })),
        });
      }

      const updateResult = await client.query(
        `UPDATE attempts SET submitted_at = now(), score = $2 WHERE id = $1 RETURNING *`,
        [attempt.id, totalScore]
      );
      const finalAttempt = updateResult.rows[0];

      return {
        score: Number(finalAttempt.score),
        submittedAt: finalAttempt.submitted_at,
        questions: correction,
      };
    });
  },

  async history(studentId: string) {
    const attempts = await AttemptRepository.findByStudentId(studentId);
    const examIds = attempts.map((a) => a.exam_id);

    const result = await pool.query<{ id: string; title: string }>(
      "SELECT id, title FROM exams WHERE id = ANY($1::uuid[])",
      [examIds]
    );
    const examsById = new Map(result.rows.map((e) => [e.id, e]));

    return attempts
      .filter((a) => a.submitted_at !== null)
      .map((a) => ({
        examId: a.exam_id,
        examTitle: examsById.get(a.exam_id)?.title ?? "Examen supprimé",
        score: a.score !== null ? Number(a.score) : null,
        submittedAt: a.submitted_at,
      }));
  },
};
