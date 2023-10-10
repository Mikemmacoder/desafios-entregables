import { Router } from "express";
import { privateRoutes, publicRoutes } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/register", privateRoutes, async (req, res) => {
  res.render("sessions/register"); //referencia a la carpeta sessions y a la vista register
});

router.get("/", privateRoutes, (req, res) => {
  res.render("sessions/login"); //referencia a la carpeta sessions y a la vista login
});

router.get("/profile", publicRoutes, (req, res) => {
  res.render("sessions/profile", req.session.user); //referencia a la carpeta sessions y a la vista profile
});

export default router;
