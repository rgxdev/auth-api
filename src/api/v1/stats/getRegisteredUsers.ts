// src/api/v1/stats/getRegisteredUsers.ts

import {Request, Response, Router} from 'express';
import {StatsService} from '@/services/StatsService';
import {logger} from '@/lib/logger';

const statsService = new StatsService();

export default (router: Router) => {
    router.get('/get-registered-users', async (req: Request, res: Response) => {
        try {
            const userCount = await statsService.getRegisteredUsers();
            return res.status(200).json({count: userCount});
        } catch (error: any) {
            logger.error('Error fetching registered users count:', error);
            return res.status(500).json({type: 'api_error', message: 'Internal Server Error'});
        }
    });
};
