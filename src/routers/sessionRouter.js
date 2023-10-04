import { Router } from "express";
import usersModel from "../dao/models/usersModel.js";

const router = Router();

router.post("/register", async (req, res) => {
  const userToRegister = req.body;
  const user = new usersModel(userToRegister);
  await user.save();
  res.redirect("/");
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await usersModel.findOne({ email, password }).lean().exec();
  if (!user) {
    return res.redirect("/");
  }
  if (
    user.email === "adminCoder@coder.com" &&
    user.password === "adminCod3r123"
  ) {
    user.role = "admin";
  } else {
    user.role = "user";
  }
  req.session.user = user;
  res.redirect("/products");
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.status(500).render("errors/base", { error: err });
    } else res.redirect("/");
  });
});

export default router;
