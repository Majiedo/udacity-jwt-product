import { NextFunction, Request, Response } from "express";

import { TokenData } from "./tokenData.type";

export type AuthRequest = (
  req: Request,
  res: Response,
  user: TokenData,
  next: NextFunction
) => void;
