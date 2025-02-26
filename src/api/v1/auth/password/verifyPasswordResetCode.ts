// src/api/v1/auth/password/updatePassword.ts

import {Request, Response, Router} from 'express';
import {AuthService} from '@/services/AuthService';
import {logger} from '@/lib/logger';

const authService = new AuthService();

export default (router: Router) => {
    router.post('/verify-password-reset-code', async (req: Request, res: Response) => {
        try {
            const {code} = req.body;

            if (!code) {
                return res.status(400).json({type: 'invalid_request', message: 'Code is required.'});
            }

            const isValid = await authService.verifyPasswordResetCode(code);

            if (!isValid) {
                return res.status(400).json({type: 'invalid_request', message: 'Invalid or expired code.'});
            }

            logger.info("USER", `Password reset code verified for user associated with code ${code}`);

            return res.status(200).json({
                type: 'success',
                message: 'Code verified. You can now set a new password.',
            });
        } catch (error: any) {
            logger.error('Error verifying password reset code:', error);
            return res.status(500).json({type: 'api_error', message: 'Internal Server Error'});
        }
    });
};
