import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: {
    username: string;
  };
}

const SECRET = "mySecretKey";

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, SECRET, (err: jwt.VerifyErrors | null, user: any) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

export { SECRET };
