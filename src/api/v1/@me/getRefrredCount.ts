// src/api/v1/@me/getReferredCount.ts

import {Request, Response, Router} from "express";
import {AuthService} from "@/services/AuthService";
import prisma from "@/lib/prismaClient";

const authService = new AuthService();

export default (router: Router) => {
    router.get(
        "/get-referred-count",
        authService.authenticateToken(),
        async (req: Request, res: Response) => {
            const user = (req as any).user;
            if (!user) {
                return res.status(401).json({message: "Unauthorized"});
            }

            const userData = await prisma.user.findUnique({
                where: {
                    id: user.id,
                },
            });

            if (!userData) {
                return res.status(404).json({message: "User not found"});
            }

            const referralCount = await prisma.referral.count({
                where: {
                    referrerId: user.id,
                },
            });

            return res.status(200).json({count: referralCount});
        }
    );
};
