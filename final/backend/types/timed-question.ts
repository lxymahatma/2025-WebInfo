export interface TimedQuestion {
  subject: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface TimedQuestionDB {
  questions: TimedQuestion[];
}
