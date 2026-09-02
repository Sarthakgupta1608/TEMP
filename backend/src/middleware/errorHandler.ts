import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('❌ Global Unhandled Error:', err);

  if (err.name === 'ZodError') {
    const issueMessage = err.issues?.[0]?.message || 'Validation error';
    return sendError(res, issueMessage, 400, 'VALIDATION_ERROR');
  }

  if (err.code === 'P2002') {
    return sendError(res, 'A record with this unique value already exists.', 409, 'UNIQUE_CONSTRAINT_VIOLATION');
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return sendError(res, message, statusCode, err.errorCode || 'INTERNAL_SERVER_ERROR');
};
