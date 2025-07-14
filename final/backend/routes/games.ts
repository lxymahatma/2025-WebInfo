import { Router, Request, Response } from "express";
import { randomInt, shuffle, groupBy, sampleSize, uniq } from "es-toolkit";
import { readMemoryDB, readDragDropDB, readTimedDB } from "utils";

const router = Router();

router.get("/memory/cards", (req: Request, res: Response) => {
  const memoryDB = readMemoryDB();

  if (memoryDB.cards.length === 0) {
    return res.json({ cards: ["Dog", "Cat", "Mouse", "Hamster"] });
  }

  const cards = sampleSize(memoryDB.cards, 4).map((card) => card.type);

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

  const groupedPairs = groupBy(db.pairs, (pair) => pair.match);
  const selectedPairs: any[] = [];

  Object.values(groupedPairs).forEach((categoryPairs) => {
    const sampledPairs = sampleSize(categoryPairs, Math.min(count, categoryPairs.length));
    selectedPairs.push(...sampledPairs);
  });

  const finalPairs = shuffle(selectedPairs);
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

  // Use es-toolkit's shuffle for better randomization
  const shuffledQuestions = shuffle(subjectQuestions);
  res.json({ questions: shuffledQuestions });
});

export const gameRouter = router;
