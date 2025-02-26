// src/services/ReferralService.ts

import {randomBytes} from 'crypto';
import prisma from '@/lib/prismaClient';
import {logger} from '@/lib/logger';

export class ReferralService {

    generateReferralCode(): string {
        return randomBytes(8).toString('hex');
    }

    async assignReferralCodesToAllUsers(): Promise<void> {
        try {
            const usersWithoutReferralCode = await prisma.user.findMany({
                //@ts-ignore
                where: {referralCode: null}
            });

            logger.info("REFERRAL", `Found ${usersWithoutReferralCode.length} users without referral codes.`);

            for (const user of usersWithoutReferralCode) {
                const referralCode = this.generateReferralCode();

                await prisma.user.update({
                    where: {id: user.id},
                    data: {referralCode, role: 'USER', isTwoFactorEnabled: false},
                });

                logger.info("REFERRAL", `Referral code ${referralCode} assigned to user ${user.email}`);
            }

            logger.info("REFERRAL", 'All users have been assigned referral codes.');
        } catch (error: any) {
            logger.error('Error assigning referral codes:', error);
            throw new Error('Failed to assign referral codes');
        }
    }
}
