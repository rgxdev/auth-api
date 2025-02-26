import cron from 'node-cron';
import prisma from '@/lib/prismaClient';
import {logger} from '@/lib/logger';
import {sendMail} from '@/utils/mailer';
import getDeletedEmail from '@/mails/deletedEmail';
import getWarningEmail from '@/mails/warningEmail';
import {DISABLE_SEND_MAIL, SERVICE_NAME} from "@/config/config";

const deleteExpiredWhitelistEntries = async () => {
    try {

        if (DISABLE_SEND_MAIL) return logger.log('AUTOMATION', 'E-Mail-Versand deaktiviert');

        const now = new Date();
        const twoDaysFromNow = new Date();
        twoDaysFromNow.setDate(now.getDate() + 2);
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(now.getDate() + 3);

        const expiredKeys = await prisma.registerKeys.findMany({
            where: {
                expiresAt: {
                    lte: now,
                },
            },
            include: {
                user: true,
            },
        });

        const emailIdsToDelete = expiredKeys.map((key) => key.userId);

        await prisma.registerKeys.deleteMany({
            where: {
                userId: {
                    in: emailIdsToDelete,
                },
            },
        });

        await prisma.user.deleteMany({
            where: {
                id: {
                    in: emailIdsToDelete,
                },
            },
        });

        for (const key of expiredKeys) {
            const email = key.user.email;
            try {
                const htmlContent = getDeletedEmail();
                await sendMail({email}, htmlContent, `Auf Wiedersehen von ${SERVICE_NAME}`);
                logger.log('MAILER', `Verabschiedungs-E-Mail gesendet an: ${email}`);
            } catch (error) {
                logger.error('MAILER', `Fehler beim Senden der Verabschiedungs-E-Mail an: ${email}`);
            }
        }

        const expiringSoonKeys = await prisma.registerKeys.findMany({
            where: {
                expiresAt: {
                    gte: twoDaysFromNow,
                    lte: threeDaysFromNow,
                },
            },
            include: {
                user: true,
            },
        });

        for (const key of expiringSoonKeys) {
            const email = key.user.email;
            try {
                const htmlContent = getWarningEmail(key.key);
                await sendMail({email}, htmlContent, 'Dein Account wird bald gelöscht!');
                logger.log('MAILER', `Warn-E-Mail gesendet an: ${email}`);
            } catch (error) {
                logger.error('MAILER', `Fehler beim Senden der Warn-E-Mail an: ${email}`);
            }
        }

        logger.log('AUTOMATION', 'Abgelaufene Whitelist-Einträge wurden gelöscht und Warn-E-Mails versendet');
    } catch (error) {
        logger.error('AUTOMATION', `Fehler beim Löschen der Whitelist-Einträge oder Versenden der E-Mails: ${(error as Error).message}`);
    }
};

cron.schedule('0 0 * * *', deleteExpiredWhitelistEntries);

export default deleteExpiredWhitelistEntries;
