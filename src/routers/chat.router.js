import { Router } from 'express'
import { handlePolicies } from '../middlewares/handlePolicies.js'
import { JWT_COOKIE_NAME } from '../utils/utils.js'
import { verifyToken } from '../utils/utils.js'
import logger from '../utils/logger.js'
const router = Router()

router.get('/', handlePolicies(['USER', 'PREMIUM']), (req, res) => {
    //res.render('chat', { user: req.session.user.email })
    const decodedToken = verifyToken(req.cookies[JWT_COOKIE_NAME]);
    const user= decodedToken.user
    logger.info(`${user.email} has joined the chat`)
    res.render('chat', { user })
})  

export default router