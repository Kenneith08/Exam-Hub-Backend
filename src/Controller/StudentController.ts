import { Request, Response } from "express";
import { StudentService } from "../Service/StudentService";

export const StudentController = {
  async list(_req: Request, res: Response) {
    const students = await StudentService.list();
    res.status(200).json(students);
  },

  async create(req: Request, res: Response) {
    const student = await StudentService.create(req.body ?? {});
    res.status(201).json(student);
  },

  async update(req: Request, res: Response) {
    const student = await StudentService.update(req.params.id, req.body ?? {});
    res.status(200).json(student);
  },

  async deactivate(req: Request, res: Response) {
    const student = await StudentService.deactivate(req.params.id);
    res.status(200).json(student);
  },
};
