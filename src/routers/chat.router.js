import { Router } from 'express'
import { handlePolicies } from '../middlewares/handlePolicies.js'
import { JWT_COOKIE_NAME } from '../utils/utils.js'
import { verifyToken } from '../utils/utils.js'
const router = Router()

router.get('/', handlePolicies(['USER']), (req, res) => {
    //res.render('chat', { user: req.session.user.email })
    const token = req.cookies[JWT_COOKIE_NAME];
    const decodedToken = verifyToken(token);
    const user= decodedToken.user
    console.log(user)
    res.render('chat', { user })
})  

export default router