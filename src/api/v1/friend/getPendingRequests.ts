// src/api/v1/friend/getPendingRequests.ts

import {Request, Response, Router} from 'express'
import rateLimit from 'express-rate-limit'
import {AuthService} from '@/services/AuthService'
import {FriendService} from '@/services/FriendService'

const getPendingRequestsLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    message: {type: 'too_many_requests', message: 'Too many requests, please try again later.'}
})

const friendService = new FriendService()
const authService = new AuthService()

export default (router: Router) => {
    router.get('/pending', getPendingRequestsLimiter, authService.authenticateToken(), async (req: Request, res: Response) => {
        try {
            const user = (req as any).user
            const pendingRequests = await friendService.getPendingRequests(user.id)
            res.status(200).json({type: 'success', pending: pendingRequests})
        } catch (error: any) {
            res.status(500).json({type: 'api_error', message: 'Internal server error'})
        }
    })
}
