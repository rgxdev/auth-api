// src/services/UserService.ts

import prisma from '@/lib/prismaClient';
import {Response} from 'express';
import {logger} from '@/lib/logger';
import {User} from '@prisma/client';

export class UserService {
    async getUserDetails(userId: string): Promise<Omit<User, 'passwordHash' | 'twoFactorSecret'>> {
        try {
            const user: User | null = await prisma.user.findUnique({where: {id: userId}});
            if (!user) {
                throw {status: 404, message: 'User not found'};
            }
            return user;
        } catch (error: any) {
            logger.error('Error retrieving user details:', error);
            throw {status: error.status || 500, message: error.message || 'Failed to retrieve user details'};
        }
    }

    async getUserDataForSettings(userId: string): Promise<any> {
        try {
            const [user, referralCount] = await Promise.all([
                prisma.user.findUnique({
                    where: {id: userId},
                    include: {UserSettings: true, Device: true}
                }),
                prisma.referral.count({
                    where: {referrerId: userId}
                })
            ])
            if (!user) {
                throw {status: 404, message: 'User not found'}
            }
            const {passwordHash, twoFactorSecret, ip, ...safeUser} = user
            return {...safeUser, referralCount}
        } catch (error: any) {
            logger.error('Error retrieving user settings:', error)
            throw {status: error.status || 500, message: error.message || 'Failed to retrieve user settings'}
        }
    }


    async updateUser(userId: string, payload: any): Promise<any> {
        try {
            const allowedFields = ['email', 'nickname', 'username', 'avatar', 'bio', 'urls']
            const updateData = Object.keys(payload)
                .filter(key => allowedFields.includes(key))
                .reduce((acc, key) => {
                    acc[key] = payload[key]
                    return acc
                }, {} as Record<string, any>)
            if (Object.keys(updateData).length === 0) {
                throw {status: 400, message: 'No valid fields provided for update'}
            }
            const updatedUser = await prisma.user.update({
                where: {id: userId},
                data: updateData
            })
            logger.log('User updated:', updatedUser.id)
            return updatedUser
        } catch (error: any) {
            logger.error('Error updating user:', error)
            throw {status: error.status || 500, message: error.message || 'Failed to update user'}
        }
    }

    async updateUserSettings(userId: string, payload: any): Promise<any> {
        try {
            const allowedSettings = [
                'emailNotifications',
                'marketingEmails',
                'securityEmails',
                'appNotifications',
                'darkMode',
                'language'
            ]
            const updateData = Object.keys(payload)
                .filter(key => allowedSettings.includes(key))
                .reduce((acc, key) => {
                    acc[key] = payload[key]
                    return acc
                }, {} as Record<string, any>)
            if (Object.keys(updateData).length === 0) {
                throw {status: 400, message: 'No valid settings provided for update'}
            }

            let settings = await prisma.userSettings.findUnique({
                where: {userId}
            });

            if (!settings) {
                settings = await prisma.userSettings.create({
                    data: {
                        ...updateData,
                        userId
                    }
                });
                return settings
            }

            settings = await prisma.userSettings.update({
                where: {userId},
                data: updateData
            });

            return settings
        } catch (error: any) {
            logger.error('Error updating user settings:', error)
            throw {status: error.status || 500, message: error.message || 'Failed to update user settings'}
        }
    }


    async returnUserByRequest(userId: string, res: Response): Promise<Response> {
        try {
            const userDetails = await this.getUserDetails(userId);
            return res.status(200).json(userDetails);
        } catch (error: any) {
            if (error.status === 404) {
                return res.status(404).json({type: 'invalid_request', message: 'User not found'});
            }
            return res.status(500).json({type: 'api_error', message: 'Internal Server Error'});
        }
    }
}
