import type { DragDropDifficultyLevel, Subject } from "types/game";

export const DragDropDifficultyConfig: Record<
  DragDropDifficultyLevel,
  {
    label: string;
    count: number;
  }
> = {
  easy: { label: "Easy", count: 1 },
  medium: { label: "Medium", count: 2 },
  hard: { label: "Hard", count: 3 },
};

export const SubjectNames: Record<Subject, string> = {
  math: "Math",
  english: "English",
  knowledge: "Fun Facts",
};
