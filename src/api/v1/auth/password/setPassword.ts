import {Request, Response, Router} from 'express';
import {AuthService} from '@/services/AuthService';
import {logger} from '@/lib/logger';
import prisma from '@/lib/prismaClient';

const authService = new AuthService();

export default (router: Router) => {
    router.post('/set-password', async (req: Request, res: Response) => {
        const {code, newPassword, confirmPassword} = req.body;

        if (!code || !newPassword || !confirmPassword) {
            return res.status(400).json({type: 'invalid_request', message: 'Missing required fields.'});
        }

        if (newPassword.length < 10) {
            return res.status(400).json({
                type: 'invalid_request',
                message: 'Password must be at least 10 characters long.',
            });
        }

        if (newPassword.length > 100) {
            return res.status(400).json({
                type: 'invalid_request',
                message: 'Password must be less than 100 characters long.',
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({type: 'invalid_request', message: 'Passwords do not match.'});
        }

        const {valid, userId} = await authService.validatePasswordResetCode(code);
        if (!valid || !userId) {
            return res.status(400).json({type: 'invalid_request', message: 'Invalid or expired code.'});
        }

        try {
            const newPasswordHash = await authService.hashPassword(newPassword);

            await prisma.$transaction(async (tx) => {
                const user = await tx.user.findUnique({where: {id: userId}});
                if (!user) {
                    throw new Error("User not found.");
                }
                await tx.user.update({
                    where: {id: userId},
                    data: {passwordHash: newPasswordHash},
                });
                await tx.passwordResetCode.delete({
                    where: {code},
                });
            });

            logger.info('USER', `Password reset for user ${userId}`);
            return res.status(200).json({type: 'success', message: 'Password changed successfully.'});
        } catch (error: any) {
            logger.error('Error updating password:', error);
            return res.status(500).json({type: 'api_error', message: 'Internal Server Error'});
        }
    });
};
