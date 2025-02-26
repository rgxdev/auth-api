import prisma from '@/lib/prismaClient'
import {Friendship, FriendshipStatus, User} from '@prisma/client'

export class FriendService {
    async sendFriendRequest(userId: string, friendId: string): Promise<Friendship> {
        if (userId === friendId) {
            throw new Error('CANNOT_ADD_SELF')
        }
        const existingRequest = await prisma.friendship.findFirst({
            where: {
                OR: [
                    {requesterId: userId, receiverId: friendId},
                    {requesterId: friendId, receiverId: userId}
                ]
            }
        })
        if (existingRequest) {
            throw new Error('FRIEND_REQUEST_ALREADY_EXISTS')
        }
        return prisma.friendship.create({
            data: {
                requesterId: userId,
                receiverId: friendId,
                status: FriendshipStatus.PENDING
            }
        });
    }

    async acceptFriendRequest(userId: string, friendshipId: string): Promise<Friendship> {
        const friendship = await prisma.friendship.findFirst({
            where: {id: friendshipId, receiverId: userId, status: FriendshipStatus.PENDING}
        })
        if (!friendship) {
            throw new Error('FRIEND_REQUEST_NOT_FOUND')
        }
        return prisma.friendship.update({
            where: {id: friendshipId},
            data: {status: FriendshipStatus.ACCEPTED}
        });
    }

    async declineFriendRequest(userId: string, friendshipId: string): Promise<Friendship> {
        const friendship = await prisma.friendship.findFirst({
            where: {id: friendshipId, receiverId: userId, status: FriendshipStatus.PENDING}
        })
        if (!friendship) {
            throw new Error('FRIEND_REQUEST_NOT_FOUND')
        }
        return prisma.friendship.update({
            where: {id: friendshipId},
            data: {status: FriendshipStatus.DECLINED}
        });
    }

    async removeFriend(userId: string, friendId: string): Promise<boolean> {
        const friendship = await prisma.friendship.findFirst({
            where: {
                OR: [
                    {requesterId: userId, receiverId: friendId, status: FriendshipStatus.ACCEPTED},
                    {requesterId: friendId, receiverId: userId, status: FriendshipStatus.ACCEPTED}
                ]
            }
        })
        if (!friendship) {
            throw new Error('FRIEND_REQUEST_NOT_FOUND')
        }
        await prisma.friendship.delete({
            where: {id: friendship.id}
        })
        return true
    }

    async getFriends(userId: string): Promise<Friendship[]> {
        return prisma.friendship.findMany({
            where: {
                OR: [
                    {requesterId: userId, status: FriendshipStatus.ACCEPTED},
                    {receiverId: userId, status: FriendshipStatus.ACCEPTED}
                ]
            },
            include: {
                requester: {select: {id: true, email: true}},
                receiver: {select: {id: true, email: true}}
            }
        });
    }

    async getPendingRequests(userId: string): Promise<Friendship[]> {
        return prisma.friendship.findMany({
            where: {receiverId: userId, status: FriendshipStatus.PENDING},
            include: {
                requester: {select: {id: true, email: true}}
            }
        });
    }

    async getSentRequests(userId: string): Promise<Friendship[]> {
        return prisma.friendship.findMany({
            where: {requesterId: userId, status: FriendshipStatus.PENDING},
            include: {
                receiver: {select: {id: true, email: true}}
            }
        });
    }

    async searchFriends(userId: string, query: string): Promise<Partial<User>[]> {
        return prisma.user.findMany({
            where: {
                email: {contains: query, mode: 'insensitive'},
                NOT: {id: userId}
            },
            select: {id: true, email: true}
        })
    }
}
