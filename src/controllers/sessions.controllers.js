import { JWT_COOKIE_NAME, generateToken } from "../utils/utils.js";
import UserDTO from "../dto/user.dto.js";
import logger from "../utils/logger.js";

//-----controllers de api/sessions----- en session.router
export const registerController =(req, res) => {
    res.redirect("/?registerSuccess=true");
}
export const loginController =async (req, res) => {
    if (!req.user) {
      logger.error('Invalid credentials at login')
        return res
          .status(400)
          .send({ status: "error", error: "Invalid credentials" });
      }
      res.cookie(JWT_COOKIE_NAME, req.user.token).redirect("/products");
}
export const failLoginController =async (req, res) => {
    logger.error('Passport login failed')
    res.send({ error: "Passport login failed" })
}
export const logoutController =async (req, res) => {
    req.session.destroy((err) => { // mantengo el req.destroy porque sino no me desloguea
        if (err) {
          logger.error(err);
          res.status(500).render("errors/base", { error: err });
        } else {
          logger.info('User logged out')
          res.clearCookie(JWT_COOKIE_NAME).redirect('/')
        }
    }) 
} 
export const githubLoginController =async (req, res) => {
  
} 
export const githubCallbackController =async (req, res) => {
    const user = req.user
    req.session.user = user
    logger.info('User logged in through github')
    res.cookie(JWT_COOKIE_NAME, req.user.token).redirect("/products")
    //grabo el user con token (generado en el passport.config) en una cookie, 
    //porque al autenticar con jwt y github, si no lo tiene, me dice no tengo token y no puedo ingresar a la vista /products
    
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
  const userDTO = new UserDTO(req.user)
  res.render("sessions/profile", userDTO); //referencia a la carpeta sessions y a la vista profile
} 