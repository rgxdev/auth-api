// src/api/v1/@me/updateUser.ts

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
    router.put('/', authenticate, async (req, res) => {
        const user = (req as any).user
        if (!user) {
            return res.status(401).json({message: 'Unauthorized'})
        }
        try {
            const payload = req.body
            const updatedSettings = await userService.updateUser(user.id, payload)
            return res.status(200).json({
                message: 'User updated successfully',
                updatedSettings
            })
        } catch (error: any) {
            logger.error('Error updating user:', error.message)
            return res.status(error.status || 500).json({
                message: error.message || 'Failed to update user'
            })
        }
    })
};
