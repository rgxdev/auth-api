import prisma from '@/lib/prismaClient';

export class StatsService {
    async getLastUserRegister(): Promise<Date | null> {
        const lastUser = await prisma.user.findFirst({
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                createdAt: true,
            },
        });
        return lastUser?.createdAt || null;
    }

    async getRegisteredUsers(): Promise<number> {
        const count = await prisma.user.count();
        return count;
    }
}
