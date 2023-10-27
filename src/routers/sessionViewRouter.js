import { Router } from "express";
import { privateRoutes, publicRoutes } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/register", privateRoutes, async (req, res) => {
  const registerFailure = req.query.registerFailure === 'true'
  res.render("sessions/register", {registerFailure}); //referencia a la carpeta sessions y a la vista register
});

router.get("/", privateRoutes, (req, res) => {
  const registerSuccess = req.query.registerSuccess === 'true'
  const error = req.query.error === 'true'
  res.render("sessions/login", {registerSuccess, error}); //referencia a la carpeta sessions y a la vista login
});

router.get("/profile", publicRoutes, (req, res) => {
  res.render("sessions/profile", req.session.user); //referencia a la carpeta sessions y a la vista profile
});

export default router;
