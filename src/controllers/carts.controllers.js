import { CartService, UserService } from "../services/index.js";
import { ProductService } from "../services/index.js";
import { TicketService } from "../services/index.js";
import shortid from "shortid";
import { JWT_COOKIE_NAME } from "../utils/utils.js";
import { verifyToken } from "../utils/utils.js";
import logger from "../utils/logger.js";
import { sendEmail } from "../utils/utils.js";
import { parse } from "dotenv";

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
          cartToUpdate.products[productIndex].quantity += 1;
        } else {
          cartToUpdate.products.push({ product: pid, quantity: 1 });
        }
        const result = await CartService.update(cid, cartToUpdate, {new: true});
        logger.info(`Cart with id ${cid} updated`)
        res.status(201).json({ status: "success", payload: result });
      } catch (err) {
        logger.error(err.message)
        res.status(500).json({ status: "error", error: err.message });
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

export const purchaseController = async(req, res) => {
  try {
      const cid = req.user.cart// req.params.cid // 
      const cartToPurchase = await CartService.getProducts(cid)
      if (cartToPurchase === null) {
          return res.status(404).json({ status: 'error', error: `Cart with id=${cid} Not found` })
      }
      let productsToTicket = []
      let productsAfterPurchase = cartToPurchase.products
      let amount = 0
      for (let index = 0; index < cartToPurchase.products.length; index++) {
          const productToPurchase = await ProductService.getById(cartToPurchase.products[index].product._id)
          if (productToPurchase === null) {
              return res.status(400).json({ status: 'error', error: `Product with id=${cartToPurchase.products[index].product._id} does not exist. We cannot purchase this product` })
          }
          if (cartToPurchase.products[index].quantity <= productToPurchase.stock) {
//------------actualizamos el stock del producto que se está comprando
              productToPurchase.stock -= cartToPurchase.products[index].quantity
              await ProductService.update(productToPurchase._id, { stock: productToPurchase.stock })
//------------eliminamos (del carrito) los productos que se han comparado (en memoria)
              productsAfterPurchase = productsAfterPurchase.filter(item => item.product.toString() !== cartToPurchase.products[index].product.toString())
//------------calculamos el amount (total del ticket)
              amount += (productToPurchase.price * cartToPurchase.products[index].quantity)
//------------colocamos el producto en el Ticket (en memoria)
              productsToTicket.push({ title: productToPurchase.title, description: productToPurchase.description, price: productToPurchase.price, quantity: cartToPurchase.products[index].quantity, totalPrice: productToPurchase.price * cartToPurchase.products[index].quantity})
          }
      }
      console.log('productsToTicket: ' + JSON.stringify(productsToTicket, null, 2))
//----eliminamos (del carrito) los productos que se han comparado
      await CartService.update(cid, { products: productsAfterPurchase }, { returnDocument: 'after' })
//----creamos el Ticket
      const user = await UserService.getByData({ cart: cartToPurchase })
      const result = await TicketService.create({
          code: shortid.generate(),
          products: productsToTicket,
          amount,
          purchaser: user.email
      })
    
//----Enviar email
      const productsToTicketHTML = productsToTicket.map(p => `
          <tr>
              <td>${p.title}</td>
              <td>${p.description}</td>
              <td>${p.quantity}</td>
              <td>${p.price}</td>
              <td>${p.price * p.quantity}</td>
          </tr>`
      ).join('');
      const subject = '[Ethereal] Compra confirmada';
      const htmlMessage = `<h1>Tu compra en Ethereal ha sido exitosa!!!</h1><br/><p>Detalles</p><br/>Comprador: ${result.purchaser}<br/>Código de compra: ${result.code}<br/>Fecha de compra: ${result.purchase_datetime}<br/>
      <table>
        <thead>
            <tr>
                <th>Nombre del Producto</th>
                <th>Descripción del Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Precio Total</th>
            </tr>
        </thead>
        <tbody>
        ${productsToTicketHTML}
          </tbody>
    </table>
    <br/>
      <strong>Total: $${result.amount}</strong><br/><br/>Saludos,<br><strong>El equipo de Ethereal</strong>`
      sendEmail(result.purchaser, subject, htmlMessage)

      return res.status(201).render('checkoutDetail', {products: productsToTicket, ticket : parse(result)})
  } catch(err) {
      //return res.status(500).json({ status: 'error', error: err.message })
      return res.status(500).render('checkoutDetail', { status: 'error', error: err.message })
  }
}

export const chekoutController = async(req, res) => {
  return res.render('checkout')

}

