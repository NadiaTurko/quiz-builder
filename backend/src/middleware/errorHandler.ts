import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "../errors/HttpError.js";

function isJsonSyntaxError(error: unknown): error is SyntaxError {
  return (
    error instanceof SyntaxError &&
    ("body" in error || (error as { type?: string }).type === "entity.parse.failed")
  );
}

function errorStatus(error: unknown): number | undefined {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = error.status;
    if (typeof status === "number") {
      return status;
    }
  }

  return undefined;
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof HttpError) {
    res.status(error.status).json({
      error: {
        message: error.message,
        ...(error.details !== undefined ? { details: error.details } : {}),
      },
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      error: {
        message: "Validation failed",
        details: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }

  if (isJsonSyntaxError(error)) {
    res.status(400).json({
      error: {
        message: "Invalid JSON",
      },
    });
    return;
  }

  if (errorStatus(error) === 413) {
    res.status(413).json({
      error: {
        message: "Request body is too large",
      },
    });
    return;
  }

  console.error(error);
  res.status(500).json({
    error: {
      message: "Internal server error",
    },
  });
}

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, "Route not found"));
}
