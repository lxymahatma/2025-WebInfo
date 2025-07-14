export interface DragDropPair {
  id: string;
  label: string;
  match: string;
}

export interface DragDropGameScore {
  id: number;
  userId: number;
  score: number;
  timeCompleted: number;
  date: string;
}

export interface DragDropDB {
  pairs: DragDropPair[];
  scores: DragDropGameScore[];
}
