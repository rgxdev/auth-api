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
    router.get('/settings', authenticate, async (req, res) => {
        const user = (req as any).user;
        if (!user) {
            return res.status(401).json({message: 'Unauthorized'});
        }

        try {
            const userData = await userService.getUserDataForSettings(user.id);

            res.status(200).json(userData);

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

    router.put('/settings', authenticate, async (req, res) => {
        const user = (req as any).user
        if (!user) {
            return res.status(401).json({message: 'Unauthorized'})
        }
        try {
            const payload = req.body
            const updatedSettings = await userService.updateUserSettings(user.id, payload)
            return res.status(200).json({
                message: 'User settings updated successfully',
                updatedSettings
            })
        } catch (error: any) {
            logger.error('Error updating user settings:', error.message)
            return res.status(error.status || 500).json({
                message: error.message || 'Failed to update user settings'
            })
        }
    })
};
