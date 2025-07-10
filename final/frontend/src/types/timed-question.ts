export interface TimedQuestionGameProps {
  question: string;
  options: string[];
  onAnswer: (idx: number | null) => void;
}
