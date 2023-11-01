import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2"
import { createHash, isValidPassword } from "../utils.js";
import usersModel from "../dao/models/usersModel.js";
import cartsModel from "../dao/models/carts.model.js";

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
          if (username === "adminCoder@coder.com" && password === "adminCod3r123") {
            const cartForAdmin = await cartsModel.findOne({ _id: '6536fce65e2cb6f12d2819f2'});
            const userAdmin = {
              _id: "admin",
              email: "adminCoder@coder.com",
              password: "adminCod3r123",
              role: "admin",
              first_name: "Coder",
              last_name: "House",
              age: "25",
              cart: cartForAdmin._id,
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
  passport.use('github', new GitHubStrategy({
    clientID: 'Iv1.1e150525615172c6',
    clientSecret: 'e60159fef3614597b1700b4ed08034162e265ed0',
    callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
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
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
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
