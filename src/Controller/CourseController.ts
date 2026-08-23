import { Request, Response } from "express";
import { CourseService } from "../Service/CourseService";

export const CourseController = {
  async list(_req: Request, res: Response) {
    const courses = await CourseService.list();
    res.status(200).json(courses);
  },

  async create(req: Request, res: Response) {
    const course = await CourseService.create(req.body ?? {});
    res.status(201).json(course);
  },

  async update(req: Request, res: Response) {
    const course = await CourseService.update(req.params.id, req.body ?? {});
    res.status(200).json(course);
  },

  async remove(req: Request, res: Response) {
    await CourseService.delete(req.params.id);
    res.status(204).send();
  },
};
