import { Router } from "express";
const router = Router();
/* import { CartManager } from "../cart-manager.js";
const cartManager = new CartManager("./data/carts.json");
import fs from "fs"; */
import cartsModel from "../dao/models/carts.model.js";
import productsModel from "../dao/models/products.model.js";

export const getProductsFromCart = async (req, res) => {
  try {
    const id = req.params.cid;
    const result = await cartsModel
      .findById(id)
      .populate("products.product")
      .lean();
    if (result === null) {
      return {
        statusCode: 404,
        response: { status: "error", error: "Not found" },
      };
    }
    return {
      statusCode: 200,
      response: { status: "succes", payload: result },
    };
  } catch (err) {
    return {
      statusCode: 500,
      response: { status: "error", error: err.message },
    };
  }
};

router.post("/", async (req, res) => {
  /* const newCart = cartManager.addCart();
  return res.json(newCart); */
  try {
    const cartToAdd = await cartsModel.create({});
    res.status(201).json({ status: "success", payload: cartToAdd });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

router.get("/:cid", async (req, res) => {
  /* const id = parseInt(req.params.cid);
  const result = await cartManager.getCartById(id);
  if (typeof result === "string") {
    return res
      .status(404)
      .json({ status: "error", error: "Cart does not exists" });
  }
  res.status(200).json({ status: "success", payload: result }); */
  const result = await getProductsFromCart(req, res);
  res.status(result.statusCode).json(result.response);
});

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cartToUpdate = await cartsModel.findById(cid);
    if (cartToUpdate === null) {
      return res
        .status(404)
        .json({ status: "error", error: `Cart with id ${cid} Not found` });
    }
    const productToAdd = await productsModel.findById(pid);
    if (productToAdd === null) {
      return res
        .status(404)
        .json({ status: "error", error: `Product with id ${pid} Not found` });
    }
    const productIndex = cartToUpdate.products.findIndex(
      (item) => item.product == pid
    );
    if (productIndex > -1) {
      cartToUpdate.products[productIndex].quantity += 1;
    } else {
      cartToUpdate.products.push({ product: pid, quantity: 1 });
    }
    const result = await cartsModel.findByIdAndUpdate(cid, cartToUpdate, {
      returnDocument: "after",
    });
    res.status(201).json({ status: "success", payload: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
  /*   const cid = parseInt(req.params.cid);
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
    updatedCart: updatedCart,*/
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cartToUpdate = await cartsModel.findById(cid);
    if (cartToUpdate === null) {
      return res
        .status(404)
        .json({ status: "error", error: `Cart with id ${cid} not found` });
    }
    const productToDelete = await productsModel.findById(pid);
    if (productToDelete === null) {
      return res
        .status(404)
        .json({ status: "error", error: `Product with id ${pid} not found` });
    }
    const productIndex = cartToUpdate.products.findIndex(
      (item) => item.product == pid
    );
    if (productIndex === -1) {
      return res.status(404).json({
        status: "error",
        error: `Product with id ${pid} not found in cart with id ${cid}`,
      });
    } else {
      cartToUpdate.products = cartToUpdate.products.filter(
        (item) => item.product.toString() !== pid
      );
    }
    const result = await cartsModel.findByIdAndUpdate(cid, cartToUpdate, {
      returnDocument: "after",
    });
    res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});
router.delete("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cartToUpdate = await cartsModel.findById(cid);
    if (cartToUpdate === null) {
      return res
        .status(404)
        .json({ status: "error", error: `Cart with id=${cid} Not found` });
    }
    cartToUpdate.products = [];
    const result = await cartsModel.findByIdAndUpdate(cid, cartToUpdate, {
      returnDocument: "after",
    });
    res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});
router.put("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cartToUpdate = await cartsModel.findById(cid);
    if (cartToUpdate === null) {
      return res
        .status(404)
        .json({ status: "error", error: `Cart with id ${cid} not found` });
    }
    const products = req.body.products;
    if (!products) {
      return res
        .status(400)
        .json({ status: "error", error: `Field "products" is required` });
    }
    for (let i = 0; i < products.length; i++) {
      if (
        !products[i].hasOwnProperty("product") ||
        !products[i].hasOwnProperty("quantity")
      ) {
        return res.status(400).json({
          status: "error",
          error: `Product must have a valid id and a valid quantity`,
        });
      }
      if (typeof products[i].quantity !== "number") {
        return res.status(400).json({
          status: "error",
          error: `Product quantity must be a number`,
        });
      }
      if (products[i].quantity === 0) {
        return res
          .status(400)
          .json({ status: "error", error: `Product quantity cannot be 0` });
      }
      const productToAdd = await productsModel.findById(products[i].product);
      if (productToAdd === null) {
        return res.status(400).json({
          status: "error",
          error: `Product with id ${products[i].product} does not exist`,
        });
      }
    }
    cartToUpdate.products = products;
    const result = await cartsModel.findByIdAndUpdate(cid, cartToUpdate, {
      returnDocument: "after",
    });
    res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cartToUpdate = await cartsModel.findById(cid);
    if (cartToUpdate === null) {
      return res
        .status(404)
        .json({ status: "error", error: `Cart with id=${cid} Not found` });
    }
    const productToUpdate = await productsModel.findById(pid);
    if (productToUpdate === null) {
      return res.status(404).json({
        status: "error",
        error: `Product with id=${pid} Not found`,
      });
    }
    const quantity = req.body.quantity;
    if (!quantity) {
      return res.status(400).json({
        status: "error",
        error: 'Field "quantity" is not optional',
      });
    }
    if (typeof quantity !== "number") {
      return res.status(400).json({
        status: "error",
        error: "product's quantity must be a number",
      });
    }
    if (quantity === 0) {
      return res
        .status(400)
        .json({ status: "error", error: "product's quantity cannot be 0" });
    }
    const productIndex = cartToUpdate.products.findIndex(
      (item) => item.product == pid
    );
    if (productIndex === -1) {
      return res.status(400).json({
        status: "error",
        error: `Product with id=${pid} Not found in Cart with id=${cid}`,
      });
    } else {
      cartToUpdate.products[productIndex].quantity = quantity;
    }

    const result = await cartsModel.findByIdAndUpdate(cid, cartToUpdate, {
      returnDocument: "after",
    });
    res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

export default router;
