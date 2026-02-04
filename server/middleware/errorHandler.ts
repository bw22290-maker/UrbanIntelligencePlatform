import { Request, Response, NextFunction } from 'express';

// Simple logging function for server-side
const log = (message: string, context?: any) => {
  console.log(`[ERROR] ${message}`, context || '');
};

export interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Handle development errors
const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode || 500).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

// Handle production errors
const sendErrorProd = (err: AppError, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      status: err.status,
      message: err.message
    });
  } else {
    // Programming or other unknown error: don't leak error details
    log('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};

// Handle database errors
const handleDBErrors = (err: any): AppError => {
  let error = { ...err };
  error.message = err.message;

  // Duplicate field value
  if (err.code === '23505') {
    const value = err.detail?.match(/\(([^)]+)\)/)?.[1];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new CustomError(message, 400);
  }

  // Invalid data type
  if (err.code === '22P02') {
    const message = 'Invalid data type provided';
    return new CustomError(message, 400);
  }

  // Foreign key constraint
  if (err.code === '23503') {
    const message = 'Referenced record does not exist';
    return new CustomError(message, 400);
  }

  return new CustomError('Database operation failed', 500);
};

// Handle JWT errors
const handleJWTError = (): AppError =>
  new CustomError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = (): AppError =>
  new CustomError('Your token has expired! Please log in again.', 401);

// Global error handler
export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error
  log(`ERROR ${err.statusCode}: ${err.message}`, {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (error.code?.startsWith('23')) error = handleDBErrors(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

// Async error wrapper
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

// 404 handler
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const err = new CustomError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(err);
};
