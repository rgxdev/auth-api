import {Router} from 'express';
import getWelcomeEmail from "@/mails/welcomeEmail";
import {sendMail} from "@/utils/mailer";
import {logger} from "@/lib/logger";
import prisma from "@/lib/prismaClient";
import {AuthService} from "@/services/AuthService";
import {SERVICE_NAME} from "@/config/config";

const authService = new AuthService();

export default (router: Router) => {
    router.post('/resend-verify', authService.authenticateToken("OWNER"), async (req, res) => {
        let {userId} = req.query;
        userId = (userId as string).split('?')[0];
        const ipAddress = req.header('CF-Connecting-IP') || req.ip || '0.0.0.0';

        try {

            if (!userId) {
                return res.status(400).json({type: 'invalid_request', message: 'User ID is required'});
            }

            const user = await prisma.user.findUnique({
                where: {id: userId},
                include: {
                    RegisterKeys: true,
                },
            });

            if (!user) {
                return res.status(400).json({type: 'invalid_request', message: 'User not found'});
            }

            const whitelistKey = await prisma.registerKeys.create({
                data: {
                    key: authService.generateRandomString(10),
                    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
                    ip: ipAddress,
                    userId: user.id,
                },
            });

            try {
                const htmlContent = getWelcomeEmail(whitelistKey.key);
                await sendMail(user, htmlContent, 'Verify your ' + SERVICE_NAME + ' Whitelist Account');
                logger.log('MAILER', `Verification email sent successfully to: ${user.email}`);
                return res.status(200).json({type: 'success', message: 'Verification email sent successfully'});

            } catch {
                logger.error('MAILER', `Failed to send verification email: ${user.email}`);
            }
        } catch (error) {
            logger.error('MAILER', `Failed to send verification email: ${error}`);
        }
        return res.status(500).json({type: 'api_error', message: 'Internal server error'});
    });
};