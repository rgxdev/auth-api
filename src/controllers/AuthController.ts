// src/controllers/AuthController.ts

import {Request, Response} from 'express';
import {AuthService, roles} from '@/services/AuthService';
import {UserService} from '@/services/UserService';
import {TwoFactorAuthService} from '@/services/TwoFactorAuthService';
import prisma from '@/lib/prismaClient';
import {logger} from '@/lib/logger';
import {DeviceService} from "@/services/DeviceService";
import {BETA_MODE, SERVICE_NAME, URL_DOMAIN, URL_PROTOCOL} from "@/config/config";

export class AuthController {
    private authService: AuthService;
    private userService: UserService;
    private twoFactorAuthService: TwoFactorAuthService;
    private deviceService: DeviceService;

    constructor(authService: AuthService, userService: UserService, twoFactorAuthService: TwoFactorAuthService, deviceService: DeviceService) {
        this.authService = authService;
        this.userService = userService;
        this.twoFactorAuthService = twoFactorAuthService;
        this.deviceService = new DeviceService();
    }

    async login(req: Request, res: Response): Promise<void> {
        const {email, password} = req.body;

        logger.log('USER', `Login attempt with: ${email}`);

        try {
            const user = await prisma.user.findUnique({
                where: {email},
            });

            if (!user) {
                res.status(404).json({type: 'invalid_credentials', message: 'Invalid email or password.'});
                return;
            }

            if (user.isBanned) {
                res.status(401).json({
                    type: 'auth_error',
                    message: "You're banned from this platform."
                });
                return;
            }

            if (user.isVerified === false) {
                res.status(401).json({
                    type: 'auth_error',
                    message: "Your email is not verified."
                });
                return;
            }

            if (BETA_MODE) {
                if (roles[user.role] < roles['BETA']) {
                    res.status(403).json({
                        type: 'auth_error',
                        message: 'You do not have permission to access this platform.'
                    });
                    return;
                }
            }


            if (password) {
                if (!user.passwordHash) {
                    res.status(401).json({type: 'invalid_credentials', message: 'Invalid email or password.'});
                    return;
                }

                const isPasswordValid = await this.authService.comparePassword(password, user.passwordHash);
                if (!isPasswordValid) {
                    res.status(401).json({type: 'invalid_credentials', message: 'Invalid email or password.'});
                    return;
                }

                if (user.isTwoFactorEnabled) {
                    res.status(200).json({
                        type: 'two_factor',
                        message: 'Two-factor authentication required.'
                    });
                    return;
                }

                const jwtToken = this.authService.generateToken(user.id, user.email);

                res.cookie('_auth.session-token', jwtToken, {
                    secure: true,
                    httpOnly: true,
                    path: '/',
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
                    sameSite: 'lax',
                });

                res.status(200).json({
                    type: 'success',
                    message: 'Login successful.',
                    token: jwtToken,
                    user: {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        nickname: user.nickname,
                        role: user.role,
                    },
                });

                await this.deviceService.addNewDevice(user, req);
                return;
            }

            if (user.isTwoFactorEnabled) {
                res.status(200).json({
                    type: 'two_factor',
                    message: 'Two-factor authentication is enabled for this account.',
                });
                return;
            }

            const ssoToken = await this.authService.generateSsoToken(user.id);
            const ssoUrl = `${URL_PROTOCOL}://api.${URL_DOMAIN}/auth/sso-login?token=${ssoToken}`;

            const htmlContent = `Click <a href="${ssoUrl}">here</a> to log in. This link is valid for 30 minutes.`;
            await this.authService.sendMail(user.email, htmlContent, `Your ${SERVICE_NAME} SSO Login`);

            res.status(200).json({
                type: 'success',
                message: 'SSO login link sent to your email.',
            });
        } catch (error: any) {
            logger.error('LOGIN', `Login error: ${error}`);
            res.status(500).json({message: 'Internal server error.'});
        }
    }
}
