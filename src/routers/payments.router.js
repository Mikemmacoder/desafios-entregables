import {Router} from 'express'
import { createSession,  cancelSession } from '../controllers/payments.controller.js'
import { handlePolicies } from '../middlewares/handlePolicies.js'
const router = Router()


router.post('/create-checkout-session', createSession)

router.get('/cancel', cancelSession)

export default router 