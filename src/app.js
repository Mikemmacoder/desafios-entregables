import express from "express";
import mongoose, { connect } from "mongoose";
import session from "express-session";
import productRouter from "./routers/products.router.js";
import cartRouter from "./routers/carts.router.js";
import viewRouter from "./routers/view.router.js";
import sessionViewRouter from "./routers/sessionViewRouter.js";
import sessionRouter from "./routers/sessionRouter.js";
import chatRouter from './routers/chat.router.js'
import mockRouter from './routers/mock.router.js'
import viewUsersRouter from './routers/view.users.router.js'
import paymentRouter from './routers/payments.router.js'
import { Server } from "socket.io";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import { passportCall } from "./utils/utils.js";
import cookieParser from "cookie-parser";
import { handlePolicies } from "./middlewares/handlePolicies.js";
import config from "./config/config.js";
import errorHandler from './middlewares/error.js'
import { CartService, UserService } from "./services/index.js";
import logger from "./utils/logger.js";
import loggerRouter from "./routers/logger.router.js";
import usersRouter from "./routers/users.router.js";
import ticketsRouter from "./routers/tickets.router.js"
import swaggerUiExpress from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { program} from "./config/config.js";

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
export const PORT = program.opts().p 

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

export const swaggerOptions = {
  definition: {
      openapi: '3.1.0',
      info: {
          title: 'Ecommerce para Proyecto Final de Coderhouse',
          version: '1.0.0',
      }
  },
  apis: [
      `./docs/**/*.yaml`,
  ],
};
const specs = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

try {
  await mongoose.connect(
    config.mongo.uri,
    {
      dbName: config.mongo.dbname,
    }
  );
  logger.info(`DB conected: ${config.mongo.dbname}`);

  const httpServer = app.listen(PORT, () => logger.info(`Server Up on port: ${PORT}`));
  const socketServer = new Server(httpServer);
  
  app.use("/", sessionViewRouter);
  app.use("/api/sessions", sessionRouter);
  app.use("/api/products", productRouter);
  app.use("/api/carts", handlePolicies(['USER', 'PREMIUM']), cartRouter); 
  app.use("/api/tickets", ticketsRouter)
  app.use("/api/users", usersRouter)
  app.use("/products", passportCall('jwt'), viewRouter);
  app.use("/carts", viewRouter);
  app.use("/users", viewUsersRouter);
  app.use("/pay", handlePolicies(['USER', 'PREMIUM']), paymentRouter)
  app.use("/chat", chatRouter);
  app.use("/mockingproducts", mockRouter);
  app.use('/loggerTest', loggerRouter) 


  socketServer.on("connection", (socket) => {
    logger.info(`Nuevo cliente conectado: ${socket.id}`);
    socket.on("productList", (data) => {
      socketServer.emit("updatedProducts", data);
    });
  });
  socketServer.on("connection", (socketCart) => {
    socketCart.on("productsList", async (cid) => {
      const data = await CartService.getProducts(cid)
      //logger.info('data en socketServer' + JSON.stringify(data, null, 2))
      socketServer.emit("CartUpdated", data);
    });
  });
  
  const messages = [];

  socketServer.on("connection", (socketClient) => {
    logger.info(`Nuevo cliente conectado: ${socketClient.id}`);
    socketClient.on("message", (data) => {
      messages.push(data);
      socketServer.emit("logs", messages);
    });
  });
  
  socketServer.on("connection", (socketUser) => {
    logger.info(`Nuevo cliente conectado. Socket User: ${socketUser.id}`);
    socketUser.on("usersUpdated", async () => {
      const users = await UserService.getAll()
      socketServer.emit("users", users);
    });
  });
} catch (err) {
  logger.error(err.message);
  process.exit(-1);
}

