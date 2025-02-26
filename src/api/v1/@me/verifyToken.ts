import {Request, Response, Router} from 'express';
import {AuthService} from "@/services/AuthService";

const authService = new AuthService();

export default (router: Router) => {
    router.get('/verify', authService.authenticateToken(), (req: Request, res: Response) => {

    });
};
