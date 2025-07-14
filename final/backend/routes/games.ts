import { Router, Request, Response } from "express";
import { randomInt } from "es-toolkit";
import { readMemoryDB, readDragDropDB, readTimedDB } from "utils";

const router = Router();

router.get("/memory/cards", (req: Request, res: Response) => {
  const memoryDB = readMemoryDB();

  if (memoryDB.cards.length === 0) {
    return res.json({ cards: ["Dog", "Cat", "Mouse", "Hamster"] });
  }

  const randomIndices: number[] = [];

  while (randomIndices.length < 4 && randomIndices.length < memoryDB.cards.length) {
    const randomIndex = randomInt(0, memoryDB.cards.length);
    if (!randomIndices.includes(randomIndex)) {
      randomIndices.push(randomIndex);
    }
  }

  const cards = randomIndices.map((index) => memoryDB.cards[index].type);

  res.json({ cards });
});

router.get("/dragdrop/pairs", (req: Request, res: Response) => {
  const db = readDragDropDB();
  const difficulty = req.query.difficulty as string;

  const itemsPerCategory = {
    easy: 1,
    medium: 2,
    hard: 3,
  };

  const count = itemsPerCategory[difficulty as keyof typeof itemsPerCategory];

  const categories = Array.from(new Set(db.pairs.map((p) => p.match)));
  const selectedPairs: any[] = [];

  for (const category of categories) {
    const categoryPairs = db.pairs.filter((p) => p.match === category);
    const shuffled = categoryPairs.sort(() => Math.random() - 0.5);
    selectedPairs.push(...shuffled.slice(0, count));
  }

  const finalPairs = selectedPairs.sort(() => Math.random() - 0.5);
  res.json(finalPairs);
});

router.get("/timed/questions", (req: Request, res: Response) => {
  const db = readTimedDB();
  const subject = req.query.subject as string;

  if (!subject) {
    return res.status(400).json({ message: "Subject parameter is required" });
  }

  const subjectQuestions = db.questions.filter((q) => q.subject === subject);

  if (subjectQuestions.length === 0) {
    return res.status(404).json({ message: "No questions found for this subject" });
  }

  const shuffledQuestions = subjectQuestions.sort(() => Math.random() - 0.5);
  res.json({ questions: shuffledQuestions });
});

export const gameRouter = router;
