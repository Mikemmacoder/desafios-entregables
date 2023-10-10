import { Router } from "express";
import usersModel from "../dao/models/usersModel.js";
import { isValidPassword } from "../utils.js";
import passport from "passport";
const router = Router();

/* router.get("/register", (req, res) => {
  res.render("/register");
}); */
router.post(
  "/register",
  passport.authenticate("register", {
    // ese register es el nombre para identificar a cual de los middlewares de passport utilizar
    failureRedirect: "/api/sessions/failRegister",
  }),
  async (req, res) => {
    res.redirect("/"); //funciona- es la ruta del home
  }
);

router.get("/failRegister", (req, res) =>
  res.send({ error: "Passport register failed" })
);
router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/session/failLogin" }),
  async (req, res) => {
    if (!req.user) {
      return res
        .status(400)
        .send({ status: "error", error: "Invalid credentials" });
    }
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role
    };
    res.redirect("/products");
  }
);
router.get("/failLogin", (req, res) =>
  res.send({ error: "Passport login failed" })
);

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.status(500).render("errors/base", { error: err });
    } else res.redirect("/");
  });
});

export default router;
