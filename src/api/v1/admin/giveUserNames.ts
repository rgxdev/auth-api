import {Router} from 'express'
import {logger} from "@/lib/logger"
import prisma from "@/lib/prismaClient"
import {NameGenerator} from "@/utils/generator"
import {AuthService} from "@/services/AuthService";

const authService = new AuthService()

export default (router: Router) => {
    router.post('/assign-usernames', authService.authenticateToken("OWNER"), async (req, res) => {
        try {
            const usersWithoutUsername = await prisma.user.findMany({
                where: {username: null}
            })
            const existingUsers = await prisma.user.findMany({
                select: {username: true}
            })
            const existingUsernames = new Set(existingUsers.map(u => u.username).filter(Boolean))
            const generator = new NameGenerator()
            for (const user of usersWithoutUsername) {
                let randomUsername = generator.generate()
                while (existingUsernames.has(randomUsername)) {
                    randomUsername = generator.generate()
                }
                existingUsernames.add(randomUsername)
                await prisma.user.update({
                    where: {id: user.id},
                    data: {username: randomUsername}
                })
            }
            logger.info('SYSTEM', `Usernames updated successfully`)
            return res.status(200).json({
                type: 'success',
                message: 'Usernames updated successfully',
                updatedCount: usersWithoutUsername.length
            })
        } catch (error) {
            logger.error('SYSTEM', `Error updating usernames: ${error}`)
            return res.status(500).json({type: 'api_error', message: 'Internal server error'})
        }
    })
}
