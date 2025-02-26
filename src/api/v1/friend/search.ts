// routes/friendsSearch.ts
import {Request, Response, Router} from 'express'
import rateLimit from 'express-rate-limit'
import {FriendService} from '@/services/FriendService'
import {AuthService} from '@/services/AuthService'

const searchFriendsLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    message: {type: 'too_many_requests', message: 'Too many requests, please try again later.'}
})

const friendService = new FriendService()
const authService = new AuthService()

export default (router: Router) => {
    router.get('/search', searchFriendsLimiter, authService.authenticateToken(), async (req: Request, res: Response) => {
        try {
            const {q} = req.query
            if (!q || typeof q !== 'string') return res.status(400).json({type: 'error', message: 'Query required'})
            const user = (req as any).user
            const results = await friendService.searchFriends(user.id, q)
            res.status(200).json({type: 'success', results})
        } catch (error: any) {
            res.status(500).json({type: 'api_error', message: 'Internal server error'})
        }
    })
}
