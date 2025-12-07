import { NextFunction, Request, Response } from "express"
import { ZodSchema } from "zod"

export const validateRequest = (zodSchema: ZodSchema<any>) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = await zodSchema.parseAsync({ body: req.body, query: req.query, params: req.params });
        
        // Only update properties that were validated
        if (parsed.body !== undefined) {
            req.body = parsed.body;
        }
        
        // Note: req.query and req.params are read-only in Express 5
        // If validation includes query/params, they're already validated but not reassigned
        
        next();
    } catch (error) {
        next(error);
    }
}