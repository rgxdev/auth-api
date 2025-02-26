// src/api/v1/auth/password/updatePassword.ts

import {Request, Response, Router} from 'express';
import {AuthService} from '@/services/AuthService';
import {logger} from '@/lib/logger';

const authService = new AuthService();

export default (router: Router) => {
    router.post('/update-password', authService.authenticateToken(), async (req: Request, res: Response) => {
        try {
            const {oldPassword, password, password_confirm} = req.body;

            if (!oldPassword || !password || !password_confirm) {
                return res.status(400).json({type: 'invalid_request', message: 'Missing required fields.'});
            }

            if (password !== password_confirm) {
                return res.status(400).json({type: 'invalid_request', message: 'Passwords do not match.'});
            }

            if (password.length < 8 || password.length > 100) {
                return res.status(400).json({
                    type: 'invalid_request',
                    message: 'Password must be between 8 and 100 characters long.',
                });
            }

            const user = (req as any).user;

            if (!user) {
                return res.status(404).json({type: 'invalid_request', message: 'User not found.'});
            }

            if (!user.passwordHash) {
                return res.status(400).json({type: 'invalid_request', message: 'Password is not set.'});
            }

            const isOldPasswordValid = await authService.verifyPassword(user.id, oldPassword);

            if (!isOldPasswordValid) {
                return res.status(400).json({type: 'invalid_request', message: 'Old password is incorrect.'});
            }

            const isSamePassword = await authService.verifyPassword(user.id, password);

            if (isSamePassword) {
                return res.status(400).json({
                    type: 'invalid_request',
                    message: 'New password must not be the same as the old password.',
                });
            }

            await authService.updatePassword(user.id, password);

            logger.info("USER", `Password updated for user ${user.id}`);

            return res.status(200).json({type: 'success', message: 'Password updated successfully.'});
        } catch (error: any) {
            logger.error('Error updating password:', error);
            return res.status(500).json({type: 'api_error', message: 'Internal Server Error.'});
        }
    });
};
