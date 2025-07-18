export type Subject = 'math' | 'english' | 'knowledge';

export interface Question {
  subject: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface TimedQuestionsResponse {
  questions: Question[];
}
