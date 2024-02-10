import Stripe from 'stripe'
import config from '../config/config.js' 
import { CartService, ProductService } from '../services/index.js'

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
    //console.log('productsToTicket: ' + JSON.stringify(productsToTicket, null, 2))
   /*  const products =  await CartService.getProducts(cartId)
    const productsList = products.products */
    const lineItems = productsToTicket.map(product => ({
        price_data: {
            product_data: {
                name: product.title,
                description: product.description
            },
            currency: 'usd',
            unit_amount: product.price //Aquí se podría consumir una API para convertir pesos a dólares
        },
        quantity: product.quantity
    }));
    //console.log('line_items   ' + JSON.stringify(lineItems,null,2))
    if (lineItems.length > 0) {

        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:8080/api/carts/:cid/purchase', //cambie la de success
            cancel_url: 'http://localhost:8080/pay/cancel'
        }) 
        return res.json(session)
    }else{
        return res.status(400).send({error: 'Has excedido el stock disponible de producto/s'})
    }   
}
/* export const successSession = async (req, res) => {
    console.log('req.user: ' + JSON.stringify(req.user, null, 2))

    res.send('Compra realizada con éxito!!')
} */
export const cancelSession = async (req, res) => {

    console.log('req.user.cart: ' + JSON.stringify(req.user.cart, null, 2))
    return res.status(201).render('checkoutCancel', {cid: req.user.cart})
}