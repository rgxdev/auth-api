import {Router} from 'express'
import prisma from "@/lib/prismaClient"
import {sendMail} from "@/utils/mailer"
import {logger} from "@/lib/logger"
import getWelcomeEmail from "@/mails/welcomeEmail"
import {AuthService} from "@/services/AuthService"
import {ReferralService} from "@/services/ReferralService"
import {NameGenerator} from "@/utils/generator"
import {SERVICE_NAME} from "@/config/config";

const authService = new AuthService()
const referralService = new ReferralService()

export default async (router: Router) => {
    router.get('/signup', async (req, res) => {
        try {
            const email = req.query.email
            const ipAddress = req.header('CF-Connecting-IP') || req.ip || '0.0.0.0'
            const referralCode = req.cookies.referralCode

            if (!email) {
                return res.status(400).json({type: 'invalid_request', message: 'Email is required'})
            }

            const ipAccountCount = await prisma.user.count({where: {ip: ipAddress}})
            if (ipAccountCount >= 3) {
                return res.status(400).json({
                    type: 'invalid_request',
                    message: 'Maximum account limit reached for this IP address'
                })
            }

            const generator = new NameGenerator()

            const transactionResult = await prisma.$transaction(async (prisma) => {
                const user = await prisma.user.create({
                    data: {
                        email: email.toString(),
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
                await sendMail(transactionResult.user, htmlContent, `Verify your ${SERVICE_NAME} Whitelist Account`)
            } catch {
                logger.error('MAILER', `Failed to send verification email: ${email}`)
            }

            return res.status(200).send({type: 'success', message: 'Email added to whitelist successfully'})
        } catch (e: any) {
            console.log(e)
            return res.status(500).send({type: 'api_error', message: 'Failed to add email to whitelist'})
        }
    })
}
