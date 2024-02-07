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
import { faker } from '@faker-js/faker';
import nodemailer from 'nodemailer'

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

// jwtUtils.js

// Ajusta la importación según la ubicación de tu archivo de configuración

export const verifyToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, JWT_PRIVATE_KEY);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const generateProduct = () => {
  return {
    title: faker.commerce.product(),
  description: faker.commerce.productDescription(),
  price: faker.commerce.price({ min: 19000, max: 200000, dec: 0, symbol: '$' }),
  //thumbnails: ,
  code: faker.commerce.isbn() ,
  stock: faker.number.int({ min: 0, max: 100 }),
  status: true ,
  category: faker.commerce.productMaterial(),
  }
}

export const generateRandomString = (num) => {
  return [...Array(num)].map(() => {
      const randomNum = ~~(Math.random() * 36);
      return randomNum.toString(36);
  })
      .join('')
      .toUpperCase();
}

export const sendEmail = async (email, subject, htmlMessage) => {
  const mailerConfig = {
    service: 'gmail',
    auth: { user: config.nodemailer.user, pass: config.nodemailer.pass } 
  }
  let transporter = nodemailer.createTransport(mailerConfig)
  let message = {
    from: config.nodemailer.user,
    to: email, 
    subject: subject,
    html: htmlMessage
  }
  try {
    await transporter.sendMail(message)
    return `Email successfully sent to ${email}`
  } catch (err) {
    return('Ocurrió un error: ' + err)
  }
} 

export const fechaLegible = (oldDate) => {
  const opcionesDeFormato = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };
  const fecha = new Date(oldDate);
  const fechaLegible = fecha.toLocaleString("es-ES", opcionesDeFormato);
  return fechaLegible
}