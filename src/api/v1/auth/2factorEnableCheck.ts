// src/routes/v1/auth/2factorEnableCheck.ts

import {Request, Response, Router} from 'express';
import prisma from "@/lib/prismaClient";
import {logger} from "@/lib/logger";
import {AuthService} from "@/services/AuthService";
import {TwoFactorAuthService} from "@/services/TwoFactorAuthService";

const twoFactorAuthService = new TwoFactorAuthService();
const authService = new AuthService();

export default (router: Router) => {
    router.post('/verify-2fa-enable', authService.authenticateToken(), async (req: Request, res: Response) => {
        const {twoFactorCode} = req.body;

        try {
            const user = (req as any).user;
            if (!user) {
                return res.status(404).json({type: 'invalid_request', message: 'User not found.'});
            }

            if (user.isTwoFactorEnabled) {
                return res.status(400).json({
                    type: 'invalid_request',
                    message: '2FA is already enabled for this account.'
                });
            }

            const result = twoFactorAuthService.check2FACodeValid(twoFactorCode, user);

            if (result.type !== 'success') {
                return res.status(400).json(result);
            }

            await prisma.user.update({
                where: {id: user.id},
                data: {isTwoFactorEnabled: true},
            });

            logger.info('2FA_ENABLE', `2FA finally enabled for: ${user.id}`);
            return res.status(200).json(result);

        } catch (error: any) {
            logger.error('2FA_VERIFY', `Error verifying 2FA: ${error}`);
            return res.status(500).json({type: 'api_error', message: 'Internal server error.'});
        }
    });
};
