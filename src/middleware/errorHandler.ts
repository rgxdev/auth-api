// src/middlewares/errorHandler.ts

import {NextFunction, Request, Response} from 'express';
import {logger} from '@/lib/logger';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    logger.error('Unhandled error:', err);

    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        type: 'error',
        message,
    });
}
