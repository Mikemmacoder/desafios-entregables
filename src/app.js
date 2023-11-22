import express from "express";
import handlebars from "express-handlebars";
import mongoose, { connect } from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import productRouter from "./routers/products.router.js";
import cartRouter from "./routers/carts.router.js";
import viewRouter from "./routers/view.router.js";
import sessionViewRouter from "./routers/sessionViewRouter.js";
import sessionRouter from "./routers/sessionRouter.js";
import chatRouter from './routers/chat.router.js'
import mockRouter from './routers/mock.router.js'
import { Server } from "socket.io";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import { passportCall } from "./utils/utils.js";
import cookieParser from "cookie-parser";
import { handlePolicies } from "./middlewares/handlePolicies.js";
import config from "./config/config.js";
import errorHandler from './middlewares/error.js'

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler)

import exphbs from "express-handlebars";
const hbs = exphbs.create({
  helpers: {
    eq: function (a, b) {
      return a === b;
    },
  },
});

app.engine("handlebars", hbs.engine);

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.set("views", "./src/views");
app.set("view engine", "handlebars");
app.use(express.static("./src/public"));


export const PORT = config.apiserver.port;

initializePassport();
app.use(passport.initialize());
app.use(passport.session());
//Mongoose
try {
  await mongoose.connect(
    config.mongo.uri,
    {
      dbName: config.mongo.dbname,
    }
  );
  console.log("DB conected");

  const httpServer = app.listen(PORT, () => console.log("Server Up!"));
  const socketServer = new Server(httpServer);
  
  app.use("/", sessionViewRouter);
  app.use("/api/sessions", sessionRouter);
  app.use("/api/products", productRouter);
  app.use("/api/carts", handlePolicies(['USER']), cartRouter);
  app.use("/products", passportCall('jwt'), viewRouter);
  app.use("/carts", viewRouter);
  app.use("/chat", chatRouter);
  app.use("/mockingproducts", mockRouter);


  socketServer.on("connection", (socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id}`);
    socket.on("productList", (data) => {
      socketServer.emit("updatedProducts", data);
    });
  });
  
const messages = [];

socketServer.on("connection", (socketClient) => {
  console.log(`Nuevo cliente conectado: ${socketClient.id}`);
  socketClient.on("message", (data) => {
    messages.push(data);
    socketServer.emit("logs", messages);
  });
}); 
} catch (err) {
  console.log(err.message);
  process.exit(-1);
}

