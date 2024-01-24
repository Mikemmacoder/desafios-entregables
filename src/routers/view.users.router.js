import { Router } from "express";
import { getUsersContoller } from "../controllers/users.controllers.js";
import { publicRoutes } from "../middlewares/auth.middleware.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";
const router = Router();

router.get("/", handlePolicies(['ADMIN']), getUsersContoller)

export default router;