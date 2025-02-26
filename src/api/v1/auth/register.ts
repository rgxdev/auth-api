import {Request, Response, Router} from 'express'
import prisma from "@/lib/prismaClient"
import {AuthService} from "@/services/AuthService"
import {logger} from "@/lib/logger"
import {sendMail} from "@/utils/mailer"
import getWelcomeEmail from "@/mails/welcomeEmail"
import {ReferralService} from "@/services/ReferralService"
import {NameGenerator} from "@/utils/generator"
import {SERVICE_NAME} from "@/config/config";

const authService = new AuthService()
const referralService = new ReferralService()

export default (router: Router) => {
    router.post('/register', async (req: Request, res: Response) => {
        try {
            const {email, password} = req.body
            const ipAddress = req.header('CF-Connecting-IP') || req.ip || '0.0.0.0'
            const referralCode = req.cookies.referralCode

            if (!email) {
                return res.status(400).json({type: 'invalid_request', message: 'Email is required'})
            }
            if (!password) {
                return res.status(400).json({type: 'invalid_request', message: 'Password is required'})
            }

            const ipAccountCount = await prisma.user.count({where: {ip: ipAddress}})
            if (ipAccountCount >= 3) {
                return res.status(400).json({
                    type: 'invalid_request',
                    message: 'Maximum account limit reached for this IP address'
                })
            }

            const passwordHash = await authService.hashPassword(password)
            const generator = new NameGenerator()

            const transactionResult = await prisma.$transaction(async (prisma) => {
                const user = await prisma.user.create({
                    data: {
                        email: email.toString(),
                        passwordHash: passwordHash,
                        ip: ipAddress,
                        referralCode: referralService.generateReferralCode(),
                        username: generator.generate()
                    }
                })

                if (referralCode) {
                    const referrer = await prisma.user.findUnique({
                        where: {referralCode}
                    })
                    if (referrer) {
                        await prisma.user.update({
                            where: {id: user.id},
                            data: {referredBy: referrer.id}
                        })
                        await prisma.referral.create({
                            data: {
                                referrerId: referrer.id,
                                referredUserId: user.id
                            }
                        })
                    }
                }

                const registerKeys = await prisma.registerKeys.create({
                    data: {
                        key: authService.generateRandomString(10),
                        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
                        ip: ipAddress,
                        userId: user.id
                    }
                })

                return {user, registerKeys}
            })

            try {
                const htmlContent = getWelcomeEmail(transactionResult.registerKeys.key)
                await sendMail(transactionResult.user, htmlContent, `Verify your ${SERVICE_NAME} Account`)
            } catch (error) {
                logger.error('MAILER', `Failed to send verification email: ${email}`)
            }

            logger.info("REGISTER", 'Account created successfully: ' + email)

            return res.status(200).send({type: 'success', message: 'Email added to whitelist successfully'})
        } catch (e: any) {
            console.error(e)
            return res.status(500).send({type: 'api_error', message: 'Failed to create Account'})
        }
    })
}
