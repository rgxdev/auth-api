import {Request, Response, Router} from 'express'
import rateLimit from 'express-rate-limit'
import {AuthService} from '@/services/AuthService'
import {FriendService} from '@/services/FriendService'
import {ERROR_MESSAGES} from '@/utils/errorMessages'
import {logger} from "@/lib/logger";

const removeFriendLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: {type: 'too_many_requests', message: 'Too many requests, please try again later.'}
})

const friendService = new FriendService()
const authService = new AuthService()

export default (router: Router) => {
    router.delete('/remove/:friendId', removeFriendLimiter, authService.authenticateToken(), async (req: Request, res: Response) => {
        try {
            const {friendId} = req.params
            if (!friendId) return res.status(400).json(ERROR_MESSAGES.MISSING_FRIEND_ID)
            const user = (req as any).user
            await friendService.removeFriend(user.id, friendId)
            res.status(200).json({type: 'success', message: 'Friend removed successfully'})
            logger.info('FRIENDS', `Friend ${friendId} removed by: ${user.id}`)
        } catch (error: any) {
            if (error.message === 'FRIEND_REQUEST_NOT_FOUND') return res.status(404).json(ERROR_MESSAGES.FRIEND_REQUEST_NOT_FOUND)
            res.status(500).json({type: 'api_error', message: 'Internal server error'})
            logger.error('FRIENDS', `Error removing friend: ${error}`)
        }
    })
}
