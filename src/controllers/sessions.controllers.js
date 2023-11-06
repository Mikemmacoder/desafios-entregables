import { JWT_COOKIE_NAME } from "../utils.js";

//-----controllers de api/sessions----- en session.router
export const registerController =async (req, res) => {
    res.redirect("/?registerSuccess=true");
}
export const loginController =async (req, res) => {
    if (!req.user) {
        return res
          .status(400)
          .send({ status: "error", error: "Invalid credentials" });
      }
        res.cookie(JWT_COOKIE_NAME, req.user.token).redirect("/products");
}
export const failLoginController =async (req, res) => {
    res.send({ error: "Passport login failed" })
}
export const logoutController =async (req, res) => {
    req.session.destroy((err) => { // mantengo el req.destroy porque sino no me desloguea
        if (err) {
          console.log(err);
          res.status(500).render("errors/base", { error: err });
        } else res.clearCookie(JWT_COOKIE_NAME).redirect('/')
    }) 
} 
export const githubLoginController =async (req, res) => {
} 
export const githubCallbackController =async (req, res) => {
    req.session.user = req.user
    res.redirect('/products')
} 


//-----controllers de / ----- en sessionViewRouter
export const getRegisterController =async (req, res) => {
const registerFailure = req.query.registerFailure === 'true'
  res.render("sessions/register", {registerFailure}); //referencia a la carpeta sessions y a la vista register
} 

export const getLoginController =async (req, res) => {
    const registerSuccess = req.query.registerSuccess === 'true'
  const error = req.query.error === 'true'
  res.render("sessions/login", {registerSuccess, error}); //referencia a la carpeta sessions y a la vista login
} 
export const getProfileController =async (req, res) => {
    res.render("sessions/profile", req.user); //referencia a la carpeta sessions y a la vista profile
} 