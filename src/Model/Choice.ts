export interface Choice {
  id: string;
  question_id: string;
  label: string;
  is_correct: boolean;
  position: number;
}

export type PublicChoice = Omit<Choice, "is_correct">;

export function toPublicChoice(choice: Choice): PublicChoice {
  const { is_correct, ...publicChoice } = choice;
  return publicChoice;
}
