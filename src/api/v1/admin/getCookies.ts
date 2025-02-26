import {Router} from 'express';
import {logger} from "@/lib/logger";

export default (router: Router) => {
    router.get('/get-cookies', async (req, res) => {
        const ipAddress = req.header('CF-Connecting-IP') || req.ip || '0.0.0.0';


        try {
            const cookies = req.cookies;
            logger.log('COOKIE', `Cookies: ${JSON.stringify(cookies.referralCode)}`);
            return res.status(200).json({type: 'success', message: 'Cookies fetched successfully', cookies});


        } catch (error) {
            logger.error('SYSTEM', `Some error occured: ${error}`);
        }
        return res.status(500).json({type: 'api_error', message: 'Internal server error'});
    });
};