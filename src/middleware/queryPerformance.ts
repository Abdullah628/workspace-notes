/* eslint-disable no-console */
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

// Enable MongoDB query profiling
export const enableMongooseDebug = () => {
  mongoose.set("debug", (collectionName: string, method: string, query: any, doc: any) => {
    console.log(`\n📊 MongoDB Query:`);
    console.log(`   Collection: ${collectionName}`);
    console.log(`   Method: ${method}`);
    console.log(`   Query:`, JSON.stringify(query, null, 2));
    if (doc) console.log(`   Options:`, JSON.stringify(doc, null, 2));
  });
};

// Middleware to track request performance
export const requestPerformanceLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const startMemory = process.memoryUsage().heapUsed;

  // Capture the original end function
  const originalEnd = res.end;

  // Override res.end to calculate duration
  res.end = function (chunk?: any, encoding?: any, callback?: any): any {
    const duration = Date.now() - startTime;
    const endMemory = process.memoryUsage().heapUsed;
    const memoryDiff = ((endMemory - startMemory) / 1024 / 1024).toFixed(2);

    // Color code based on duration
    let color = "\x1b[32m"; // Green for fast
    if (duration > 1000) color = "\x1b[31m"; // Red for slow
    else if (duration > 500) color = "\x1b[33m"; // Yellow for medium

    console.log(
      `${color}⚡ ${req.method} ${req.originalUrl} - ${duration}ms - Memory: ${memoryDiff}MB\x1b[0m`
    );

    // Call the original end function
    return originalEnd.call(this, chunk, encoding, callback);
  };

  next();
};

// Middleware to track slow queries
export const slowQueryAlert = (threshold: number = 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - startTime;
      if (duration > threshold) {
        console.warn(
          `\n⚠️  SLOW QUERY ALERT: ${req.method} ${req.originalUrl} took ${duration}ms`
        );
      }
    });

    next();
  };
};
