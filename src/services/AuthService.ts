// src/services/AuthService.ts

import bcrypt from 'bcrypt';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {JWT_SECRET, URL_DOMAIN, URL_PROTOCOL} from '@/config/config';
import {NextFunction, Request, Response} from 'express';
import prisma from '@/lib/prismaClient';
import {logger} from '@/lib/logger';
import {sendMail} from '@/utils/mailer';
import {User} from "@prisma/client";

interface TokenPayload extends JwtPayload {
    userId: string;
    username: string;
}

interface Roles {
    [key: string]: number;
}

export const roles: Roles = {
    OWNER: 6,
    ADMIN: 5,
    DEVELOPER: 4,
    SUPPORTER: 3,
    BETA: 2,
    USER: 1
};

export class AuthService {


    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 12);
    }

    async comparePassword(password: string, hashed: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, hashed);
        } catch (error: any) {
            logger.error('Error comparing password:', error);
            return false;
        }
    }

    generateToken(userId: string, email: string): string {
        return jwt.sign({userId, email}, JWT_SECRET, {
            expiresIn: '30d',
            audience: `.${URL_DOMAIN}`,
            algorithm: 'HS256',
        });
    }

    extractTokenFromRequest(req: Request): string | null {
        const authHeader = req.headers["authorization"];
        if (!authHeader) return null;
        const token = authHeader.split(" ")[1];
        return token || null;
    }

    verifyTokenString(token: string): TokenPayload | null {
        try {
            return jwt.verify(token, JWT_SECRET) as TokenPayload;
        } catch (error) {
            logger.warning("AUTH", 'Token verification failed: ' + error);
            return null;
        }
    }

    authenticateToken(requiredRole?: string) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const token = this.extractTokenFromRequest(req);
            if (!token) {
                return res.status(401).json({message: "No token provided!"});
            }

            const decoded = this.verifyTokenString(token);
            if (!decoded || !decoded.userId) {
                return res.status(403).json({message: "Invalid or expired token"});
            }

            if (requiredRole) {
                const roleCheck = await this.checkUserRole(decoded.userId, requiredRole);
                if (roleCheck.status !== 200) {
                    return res.status(roleCheck.status).json({message: roleCheck.message});
                }
            }

            const user: User | null = await prisma.user.findUnique({where: {id: decoded.userId}});
            if (!user) {
                return res.status(404).json({message: "User not found"});
            }

            if (user.isBanned) {
                return res.status(403).json({message: "Forbidden: user is banned"});
            }

            if (user.isVerified === false) {
                return res.status(403).json({message: "Forbidden: user is not verified"});
            }

            (req as any).user = user;
            next();
        };
    }

    async checkUserRole(userId: string, requiredRole: string) {
        const user: User | null = await prisma.user.findUnique({
            where: {id: userId}
        });

        if (!user) {
            return {status: 404, message: "User not found"};
        }

        if (roles[user.role] < roles[requiredRole]) {
            return {status: 403, message: "Forbidden: insufficient permissions"};
        }

        return {status: 200, message: "Role check passed"};
    }

    async generateSsoToken(userId: string): Promise<string> {
        return jwt.sign({userId}, JWT_SECRET, {
            expiresIn: '30m',
            algorithm: 'HS256',
        });
    }

    async sendMail(to: string, htmlContent: string, subject: string): Promise<void> {
        try {
            await sendMail(to, htmlContent, subject);
            logger.info("MAILER", `Email sent to ${to}`);
        } catch (error: any) {
            logger.error(`Failed to send email to ${to}:`, error);
            throw new Error('Failed to send email');
        }
    }

    async requestPasswordReset(email: string): Promise<void> {
        const user = await prisma.user.findUnique({where: {email}});
        if (!user) return;

        const resetCode = this.generateRandomString(100);
        const expiresAt = new Date(Date.now() + 3600 * 1000);

        await prisma.passwordResetCode.create({
            data: {
                code: resetCode,
                userId: user.id,
                expiresAt,
            },
        });

        const resetLink = `${URL_PROTOCOL}://${URL_DOMAIN}/confirm-password-reset?code=${resetCode}`;
        const htmlContent = `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`;

        await sendMail(user, htmlContent, 'Password Reset Request');
    }

    async setPassword(userId: string, password: string): Promise<void> {
        const passwordHash = await bcrypt.hash(password, 12);
        await prisma.user.update({
            where: {id: userId},
            data: {passwordHash},
        });
    }

    async updatePassword(userId: string, newPassword: string): Promise<void> {
        const passwordHash = await bcrypt.hash(newPassword, 12);
        await prisma.user.update({
            where: {id: userId},
            data: {passwordHash},
        });
    }

    async validatePasswordResetCode(code: string): Promise<{ valid: boolean; userId?: string }> {
        try {
            const resetCode = await prisma.passwordResetCode.findUnique({
                where: {code},
            });

            if (!resetCode) return {valid: false};

            if (resetCode.expiresAt < new Date()) {
                await prisma.passwordResetCode.delete({where: {code}});
                return {valid: false};
            }

            return {valid: true, userId: resetCode.userId};
        } catch (error: any) {
            logger.error("Error validating reset code:", error);
            return {valid: false};
        }
    }


    async verifyPasswordResetCode(code: string): Promise<boolean> {
        const resetCode = await prisma.passwordResetCode.findUnique({
            where: {code},
            include: {user: true},
        });

        if (!resetCode || resetCode.expiresAt < new Date()) {
            return false;
        }

        await prisma.user.update({
            where: {id: resetCode.userId},
            data: {passwordHash: null},
        });

        await prisma.passwordResetCode.delete({where: {code}});

        return true;
    }

    async verifyPassword(userId: string, password: string): Promise<boolean> {
        const user = await prisma.user.findUnique({where: {id: userId}});
        if (!user || !user.passwordHash) return false;
        return await bcrypt.compare(password, user.passwordHash);
    }

    generateRandomString(length: number) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({length}, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
    }
}
