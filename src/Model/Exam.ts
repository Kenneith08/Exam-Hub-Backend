export interface Exam {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  opens_at: Date;
  closes_at: Date;
  created_at: Date;
  updated_at: Date;
}
