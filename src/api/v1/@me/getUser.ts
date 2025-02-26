// src/api/v1/@me/getUser.ts

import {Router} from 'express';
import {Container} from 'inversify';
import {AuthService} from "@/services/AuthService";
import {UserService} from "@/services/UserService";
import {logger} from "@/lib/logger";
import {DeviceService} from "@/services/DeviceService";

const authService = new AuthService();
const userService = new UserService();
const deviceService = new DeviceService();

const authenticate = authService.authenticateToken();

export default (router: Router, container: Container) => {
    router.get('/', authenticate, async (req, res) => {
        const user = (req as any).user;
        if (!user) {
            return res.status(401).json({message: 'Unauthorized'});
        }

        try {
            const userData = await userService.getUserDetails(user.id);

            const userDetails = {
                id: userData.id,
                email: userData.email,
                username: userData?.username,
                nickname: userData?.nickname,
                avatar: userData?.avatar,
                bio: userData?.bio,
                role: userData.role,
                isTwoFactorEnabled: userData.isTwoFactorEnabled,
                createdAt: userData.createdAt
            };

            res.status(200).json(userDetails);

            deviceService.addNewDevice(userData, req).catch(error => {
                logger.error('Error adding new device:', error);
            });
        } catch (error: any) {
            logger.error('Error fetching user profile:', error);
            return res.status(error.status || 500).json({
                type: 'api_error',
                message: error.message || 'Internal Server Error'
            });
        }
    });
};
