import { Router } from "express";
const router = Router();
import multer from "multer";
import { ProductManager } from "../product-manager.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

const productManager = new ProductManager("./data/products.json");

router.get("/", async (req, res) => {
  const result = await productManager.getProducts();
  const limit = req.query.limit;
  if (typeof result === "string") {
    const error = result.split(" ");
    return res
      .status(parseInt(error[0].slice(1, 4)))
      .json({ error: result.slice(6) });
  }
  res.status(200).json({ payload: result.slice(0, limit) });
});

router.get("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);

  const result = await productManager.getProductById(id);
  if (typeof result === "string") {
    return res.status(404).json({ status: "error", error: result });
  }
  return res.status(200).json({ status: "success", payload: result });
});

router.post("/", async (req, res) => {
  const product = req.body;

  const productToAdd = productManager.addProduct(product);
  if (typeof productToAdd === "string") {
    return res.status(400).json({ status: "error", error: productToAdd });
  } else {
    res.json({
      status: "success",
      payload: productToAdd,
    });
  }
});

router.put("/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);
  const updateFields = await req.body;

  if (updateFields.price < 0 || updateFields.stock < 0) {
    return res.status(400).json({
      status: "error",
      error: "Precio y stock no pueden ser números negativos.",
    });
  }
  if (updateFields.hasOwnProperty("id")) {
    return res
      .status(400)
      .json({ status: "error", error: "No puedes modificar el campo 'id'." });
  }
  productManager.updateProductById(productId, updateFields);
  const result = productManager.getProductById(productId);
  if (typeof result === "string") {
    return res.status(404).json({ status: "error", error: result });
  }
  res.json({
    status: "success",
    payload: result,
  });
});

router.delete("/:id", async (req, res) => {
  const productId = parseInt(req.params.id);
  productManager.deleteProductById(productId);
  const result = await productManager.getProducts();
  res.json({
    status: "success",
    payload: result,
  });
});

export default router;
