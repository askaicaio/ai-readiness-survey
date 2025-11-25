export type QuestionType = 'multiple-choice' | 'scale' | 'text';

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  options?: string[];
}

export type Answers = Record<number, string | number>;

export interface Recommendation {
  level: 'Starter' | 'Growth' | 'Leadership / VIP';
  price: string;
  explanation: string;
}
