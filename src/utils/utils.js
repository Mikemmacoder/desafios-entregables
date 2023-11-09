/* import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;
 */
import bcrypt from "bcrypt";
import passport from "passport";
import jwt  from "jsonwebtoken";
import handlebars from 'handlebars';
import config from "../config/config.js";

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);


export const hbarsHelp = handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

export const JWT_PRIVATE_KEY = config.jwt.privateKey
export const JWT_COOKIE_NAME = config.jwt.cookieName

export const generateToken = user => jwt.sign({ user }, JWT_PRIVATE_KEY, { expiresIn: '24h' })
export const extractCookie = req => (req && req.cookies) ? req.cookies[JWT_COOKIE_NAME] : null

export const passportCall = strategy => {
  return async (req, res, next) => {
      passport.authenticate(strategy, function(err, user, info) {
          if (err) return next(err)
          if (!user) return res.status(401).render('errors/base', {error: 'No tengo token!' })
          req.user = user
          next()
      })(req, res, next)
  }
}