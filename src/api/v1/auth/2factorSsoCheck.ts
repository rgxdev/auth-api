// src/routes/v1/auth/2factorSsoCheck.ts

import {Request, Response, Router} from 'express';
import rateLimit from "express-rate-limit";
import prisma from "@/lib/prismaClient";
import {logger} from "@/lib/logger";
import {TwoFactorAuthService} from "@/services/TwoFactorAuthService";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "@/config/config";

const verify2FALimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: {type: 'too_many_requests', message: 'Too much trys, please try again later.'},
});

const twoFactorAuthService = new TwoFactorAuthService();

export default (router: Router) => {
    router.post('/verify-sso-2fa', verify2FALimiter, async (req: Request, res: Response) => {
        const {email, twoFactorCode} = req.body;

        try {
            if (!email) {
                return res.status(400).json({type: 'invalid_request', message: 'Email is required.'});
            }
            const user = await prisma.user.findUnique({
                where: {email},
            });

            if (!user) {
                return res.status(401).json({type: 'invalid_credentials', message: 'Invalid email or password.'});
            }

            const result = twoFactorAuthService.check2FACodeValid(twoFactorCode, user);

            if (result.type !== 'success') {
                return res.status(400).json(result);
            }

            const jwtToken = jwt.sign({userId: user.id, email: user.email}, JWT_SECRET, {
                expiresIn: '30d',
                algorithm: 'HS256',
            });

            return res.status(200).json({
                type: 'success',
                message: '2FA verification successful.',
                token: jwtToken,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    nickname: user.nickname,
                    role: user.role,
                },
            });

        } catch (error: any) {
            logger.error('2FA_VERIFY', `Error verifying 2FA: ${error}`);
            return res.status(500).json({type: 'api_error', message: 'Internal server error.'});
        }
    });
};
