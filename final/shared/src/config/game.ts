import type { DragDropDifficultyLevel } from "types/game";

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
