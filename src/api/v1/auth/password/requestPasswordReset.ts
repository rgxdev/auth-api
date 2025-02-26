// src/api/v1/auth/password/requestPasswordReset.ts

import {Request, Response, Router} from 'express';
import {AuthService} from '@/services/AuthService';
import {logger} from '@/lib/logger';

const authService = new AuthService();

export default (router: Router) => {
    router.post('/request-password-reset', async (req: Request, res: Response) => {
        try {
            const {email} = req.body;

            if (!email) {
                return res.status(400).json({type: 'invalid_request', message: 'Email is required.'});
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({type: 'invalid_request', message: 'Invalid email format.'});
            }

            await authService.requestPasswordReset(email);

            logger.info("USER", `Password reset requested for user with email ${email}`);

            return res.status(200).json({
                type: 'success',
                message: 'If an account with that email exists, a password reset email has been sent.',
            });
        } catch (error: any) {
            logger.error('Error in password reset request:', error);
            return res.status(500).json({type: 'api_error', message: 'Internal Server Error'});
        }
    });
};
