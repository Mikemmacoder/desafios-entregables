import express from "express";
import handlebars from "express-handlebars";
import productRouter from "./routers/products.router.js";
import cartRouter from "./routers/carts.router.js";
import viewRouter from "./routers/view.router.js";
import { Server } from "socket.io";

const app = express();
app.use(express.json());
/* app.use(express.urlencoded({ extended: true })); */

const httpServer = app.listen(8080, () => console.log("Server Up!"));
const socketServer = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");
app.use(express.static("./src/public"));
app.use("/products", viewRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

const messages = [];

socketServer.on("connection", (socketClient) => {
  console.log(`Nuevo cliente conectado: ${socketClient.id}`);
  socketClient.on("message", (data) => {
    messages.push(data);
    socketServer.emit("logs", messages);
  });
});
