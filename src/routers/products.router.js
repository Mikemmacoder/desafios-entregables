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
productManager.addProduct({
  id: 1,
  title: "Mesa de comedor Wanama",
  description: "Mesa de comedor de madera rectangular",
  price: 95000,
  thumbnails: "Sin imagen",
  code: "abc122",
  stock: 15,
  status: "true",
  category: "mesas-de-comedor",
});
productManager.addProduct({
  id: 2,
  title: "Mesa de comedor Diana",
  description: "Mesa de comedor de madera rectangular",
  price: 90000,
  thumbnails: "Sin imagen",
  code: "abc123",
  stock: 5,
  status: "true",
  category: "mesas-de-comedor",
});
productManager.addProduct({
  id: 3,
  title: "Mesa de comedor Fiorella",
  description: "Mesa de comedor de madera rectangular",
  price: 80000,
  thumbnails: "Sin imagen",
  code: "abc124",
  stock: 7,
  status: "true",
  category: "mesas-de-comedor",
});
productManager.addProduct({
  id: 4,
  title: "Mesa de centro Madison",
  description: "Mesa de centro de madera ovalada",
  price: 21500,
  thumbnails: "Sin imagen",
  code: "abc125",
  stock: 6,
  status: "true",
  category: "mesas-de-centro",
});
productManager.addProduct({
  id: 5,
  title: "Mesa de centro Sofía",
  description: "Mesa de centro de madera ovalada",
  price: 23700,
  thumbnails: "Sin imagen",
  code: "abc126",
  stock: 13,
  status: "true",
  category: "mesas-de-centro",
});
productManager.addProduct({
  id: 6,
  title: "Mesa de centro Italy",
  description: "Mesa de centro de madera ovalada",
  price: 19500,
  thumbnails: "Sin imagen",
  code: "abc127",
  stock: 14,
  status: "true",
  category: "mesas-de-centro",
});
productManager.addProduct({
  id: 7,
  title: "Silla Luis XIV",
  description: "Silla",
  price: 9500,
  thumbnails: "Sin imagen",
  code: "abc128",
  stock: 17,
  status: "true",
  category: "sillas",
});
productManager.addProduct({
  id: 8,
  title: "Silla matera",
  description: "Silla",
  price: 7500,
  thumbnails: "Sin imagen",
  code: "abc129",
  stock: 8,
  status: "true",
  category: "sillas",
});
productManager.addProduct({
  id: 9,
  title: "Silla Gervasoni",
  description: "Silla",
  price: 23500,
  thumbnails: "Sin imagen",
  code: "abc130",
  stock: 2,
  status: "true",
  category: "sillas",
});
productManager.addProduct({
  id: 10,
  title: "Silla Jeanneret",
  description: "Silla",
  price: 20500,
  thumbnails: "Sin imagen",
  code: "abc131",
  stock: 6,
  status: "true",
  category: "sillas",
});
productManager.addProduct({
  id: 11,
  title: "Silla Eames",
  description: "Silla",
  price: 5000,
  thumbnails: "Sin imagen",
  code: "abc132",
  stock: 12,
  status: "true",
  category: "sillas",
});

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

router.post("/", (req, res) => {
  const product = req.body;
  if (
    !product.title ||
    !product.description ||
    !product.price ||
    !product.code ||
    !product.status ||
    !product.category ||
    !product.stock
  ) {
    return res
      .status(400)
      .json({ status: "error", error: "Todos los campos requeridos" });
  }
  const productToAdd = productManager.addProduct(product);
  if (typeof productToAdd === "string") {
    return res.status(400).json({ status: "error", error: productToAdd });
  }
  res.json({
    status: "success",
    payload: productToAdd,
  });
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

router.delete("/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  productManager.deleteProductById(productId);

  res.json({
    status: "success",
    payload: "Producto eliminado correctamente.",
  });
});

export default router;
