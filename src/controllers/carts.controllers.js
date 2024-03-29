import { CartService} from "../services/index.js";
import { ProductService } from "../services/index.js";
import { JWT_COOKIE_NAME } from "../utils/utils.js";
import { verifyToken } from "../utils/utils.js";
import logger from "../utils/logger.js";

//-----controllers de api/carts-----
export const createCartController = async (req, res) => {
    try {
        const cartToAdd = await CartService.create();
        logger.info('Cart created: ' + cartToAdd)
        res.status(201).json({ status: "success", payload: cartToAdd });
      } catch (err) {
        logger.error(err.message)
        res.status(500).json({ status: "error", error: err.message });
      }
}
export const getCartController = async (req, res) => {
  try {
    const token = req.cookies[JWT_COOKIE_NAME];
    if (!token) {
      logger.error('Unauthorized to access cart')
      return res.status(401).render('errors/base', { error: 'Unauthorized' });
    }
    const decodedToken = verifyToken(token);
    const id = decodedToken.user.cart || req.params.cid
    const result = await CartService.getProducts(id)
    if (result === null) {
      logger.error('Cart not found')
      return {
        statusCode: 404,
        response: { status: 'error', error: 'Not found' }
      }
    }
    logger.info('User accessed to cart with id ' + id + ' . Products in cart: ' + result)
    return {
      statusCode: 200,
      response: { status: 'success', payload: result }
    }
  } catch (err) {
    logger.error(err.message)
    return {
      statusCode: 500,
      response: { status: 'error', error: err.message }
  }
}}

export const addProductToCartController = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const decodedToken = verifyToken(req.cookies[JWT_COOKIE_NAME]);
        
        const cartToUpdate = await CartService.getById(cid);
        if (cartToUpdate === null) {
          logger.error(`Cart with id ${cid} Not found`)
          return res
            .status(404)
            .json({ status: "error", error: `Cart with id ${cid} Not found` });
        }
        const productToAdd = await ProductService.getById(pid);

        if (productToAdd === null) {
          logger.error(`Product with id ${pid} Not found`)
          return res
            .status(404)
            .json({ status: "error", error: `Product with id ${pid} Not found` });
        }

        logger.info('decodedToken.user.email: ' + decodedToken.user.email)
        if (productToAdd.owner === decodedToken.user.email) {
          return res.status(400).json({ status: 'error', error: 'You cannot buy your own products' })
        }
        const productIndex = cartToUpdate.products.findIndex(
          (item) => item.product == pid
        );
        if (productIndex > -1) {
          if(productToAdd.stock == cartToUpdate.products[productIndex].quantity){
            return res.status(400).json({ status: 'error', error: 'Has alcanzado el máximo de productos disponibles' })
          }
          cartToUpdate.products[productIndex].quantity += 1;
        } else {
          cartToUpdate.products.push({ product: pid, quantity: 1 });
        }
        const result = await CartService.update(cid, cartToUpdate, {new: true});
        logger.info(`Cart with id ${cid} updated`)
        return res.status(201).json({ status: "success", payload: result });
      } catch (err) {
        logger.error(err.message)
        return res.status(500).json({ status: "error", error: err.message });
      }
}
export const deleteProductInCartController = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const cartToUpdate = await CartService.getById(cid);
        if (cartToUpdate === null) {
          logger.error(`Cart with id ${cid} not found`)
          return res
            .status(404)
            .json({ status: "error", error: `Cart with id ${cid} not found` });
        }
        const productToDelete = await ProductService.getById(pid);
        if (productToDelete === null) {
          logger.error(`Product with id ${pid} not found.`)
          return res
            .status(404)
            .json({ status: "error", error: `Product with id ${pid} not found` });
        }
        const productIndex = cartToUpdate.products.findIndex(
          (item) => item.product == pid
        );
        if (productIndex === -1) {
          logger.error(`Product with id ${pid} not found in cart with id ${cid}`)
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
        logger.info(`Product with id ${pid} deleted from cart with id ${cid}`)
        res.status(200).json({ status: "success", payload: result });
      } catch (err) {
        logger.error(err.message)
        res.status(500).json({ status: "error", error: err.message });
      }
}
export const deleteAllProductsfromCartController = async (req, res) => {
    try {
        const cid = req.params.cid;
        const cartToUpdate = await CartService.getById(cid);
        if (cartToUpdate === null) {
          logger.error(`Cart with id ${cid} not found`)
          return res
            .status(404)
            .json({ status: "error", error: `Cart with id=${cid} Not found` });
        }
        cartToUpdate.products = [];
        const result = await CartService.update(cid, cartToUpdate, { new: true });
        logger.info(`All products werw deleted from cart with id ${cid}`)
        res.status(200).json({ status: "success", payload: result });
      } catch (err) {
        logger.error(err.message)
        res.status(500).json({ status: "error", error: err.message });
      }
}
export const putProductsInCartController = async (req, res) => {
    try {
        const cid = req.params.cid;
        const cartToUpdate = await CartService.getById(cid);
        if (cartToUpdate === null) {
          logger.error(`Cart with id ${cid} not found`)
          return res
            .status(404)
            .json({ status: "error", error: `Cart with id ${cid} not found` });
        }
        const products = req.body.products;
        if (!products) {
          logger.error(`Field "products" is required`)
          return res
            .status(400)
            .json({ status: "error", error: `Field "products" is required` });
        }
        for (let i = 0; i < products.length; i++) {
          if (
            !products[i].hasOwnProperty("product") ||
            !products[i].hasOwnProperty("quantity")
          ) {
            logger.error('Product must have a valid id and a valid quantity')
            return res.status(400).json({
              status: "error",
              error: `Product must have a valid id and a valid quantity`,
            });
          }
          if (typeof products[i].quantity !== "number") {
            logger.error('Product quantity must be a number')
            return res.status(400).json({
              status: "error",
              error: `Product quantity must be a number`,
            });
          }
          if (products[i].quantity === 0) {
            logger.error('Product quantity cannot be 0')
            return res
              .status(400)
              .json({ status: "error", error: `Product quantity cannot be 0` });
          }
          const productToAdd = await ProductService.getById(products[i].product);
          if (productToAdd === null) {
            logger.error(`Product with id ${products[i].product} does not exist`)
            return res.status(400).json({
              status: "error",
              error: `Product with id ${products[i].product} does not exist`,
            });
          }
        }
        cartToUpdate.products = products;
        const result = await CartService.update(cid, cartToUpdate, {new: true});
        logger.info(`Cart with id ${cid} updated:  ${result}`)
        res.status(200).json({ status: "success", payload: result });
      } catch (err) {
        logger.error(err.message)
        res.status(500).json({ status: "error", error: err.message });
      }
}
export const updateQuantityProductFromCartController = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const cartToUpdate = await CartService.getById(cid);
        if (cartToUpdate === null) {
          logger.error(`Cart with id ${cid} not found`)
          return res
            .status(404)
            .json({ status: "error", error: `Cart with id=${cid} Not found` });
        }
        const productToUpdate = ProductService.getById(pid);
        if (productToUpdate === null) {
          logger.error(`Product with id=${pid} Not found`)
          return res.status(404).json({
            status: "error",
            error: `Product with id=${pid} Not found`,
          });
        }
        const quantity = req.body.quantity;
        if (!quantity) {
          logger.error('Field "quantity" is not optional')
          return res.status(400).json({
            status: "error",
            error: 'Field "quantity" is not optional',
          });
        }
        if (typeof quantity !== "number") {
          logger.error("product's quantity must be a number")
          return res.status(400).json({
            status: "error",
            error: "product's quantity must be a number",
          });
        }
        if (quantity === 0) {
          logger.error("product's quantity cannot be 0")
          return res
            .status(400)
            .json({ status: "error", error: "product's quantity cannot be 0" });
        }
        const productIndex = cartToUpdate.products.findIndex(
          (item) => item.product == pid
        );
        if (productIndex === -1) {
          logger.error(`Product with id=${pid} Not found in Cart with id=${cid}`)
          return res.status(400).json({
            status: "error",
            error: `Product with id=${pid} Not found in Cart with id=${cid}`,
          });
        } else {
          cartToUpdate.products[productIndex].quantity = quantity;
        }
        const result = await CartService.update(cid, cartToUpdate, {new: true});
        logger.info(`Cart with id ${cid} updated:  ${result}`)
        res.status(200).json({ status: "success", payload: result });
      } catch (err) {
        logger.error(err.message)
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
