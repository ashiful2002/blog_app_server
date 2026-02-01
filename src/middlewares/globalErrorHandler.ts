import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function globalErrorHabdler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = 500;
  let errorMessage = "Internal server error";
  let errorDetails = err;

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You have provided incorrect field type or missing fields!";
  }

  res.status(statusCode);
  res.json({
    message: errorMessage,
    error: errorDetails,
  });
}

export default globalErrorHabdler;