interface User {
  id: number;
  username: string;
  password: string;
  email?: string;
}

interface UserDB {
  users: User[];
}

interface MemoryCard {
  type: string;
}

interface MemoryGameScore {
  id: number;
  userId: number;
  score: number;
  turns: number;
  timeCompleted: number;
  date: string;
}

interface DragDropPair {
  id: string;
  label: string;
  match: string;
}

interface DragDropGameScore {
  id: number;
  userId: number;
  score: number;
  timeCompleted: number;
  date: string;
}

interface DragDropDB {
  pairs: DragDropPair[];
  scores: DragDropGameScore[];
}
