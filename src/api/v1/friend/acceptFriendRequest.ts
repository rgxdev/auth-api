import {Request, Response, Router} from 'express'
import rateLimit from 'express-rate-limit'
import {AuthService} from '@/services/AuthService'
import {FriendService} from '@/services/FriendService'
import {ERROR_MESSAGES} from '@/utils/errorMessages'

const acceptFriendRequestLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: {type: 'too_many_requests', message: 'Too many requests, please try again later.'}
})

const friendService = new FriendService()
const authService = new AuthService()

export default (router: Router) => {
    router.post('/accept', acceptFriendRequestLimiter, authService.authenticateToken(), async (req: Request, res: Response) => {
        try {
            const {friendshipId} = req.body
            if (!friendshipId) return res.status(400).json(ERROR_MESSAGES.FRIEND_REQUEST_NOT_FOUND)
            const user = (req as any).user
            const acceptedRequest = await friendService.acceptFriendRequest(user.id, friendshipId)
            res.status(200).json({type: 'success', message: 'Friend request accepted', request: acceptedRequest})
        } catch (error: any) {
            if (error.message === 'FRIEND_REQUEST_NOT_FOUND') return res.status(404).json(ERROR_MESSAGES.FRIEND_REQUEST_NOT_FOUND)
            res.status(500).json({type: 'api_error', message: 'Internal server error'})
        }
    })
}
