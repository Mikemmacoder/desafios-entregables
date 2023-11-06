import { Router } from "express";
import { privateRoutes, publicRoutes } from "../middlewares/auth.middleware.js";
const router = Router();
import { getRegisterController, getLoginController, getProfileController } from "../controllers/sessions.controllers.js";

router.get("/register", privateRoutes, getRegisterController);
router.get("/", privateRoutes, getLoginController);
router.get("/profile", publicRoutes, getProfileController);

export default router;
