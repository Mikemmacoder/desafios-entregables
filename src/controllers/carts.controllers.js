import { CartService } from "../services/index.js";
import { ProductService } from "../services/index.js";
//-----controllers de api/carts-----
/* export const getProductsFromCart = async (req, res) => {
    try {
      const id = req.params.cid;
      const result = await getProducts(id)
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
  }; */
export const createCartController = async (req, res) => {
    try {
        const cartToAdd = await CartService.create();
        res.status(201).json({ status: "success", payload: cartToAdd });
      } catch (err) {
        res.status(500).json({ status: "error", error: err.message });
      }
}
export const getCartController = async (req, res) => {
  try {
    const id = req.params.cid;
    const result = await CartService.geProducts(id)
    if (result === null) {
      return {
        statusCode: 404,
        response: { status: 'error', error: 'Not found' }
      }
    }
    return {
      statusCode: 200,
      response: { status: 'success', payload: result }
    }
  } catch (err) {
    return {
      statusCode: 500,
      response: { status: 'error', error: err.message }
  }
}}

export const addProductToCartController = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const cartToUpdate = await CartService.getById(cid);
        if (cartToUpdate === null) {
          return res
            .status(404)
            .json({ status: "error", error: `Cart with id ${cid} Not found` });
        }
        const productToAdd = await ProductService.getById(pid);
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
        const result = await CartService.update(cid, cartToUpdate, {new: true});
        res.status(201).json({ status: "success", payload: result });
      } catch (err) {
        res.status(500).json({ status: "error", error: err.message });
      }
}
export const deleteProductInCartController = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const cartToUpdate = await CartService.getById(cid);
        if (cartToUpdate === null) {
          return res
            .status(404)
            .json({ status: "error", error: `Cart with id ${cid} not found` });
        }
        const productToDelete = await ProductService.getById(pid);
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
        const result = await CartService.update(cid, cartToUpdate, { new: true });
        res.status(200).json({ status: "success", payload: result });
      } catch (err) {
        res.status(500).json({ status: "error", error: err.message });
      }
}
export const deleteAllProductsfromCartController = async (req, res) => {
    try {
        const cid = req.params.cid;
        const cartToUpdate = await CartService.getById(cid);
        if (cartToUpdate === null) {
          return res
            .status(404)
            .json({ status: "error", error: `Cart with id=${cid} Not found` });
        }
        cartToUpdate.products = [];
        const result = await CartService.update(cid, cartToUpdate, { new: true });
        res.status(200).json({ status: "success", payload: result });
      } catch (err) {
        res.status(500).json({ status: "error", error: err.message });
      }
}
export const putProductsInCartController = async (req, res) => {
    try {
        const cid = req.params.cid;
        const cartToUpdate = await CartService.getById(cid);
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
          const productToAdd = await ProductService.getById(products[i].product);
          if (productToAdd === null) {
            return res.status(400).json({
              status: "error",
              error: `Product with id ${products[i].product} does not exist`,
            });
          }
        }
        cartToUpdate.products = products;
        const result = await CartService.update(cid, cartToUpdate, {new: true});
        res.status(200).json({ status: "success", payload: result });
      } catch (err) {
        res.status(500).json({ status: "error", error: err.message });
      }
}
export const updateQuantityProductFromCartController = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const cartToUpdate = await CartService.getById(cid);
        if (cartToUpdate === null) {
          return res
            .status(404)
            .json({ status: "error", error: `Cart with id=${cid} Not found` });
        }
        const productToUpdate = ProductService.getById(pid);
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
    
        const result = await CartService.update(cid, cartToUpdate, {new: true});
        res.status(200).json({ status: "success", payload: result });
      } catch (err) {
        res.status(500).json({ status: "error", error: err.message });
      }
}
//-----controllers de /carts----- en view.router
export const getProductsFromCartController = async (req, res) => {
  const result = await getCartController(req, res);
  if (result.statusCode === 200) {
    res.render("productsFromCart", {
      cart: result.response.payload,
    });
  } else {
    const showErrorAlert = true; 
    const errorMessage = result.response.error 
    res.status(result.statusCode)
    .render("home", { showErrorAlert, errorMessage })
      //renderiza sweet alert
      //TODO: ahora el home renderiza productos, debería haber una pagina de bienvenida a la cual redireccionar
  }
}