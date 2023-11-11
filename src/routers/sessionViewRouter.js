import { Router } from "express";
import { privateRoutes, publicRoutes } from "../middlewares/auth.middleware.js";
const router = Router();
import { getRegisterController, getLoginController, getProfileController } from "../controllers/sessions.controllers.js";

router.get("/register", /* privateRoutes, */ getRegisterController);
router.get("/", /* privateRoutes, */ getLoginController); //Quité el mid privateRoutes porque luego de registrar me redirige a profile, pero sin poder acceder a productos porque no generó la cookie (que se genera al pasar por login)
router.get("/profile", publicRoutes, getProfileController);

export default router;
