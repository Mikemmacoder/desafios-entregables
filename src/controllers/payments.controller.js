import Stripe from 'stripe'
import config from '../config/config.js' 
import { CartService, ProductService, UserService, TicketService } from '../services/index.js'
import shortid from "shortid";
import { sendEmail } from '../utils/utils.js';

const stripe = new Stripe(config.stripe)

export const createSession = async (req, res) => {
    const {cartId} = req.body
    console.log(cartId)
    const cartToPurchase = await CartService.getProducts(cartId)
    if (cartToPurchase === null) {
        return res.status(404).json({ status: 'error', error: `Cart with id=${cartId} Not found` })
    }
    let productsToTicket = []
    let amount = 0
    for (let index = 0; index < cartToPurchase.products.length; index++) {
        const productToPurchase = await ProductService.getById(cartToPurchase.products[index].product._id) 
        if (productToPurchase === null) {                                                                           
            return res.status(400).json({ status: 'error', error: `Product with id=${cartToPurchase.products[index].product._id} does not exist. We cannot purchase this product` })
        }
        if (cartToPurchase.products[index].quantity <= productToPurchase.stock) {
            amount += (productToPurchase.price * cartToPurchase.products[index].quantity)
//------------colocamos el producto en el Ticket (en memoria)
            productsToTicket.push({ product: productToPurchase._id, title: productToPurchase.title, description: productToPurchase.description, price: productToPurchase.price, quantity: cartToPurchase.products[index].quantity})
        }
    }
    const lineItems = productsToTicket.map(product => ({
        price_data: {
            product_data: {
                name: product.title,
                description: product.description
            },
            currency: 'usd',
            unit_amount: product.price //TODO: consumir una API para convertir pesos a dólares
        },
        quantity: product.quantity
    }));
    if (lineItems.length > 0) {
        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:8080/pay/success',
            cancel_url: 'http://localhost:8080/pay/cancel'
        }) 
        return res.json(session)
    }else{
        return res.status(400).send({error: 'Por favor selecciona productos con stock disponible para realizar la compra'})
    }   
}
export const successSession = async (req, res) => {
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
          <table><thead><tr>
                  <th>Nombre del Producto</th>
                  <th>Descripción del Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Precio Total</th>
              </tr></thead><tbody>${productsToTicketHTML}</tbody></table><br/>
          <strong>Total: $${result.amount}</strong><br/><br/>Saludos,<br><strong>El equipo de Ethereal</strong>`
        sendEmail(result.purchaser, subject, htmlMessage)
        console.log(result)
        return res.status(201).render('checkoutDetail', {products: productsToTicket, amount, email: user.email})
    } catch(err) {
        return res.status(500).render('checkoutDetail', { status: 'error', error: err.message })
    }
}
export const cancelSession = async (req, res) => {
    return res.status(201).render('checkoutCancel', {cid: req.user.cart})
}