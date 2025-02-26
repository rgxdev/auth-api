// src/api/v1/stats/getLastUserRegister.ts

import {Request, Response, Router} from 'express';
import {StatsService} from '@/services/StatsService';
import {logger} from '@/lib/logger';

const statsService = new StatsService();

export default (router: Router) => {
    router.get('/get-last-user-register', async (req: Request, res: Response) => {
        try {
            const lastUserRegisterDate = await statsService.getLastUserRegister();
            if (!lastUserRegisterDate) {
                return res.status(404).json({type: 'api_error', message: 'No user found.'});
            }
            return res.status(200).json({date: lastUserRegisterDate});
        } catch (error: any) {
            logger.error('Error fetching last user register date:', error);
            return res.status(500).json({type: 'api_error', message: 'Internal Server Error'});
        }
    });
};
