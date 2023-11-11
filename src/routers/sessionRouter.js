import { Router } from "express";
import passport from "passport";
import { registerController, loginController, failLoginController, logoutController, githubLoginController, githubCallbackController  } from "../controllers/sessions.controllers.js";

const router = Router();

router.post("/register", passport.authenticate("register", {
    // ese register es el nombre para identificar a cual de los middlewares de passport utilizar
    failureRedirect: "/register?registerFailure=true"}), registerController)
router.post("/login", passport.authenticate("login", { failureRedirect: "/?error=true" }), loginController);
router.get("/failLogin", failLoginController);
router.get("/logout", logoutController);
router.get('/github', passport.authenticate('github', { scope: ['user:email']}), githubLoginController)

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/' }), githubCallbackController)

export default router;
