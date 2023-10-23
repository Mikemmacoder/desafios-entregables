import { Router } from "express";
import usersModel from "../dao/models/usersModel.js";
import cartsModel from "../dao/models/carts.model.js";
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
    failureRedirect: "/register?registerFailure=true",
  }),
  async (req, res) => {
    
    res.redirect("/?registerSuccess=true");
  }
);


router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/?error=true" }),
  async (req, res) => {
    if (!req.user) {
      return res
        .status(400)
        .send({ status: "error", error: "Invalid credentials" });
    }
    try {
      
      const userMongoose = await usersModel.findOne({ email: req.user.email }).populate('cart');

      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role,
        cart: userMongoose.cart
      };

      res.redirect("/products");
    } catch (error) {
      console.error(error);
      return res.status(500).send({ status: "error", error: "Server Error" });
    }
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

router.get('/github', passport.authenticate('github', { scope: ['user:email']}), (req, res) => {

})

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/' }), async(req, res) => {
    req.session.user = req.user
    res.redirect('/products')
})

export default router;
