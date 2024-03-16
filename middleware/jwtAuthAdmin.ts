import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export interface JWTRequest extends Request {
  user: any;
}

export function jwtAuthAdminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let token = req.headers["authorization"];
  token = token?.split(" ")[1];

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, secret as string);
    (req as JWTRequest).user = decoded;
    if ((req as JWTRequest).user.role != "ADMIN") {
      return res.status(403).send("Access denied. You are not an admin.");
    } else {
      next();
    }
  } catch (ex: any) {
    res.status(400).send("Invalid token.");
  }
}
