import { Request, Response } from "express";
import { ExamService } from "../Service/ExamService";
import { ResultService } from "../Service/ResultService";

export const ExamController = {
  async list(_req: Request, res: Response) {
    const exams = await ExamService.list();
    res.status(200).json(exams);
  },

  async getOne(req: Request, res: Response) {
    const exam = await ExamService.getById(req.params.id);
    res.status(200).json(exam);
  },

  async create(req: Request, res: Response) {
    const exam = await ExamService.create(req.body ?? {});
    res.status(201).json(exam);
  },

  async update(req: Request, res: Response) {
    const exam = await ExamService.update(req.params.id, req.body ?? {});
    res.status(200).json(exam);
  },

  async remove(req: Request, res: Response) {
    await ExamService.delete(req.params.id);
    res.status(204).send();
  },

  async results(req: Request, res: Response) {
    const results = await ResultService.getExamResults(req.params.id);
    res.status(200).json(results);
  },
};
