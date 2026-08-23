export interface Question {
  id: string;
  exam_id: string;
  statement: string;
  points: number;
  position: number;
  created_at: Date;
  updated_at: Date;
}
