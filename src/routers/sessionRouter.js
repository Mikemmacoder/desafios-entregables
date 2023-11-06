import { Router } from "express";
import usersModel from "../dao/models/usersModel.js";
import cartsModel from "../dao/models/carts.model.js";
import { JWT_COOKIE_NAME, isValidPassword } from "../utils.js";
import passport from "passport";
import { registerController, loginController, failLoginController, logoutController, githubLoginController, githubCallbackController  } from "../controllers/sessions.controllers.js";


const router = Router();

/* router.get("/register", (req, res) => {
  res.render("/register");
}); */
router.post("/register", passport.authenticate("register", {
    // ese register es el nombre para identificar a cual de los middlewares de passport utilizar
    failureRedirect: "/register?registerFailure=true"}), registerController
)
router.post("/login", passport.authenticate("login", { failureRedirect: "/?error=true" }), loginController);
router.get("/failLogin", failLoginController);
router.get("/logout", logoutController);
router.get('/github', passport.authenticate('github', { scope: ['user:email']}), githubLoginController)

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/' }), githubCallbackController)

export default router;
