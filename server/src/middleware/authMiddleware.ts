import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const { JWT_SECRET } = process.env;

// Extend Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any; // Adjust the type according to your user object
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401); // If there is no token, return 401 Unauthorized
  }

  jwt.verify(token, JWT_SECRET as string, (err, user) => {
    if (err) {
      return res.sendStatus(403); // If token is invalid, return 403 Forbidden
    }
    req.user = user; // Attach user to request object
    next(); // Proceed to the next middleware/route handler
  });
};
