import prisma from '@/lib/prismaClient';
import {randomBytes} from 'crypto';

export const generateSsoToken = async (userId: string) => {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    await prisma.ssoToken.create({
        data: {
            userId,
            token,
            expiresAt,
        },
    });

    return token;
};


