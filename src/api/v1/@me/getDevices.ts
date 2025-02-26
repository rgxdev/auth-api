// src/routes/v1/@me/getDevices.ts

import {Request, Response, Router} from 'express';
import {AuthService} from "@/services/AuthService";
import {DeviceService} from "@/services/DeviceService";

const authService = new AuthService();
const deviceService = new DeviceService();

export default (router: Router) => {
    router.get('/devices', authService.authenticateToken(), async (req: Request, res: Response) => {
        const user = (req as any).user;
        if (!user) {
            return res.status(401).json({message: 'Unauthorized'});
        }

        const devices = await deviceService.getUserDevices(user.id);

        return res.status(200).json(devices);
    });
};
