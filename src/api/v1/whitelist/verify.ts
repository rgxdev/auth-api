// src/api/v1/whitelist/verify.ts

import {Router} from 'express';
import prisma from "@/lib/prismaClient";
import {logger} from "@/lib/logger";

export default (router: Router) => {
    router.post('/verify', async (req, res) => {

        try {
            const {key} = req.query;
            const tokenRecord = await prisma.registerKeys.findUnique({
                where: {key: key as string},
                include: {user: true},
            });

            if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
                return res.status(400).json({type: 'invalid_request', message: 'Token is invalid or has expired'});
            }

            await prisma.registerKeys.delete({where: {id: tokenRecord.id}});

            try {
                logger.info("WHITELIST", 'Whitelist verification email sent to: ' + tokenRecord.user.email);
            } catch {
                logger.error('MAILER', `Failed to send verification email: ${tokenRecord.user.email}`);
            }

            await prisma.user.update({
                where: {id: tokenRecord.user.id},
                data: {isVerified: true},
            });

            logger.info("WHITELIST", 'Whitelist account verified for: ' + tokenRecord.user.id);

            return res.status(200).send({type: 'invalid_request', message: 'Email verified successfully'});
        } catch {
            logger.error('WHITELIST', `Failed to verify email`);
            return res.status(500).send({type: 'api_error', message: 'Failed to verify email'});
        }
    });
};
