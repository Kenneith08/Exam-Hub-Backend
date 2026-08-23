export interface Attempt {
  id: string;
  student_id: string;
  exam_id: string;
  started_at: Date;
  submitted_at: Date | null;
  score: number | null;
}
