import passport from "passport";
import local from "passport-local";
import { createHash, isValidPassword } from "../utils.js";
import usersModel from "../dao/models/usersModel.js";

const localStrategy = local.Strategy;

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
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role: "user"
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
      async (username, password, done, email) => {
        try {
          if (username === "adminCoder@coder.com" && password === "adminCod3r123") {
            const userAdmin = {
              _id: "admin",
              email: "adminCoder@coder.com",
              password: "adminCod3r123",
              role: "admin",
              first_name: "Coder",
              last_name: "House",
              age: "25",
            };
            return done(null, userAdmin);
          }
          const user = await usersModel.findOne({ email: username });
          if (!isValidPassword(user, password) || !user) return done(null, false);
          return done(null, user);
        } catch (err) {}
      }
    )
  );

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
      const user = {
        _id: "admin",
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
        role: "admin",
        first_name: "Coder",
        last_name: "House",
        age: "25",
      };
      done(null, user); 
    } else{
      const user = await usersModel.findById(id);
      done(null, user);
    }
    
  });
};

export default initializePassport;
