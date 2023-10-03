import express from "express";
import handlebars from "express-handlebars";
import mongoose, { connect } from "mongoose";
import productRouter from "./routers/products.router.js";
import cartRouter from "./routers/carts.router.js";
import viewRouter from "./routers/view.router.js";
import { Server } from "socket.io";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import exphbs from "express-handlebars";
const hbs = exphbs.create({
  helpers: {
    eq: function (a, b) {
      return a === b;
    },
  },
});
app.engine("handlebars", hbs.engine);

app.set("views", "./src/views");
app.set("view engine", "handlebars");
app.use(express.static("./src/public"));
export const PORT = 8080;
//Mongoose

try {
  await mongoose.connect(
    "mongodb+srv://micaelafcavallero:coder00@cluster0.czf9gom.mongodb.net",
    {
      dbName: "ethereal",
    }
  );
  console.log("DB conected");
  //await productsDAO.insertMany(products);

  const httpServer = app.listen(PORT, () => console.log("Server Up!"));
  const socketServer = new Server(httpServer);

  app.get("/", (req, res) => res.render("index"));
  app.use("/api/products", productRouter);
  app.use("/api/carts", cartRouter);
  app.use("/products", viewRouter);
  app.use("/carts", viewRouter);
  //app.use("/chat", chatRouter);

  socketServer.on("connection", (socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id}`);
    socket.on("productList", (data) => {
      socketServer.emit("updatedProducts", data);
    });
  });
} catch (err) {
  console.log(err.message);
}

/* const messages = [];

socketServer.on("connection", (socketClient) => {
  console.log(`Nuevo cliente conectado: ${socketClient.id}`);
  socketClient.on("message", (data) => {
    messages.push(data);
    socketServer.emit("logs", messages);
  });
}); */
