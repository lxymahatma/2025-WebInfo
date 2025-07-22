import jwt from "jsonwebtoken";
import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types";

const SECRET = "mySecretKey";

export const verifyToken = (request: AuthRequest, response: Response, next: NextFunction) => {
  const token = request.headers.authorization?.split(" ")[1];
  if (!token) return response.status(401).json({ message: "No token provided" });

  jwt.verify(
    token,
    SECRET,
    (error: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
      if (error) return response.status(403).json({ message: "Invalid token" });
      request.user = decoded as { username: string };
      next();
    }
  );
};

export { SECRET };
