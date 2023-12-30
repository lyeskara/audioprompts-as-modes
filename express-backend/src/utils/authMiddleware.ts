import { Response, Request, NextFunction } from "express";

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.body.password || req.query.password
    // Compare the token from the request with your secret token
    if (token === process.env.Secret_Auth_Token) {
      next(); // Continue to the next middleware or route handler
    } else {
      res.status(401).json({ error: 'Forbidden: Invalid token' });
    }
  }