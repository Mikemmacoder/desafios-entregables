import { Router } from "express";
import { ProductManager } from "../product-manager.js";

const router = Router();
const productManager = new ProductManager("./data/products.json");

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});
router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", { products });
});

export default router;
