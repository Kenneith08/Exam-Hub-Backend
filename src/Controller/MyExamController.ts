import { Request, Response } from "express";
import { StudentExamService } from "../Service/StudentExamService";
import { UnauthorizedError } from "../middlewares/errors";

function studentId(req: Request): string {
  if (!req.user) throw new UnauthorizedError();
  return req.user.sub;
}

export const MyExamController = {
  async listAvailable(req: Request, res: Response) {
    const exams = await StudentExamService.listAvailable(studentId(req));
    res.status(200).json(exams);
  },

  async getOne(req: Request, res: Response) {
    const exam = await StudentExamService.getExamForStudent(studentId(req), req.params.id);
    res.status(200).json(exam);
  },

  async submit(req: Request, res: Response) {
    const { answers } = req.body ?? {};
    const result = await StudentExamService.submit(studentId(req), req.params.id, answers ?? []);
    res.status(200).json(result);
  },

  async history(req: Request, res: Response) {
    const history = await StudentExamService.history(studentId(req));
    res.status(200).json(history);
  },
};
