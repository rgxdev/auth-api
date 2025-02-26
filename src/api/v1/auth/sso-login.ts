import {Request, Response, Router} from 'express';
import prisma from "@/lib/prismaClient";
import {logger} from "@/lib/logger";
import {AuthService} from "@/services/AuthService";
import {URL_DOMAIN} from "@/config/config";

const authService = new AuthService();

export default (router: Router) => {
    router.get('/sso-login', async (req: Request, res: Response) => {
        let {token} = req.query;

        try {
            if (!token) {
                return res.status(400).json({type: 'invalid_request', message: 'Token required.'});
            }

            token = (token as string).split('?')[0];

            const ssoTokenRecord = await prisma.ssoToken.findUnique({
                where: {token},
                include: {user: true},
            });

            if (!ssoTokenRecord || ssoTokenRecord.expiresAt < new Date()) {
                return res.status(400).json({type: 'invalid_request', message: 'Invalid or expired token.'});
            }

            const user = ssoTokenRecord.user;
            const jwtToken = authService.generateToken(user.id, user.email);

            res.cookie('_auth.session-token', jwtToken, {
                secure: true,
                httpOnly: true,
                domain: `.${URL_DOMAIN}`,
                path: '/',
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
                sameSite: 'lax',
            });

            await prisma.ssoToken.delete({where: {id: ssoTokenRecord.id}});

            logger.info('SSO_LOGIN', `User logged in via SSO: ${user.id}`);

            return res.status(200).json({type: 'success', message: 'Logged in successfully', token: jwtToken});
        } catch (error: any) {
            logger.error('SSO_LOGIN', `Error during SSO login: ${error}`);
            return res.status(500).json({type: 'api_error', message: 'Internal server error.'});
        }
    });
};
