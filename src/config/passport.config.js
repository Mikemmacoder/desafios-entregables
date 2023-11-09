import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2"
import { createHash, isValidPassword, JWT_PRIVATE_KEY, extractCookie, generateToken } from "../utils/utils.js";
import usersModel from "../dao/models/usersModel.js";
import cartsModel from "../dao/models/carts.model.js";
import passport_jwt from 'passport-jwt';
import config from "./config.js";

const localStrategy = local.Strategy;
const JWTStrategy = passport_jwt.Strategy

const initializePassport = () => {
  passport.use(
    "register", //este register no es una vista. Es un middleware que voy a utilizar en passport
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const user = await usersModel.findOne({ email: username });
          if (user) {
            return done(null, false);
          }
          const cartForNewUser = await cartsModel.create({})
          console.log(cartForNewUser)
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role: "user",
            cart: cartForNewUser
          };
          const result = await usersModel.create(newUser);
          return done(null, result);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    "login",
    new localStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          if (username === config.admin.email && password === config.admin.password) {
            const cartForAdmin = await cartsModel.findOne({ _id: '6536fce65e2cb6f12d2819f2'});
            const user = {
              _id: "admin",
              email: config.admin.email,
              password: config.admin.password,
              role: "admin",
              first_name: "Coder",
              last_name: "House",
              age: "25",
              cart: cartForAdmin._id,
            };
            const tokenAdmin = generateToken(user)
            user.token = tokenAdmin
            return done(null, user);
          }
          const user = await usersModel.findOne({ email: username });
          if (!isValidPassword(user, password) || !user) return done(null, false);
          
          const token = generateToken(user)
          user.token = token

          return done(null, user);
        } catch (err) {}
      }
    )
  );
  passport.use('github', new GitHubStrategy({
    clientID: config.github.clientID,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackURL,
  }, async(accessToken, refreshToken, profile, done) => {
    console.log(profile)
    try {
        const user = await usersModel.findOne({ email: profile._json.email })
        if (user) return done(null, user)
        const newUser = await usersModel.create({
            first_name: profile._json.name,
            last_name: '',
            email: profile._json.email,
            password: ''
        })
        return done(null, newUser)
    } catch(err) {
      console.error(err)
        return done('Error to login with github')
    }
}))

passport.use('jwt', new JWTStrategy({
  jwtFromRequest: passport_jwt.ExtractJwt.fromExtractors([extractCookie]),
  secretOrKey: JWT_PRIVATE_KEY
}, async(jwt_payload, done) => {
  done(null, jwt_payload)
}))

  passport.serializeUser((user, done) => {
    if (user.role === "admin"){
      user = {_id: "admin"}
      done(null, user._id);
    } else{
      done(null, user._id);
      }
  });

  passport.deserializeUser(async (id, done) => {
    if (id === "admin"){
      const cartForAdmin = await cartsModel.findById('6536fce65e2cb6f12d2819f2');
      const user = {
        _id: "admin",
        email: config.admin.email,
        password: config.admin.password,
        role: "admin",
        first_name: "Coder",
        last_name: "House",
        age: "25",
        cart: cartForAdmin,
      };
      done(null, user); 
    } else{
      const user = await usersModel.findById(id);
      done(null, user);
    }
    
  });
};

export default initializePassport;
