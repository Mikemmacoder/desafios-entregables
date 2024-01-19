import { JWT_COOKIE_NAME, generateToken } from "../utils/utils.js";
import UserDTO from "../dto/user.dto.js";
import logger from "../utils/logger.js";
import usersModel from "../dao/mongoDao/models/usersModel.js";
import { generateRandomString } from "../utils/utils.js";
import config from "../config/config.js";
import { PORT } from "../app.js";
import UserPasswordModel from "../dao/mongoDao/models/user.password.model.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import { sendEmail } from "../utils/utils.js";

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

export const forgetPasswordController =async (req, res) => {
  const email = req.body.email
    const user = await usersModel.findOne({ email })
    if (!user) {
        return res.status(404).json({ status: 'error', error: 'User not found' })
    }
    const token = generateRandomString(16);
    await UserPasswordModel.create({ email, token }) 
    try {
      const subject = '[Coder e-comm API] Reset your password'
      const htmlMessage =`<h1>[Coder e-comm API] Reset your password</h1><hr />You have asked to reset your password. You can do it here: <a href="http://${req.hostname}:${PORT}/reset-password/${token}">http://${req.hostname}:${PORT}/reset-password/${token}</a><hr />Best regards,<br><strong>The Coder e-comm API team</strong>`
      sendEmail(email, subject, htmlMessage)
      res.json({ status: 'success', message: `Email successfully sent to ${email} in order to reset password` })
    } catch (err) {
      res.status(500).json({ status: 'error', error: err.message })
    } 
} 
export const verifyTokenController =async (req, res) => {
  const userPassword = await UserPasswordModel.findOne({ token: req.params.token })
  if (!userPassword) {
      return res.status(404).json({ status: 'error', error: 'Token no válido / El token ha expirado' })
  }
  const user = userPassword.email
  res.render('sessions/reset-password', { user })
} 
export const resetPasswordController =async (req, res) => {
  try {
      const user = await usersModel.findOne({ email: req.params.user })
      const newPassword = req.body.newPassword
      const passRepeated = isValidPassword(user, newPassword)
      if(passRepeated){
        return res.json({ status: 'error', error: "La contraseña indicada ya ha sido utilizada" })
      }
      await usersModel.findByIdAndUpdate(user._id, { password: createHash(newPassword) })
      await UserPasswordModel.deleteOne({ email: req.params.user })
      return res.json({ status: 'success', message: 'Se ha creado una nueva contraseña' })
  } catch(err) {
      return res.json({ status: 'error', error: err.message })
  }
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