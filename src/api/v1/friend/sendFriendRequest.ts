import {Request, Response, Router} from 'express'
import rateLimit from 'express-rate-limit'
import {AuthService} from '@/services/AuthService'
import {FriendService} from '@/services/FriendService'
import {ERROR_MESSAGES} from '@/utils/errorMessages'
import {logger} from "@/lib/logger";

const sendFriendRequestLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: {type: 'too_many_requests', message: 'Too many requests, please try again later.'}
})

const friendService = new FriendService()
const authService = new AuthService()

export default (router: Router) => {
    router.post('/request', sendFriendRequestLimiter, authService.authenticateToken(), async (req: Request, res: Response) => {
        try {
            const {friendId} = req.body
            if (!friendId) return res.status(400).json(ERROR_MESSAGES.MISSING_FRIEND_ID)
            const user = (req as any).user
            const friendRequest = await friendService.sendFriendRequest(user.id, friendId)
            res.status(201).json({type: 'success', message: 'Friend request sent', request: friendRequest})
            logger.info('FRIENDS', `Friend request sent by: ${user.id} to ${friendId}`)
        } catch (error: any) {
            if (error.message === 'CANNOT_ADD_SELF') return res.status(400).json(ERROR_MESSAGES.CANNOT_ADD_SELF)
            if (error.message === 'FRIEND_REQUEST_ALREADY_EXISTS') return res.status(400).json(ERROR_MESSAGES.FRIEND_REQUEST_ALREADY_EXISTS)
            res.status(500).json({type: 'api_error', message: 'Internal server error'})
            logger.error('FRIENDS', `Error sending friend request: ${error}`)
        }
    })
}
