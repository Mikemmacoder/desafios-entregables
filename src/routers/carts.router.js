import { Router } from "express";
const router = Router();
import { CartManager } from "../cart-manager.js";
const cartManager = new CartManager("./data/carts.json");
import fs from "fs";

router.post("/", (req, res) => {
  const newCart = cartManager.addCart();
  return res.json(newCart);
});

router.get("/:cid", async (req, res) => {
  const id = parseInt(req.params.cid);

  const result = await cartManager.getCartById(id);
  if (typeof result === "string") {
    return res
      .status(404)
      .json({ status: "error", error: "Cart does not exists" });
  }
  res.status(200).json({ status: "success", payload: result });
});

router.post("/:cid/products/:pid", (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);
  let fileProd = fs.readFileSync("./data/products.json", "utf-8");
  let products = JSON.parse(fileProd);

  const productExists = products.some((el) => el.id == pid);
  if (!productExists) {
    return res
      .status(404)
      .json({ status: "error", error: "Product does not exists" });
  }
  const updatedCart = cartManager.addProductsToCart(cid, pid);

  if (typeof updatedCart === "string") {
    return res.status(404).json({ status: "error", error: updatedCart });
  }

  return res.status(200).json({
    status: "success",
    message: `Product with id ${pid} added to cart with id ${cid}`,
    updatedCart: updatedCart,
  });
});

export default router;
