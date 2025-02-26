// src/api/v1/friend/declineFriendRequest.ts

import {Request, Response, Router} from 'express'
import rateLimit from 'express-rate-limit'
import {AuthService} from '@/services/AuthService'
import {FriendService} from '@/services/FriendService'
import {ERROR_MESSAGES} from '@/utils/errorMessages'
import {logger} from "@/lib/logger";

const declineFriendRequestLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: {type: 'too_many_requests', message: 'Too many requests, please try again later.'}
})

const friendService = new FriendService()
const authService = new AuthService()

export default (router: Router) => {
    router.post('/decline', declineFriendRequestLimiter, authService.authenticateToken(), async (req: Request, res: Response) => {
        try {
            const {friendshipId} = req.body
            if (!friendshipId) return res.status(400).json(ERROR_MESSAGES.FRIEND_REQUEST_NOT_FOUND)
            const user = (req as any).user
            const declinedRequest = await friendService.declineFriendRequest(user.id, friendshipId)
            res.status(200).json({type: 'success', message: 'Friend request declined', request: declinedRequest})
            logger.info('FRIENDS', `Friend request from ${friendshipId} declined by: ${user.id}`)
        } catch (error: any) {
            if (error.message === 'FRIEND_REQUEST_NOT_FOUND') return res.status(404).json(ERROR_MESSAGES.FRIEND_REQUEST_NOT_FOUND)
            res.status(500).json({type: 'api_error', message: 'Internal server error'})
            logger.error('FRIENDS', `Error declining friend request: ${error}`)
        }
    })
}
