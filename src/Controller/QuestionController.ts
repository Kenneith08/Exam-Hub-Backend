import { Request, Response } from "express";
import { QuestionService } from "../Service/QuestionService";

export const QuestionController = {
  async listByExam(req: Request, res: Response) {
    const questions = await QuestionService.listByExam(req.params.id);
    res.status(200).json(questions);
  },

  async create(req: Request, res: Response) {
    const question = await QuestionService.create(req.params.id, req.body ?? {});
    res.status(201).json(question);
  },

  async update(req: Request, res: Response) {
    const question = await QuestionService.update(req.params.id, req.body ?? {});
    res.status(200).json(question);
  },

  async remove(req: Request, res: Response) {
    await QuestionService.delete(req.params.id);
    res.status(204).send();
  },
};
