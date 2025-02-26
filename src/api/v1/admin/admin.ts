import {Request, Response, Router} from 'express'
import prisma from '@/lib/prismaClient'
import {AuthService} from '@/services/AuthService'
import {logger} from "@/lib/logger";

const adminRouter = Router()
const authService = new AuthService()

adminRouter.use(authService.authenticateToken("OWNER"))

adminRouter.get('/users', async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {id: true, email: true, role: true, username: true, nickname: true, createdAt: true}
        })
        res.json({type: 'success', users})
    } catch (error: any) {
        res.status(500).json({type: 'api_error', message: 'Internal server error'})
    }
})

adminRouter.get('/user/:userId', async (req: Request, res: Response) => {
    try {
        const {userId} = req.params
        const user = await prisma.user.findUnique({
            where: {id: userId},
            include: {
                Device: true,
                RegisterKeys: true,
                referrals: true,
                referredUsers: true,
                PasswordResetCode: true,
                friendRequests: true,
                friendReceives: true,
                UserSettings: true
            }
        })
        if (!user) {
            return res.status(404).json({type: 'not_found', message: 'User not found'})
        }
        res.json({type: 'success', user})
        logger.info('User fetched by an admin:', user.id)
    } catch (error: any) {
        res.status(500).json({type: 'api_error', message: 'Internal server error'})
        logger.error('Error fetching user by an admin:', error)
    }
})

adminRouter.put('/user/:userId', async (req: Request, res: Response) => {
    try {
        const {userId} = req.params
        const {role, isBanned, isVerified, username, nickname, email, avatar, bio} = req.body
        const user = await prisma.user.findUnique({where: {id: userId}})
        if (!user) {
            return res.status(404).json({type: 'not_found', message: 'User not found'})
        }
        const updatedUser = await prisma.user.update({
            where: {id: userId},
            data: {
                role: role || user.role,
                isBanned: typeof isBanned !== 'undefined' ? isBanned : user.isBanned,
                isVerified: typeof isVerified !== 'undefined' ? isVerified : user.isVerified,
                username: username || user.username,
                nickname: nickname || user.nickname,
                email: email || user.email,
                avatar: avatar || user.avatar,
                bio: bio || user.bio
            }
        })
        res.json({type: 'success', user: updatedUser})
        logger.info('User updated:', updatedUser.id)
    } catch (error: any) {
        res.status(500).json({type: 'api_error', message: 'Internal server error'})
        logger.error('Error updating user:', error)
    }
})

adminRouter.delete('/user/:userId', async (req: Request, res: Response) => {
    try {
        const {userId} = req.params
        const user = await prisma.user.findUnique({where: {id: userId}})
        if (!user) {
            return res.status(404).json({type: 'not_found', message: 'User not found'})
        }
        await prisma.user.delete({where: {id: userId}})
        res.json({type: 'success', message: 'User deleted successfully'})
        logger.info('User deleted by admin:', user.id)
    } catch (error: any) {
        res.status(500).json({type: 'api_error', message: 'Internal server error'})
        logger.error('Error deleting user:', error)
    }
})

export default (router: Router) => {
    router.use('/', adminRouter)
}
