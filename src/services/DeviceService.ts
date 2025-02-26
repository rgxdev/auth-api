import prisma from '@/lib/prismaClient';
import {Request} from 'express';
import {sendIPMail} from '@/utils/mailer';
import {logger} from '@/lib/logger';
import {Device} from '@prisma/client';

export class DeviceService {
    async addNewDevice(user: any, req: Request): Promise<void> {
        const ipAddress = req.header("CF-Connecting-IP") || '0.0.0.0';
        const userAgent = req.headers['user-agent'] || 'unknown';
        const fingerprint = (req.headers['x-device-fingerprint'] as string) || null;
        try {
            let device: Device | null = null;
            if (fingerprint) {
                device = await prisma.device.findFirst({
                    where: {fingerprint}
                });
            }
            if (!device) {
                device = await prisma.device.findFirst({
                    where: {ipAddress, userAgent}
                });
            }
            if (!device) {
                device = await prisma.device.create({
                    data: {
                        userId: user.id,
                        ipAddress,
                        userAgent,
                        fingerprint,
                        lastOnline: new Date()
                    }
                });
                await sendIPMail(user, req);
            } else {
                device = await prisma.device.update({
                    where: {id: device.id},
                    data: {
                        ipAddress,
                        userAgent,
                        fingerprint,
                        lastOnline: new Date()
                    }
                });
            }
        } catch (error: any) {
            logger.error("Failed to add/update device:", error);
            throw new Error('Failed to add/update device');
        }
    }

    async getUserDevices(userId: string): Promise<Device[]> {
        try {
            return await prisma.device.findMany({where: {userId}});
        } catch (error: any) {
            logger.error('Error retrieving user devices:', error);
            throw new Error('Failed to retrieve devices');
        }
    }
}
