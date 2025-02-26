import {Request, Response, Router} from 'express';
import {AuthService} from '@/services/AuthService';
import {logger} from '@/lib/logger';
import {authenticator} from 'otplib';
import qrcode from 'qrcode';
import prisma from '@/lib/prismaClient';
import {TWO_FACTOR_ISSUER, TWO_FACTOR_PERIOD} from "@/config/config";

const authService = new AuthService();

export default (router: Router) => {
    router.post('/enable-2fa', authService.authenticateToken(), async (req: Request, res: Response) => {
        try {
            const user = (req as any).user;

            if (!user) {
                return res.status(404).json({type: 'invalid_request', message: 'User not found.'});
            }
            const email = user.email;
            if (user.isTwoFactorEnabled) {
                return res.status(400).json({
                    type: 'invalid_request',
                    message: '2FA is already enabled for this account.'
                });
            }

            const twoFactorSecret = authenticator.generateSecret(TWO_FACTOR_PERIOD);
            const otpauthUrl = authenticator.keyuri(email, TWO_FACTOR_ISSUER, twoFactorSecret);
            const qrCodeImageUrl = await qrcode.toDataURL(otpauthUrl);

            await prisma.user.update({
                where: {id: user.id},
                data: {twoFactorSecret},
            });

            logger.info('2FA_ENABLE', `2FA enabled for: ${user.id}`);

            return res.status(200).json({
                type: 'success',
                message: 'Scan the QR code with your authenticator app.',
                qrCodeImageUrl,
            });
        } catch (error: any) {
            logger.error('2FA_ENABLE', `Error enabling 2FA: ${error}`);
            return res.status(500).json({type: 'api_error', message: 'Internal server error.'});
        }
    });
};
