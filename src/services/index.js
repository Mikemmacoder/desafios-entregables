import ProductMongoDAO from '../dao/mongoDao/productsDao.js'
import ProductRepository from './product.repository.js'
import CartMongoDAO from '../dao/mongoDao/cartsDao.js'
import CartRepository from './cart.repository.js'
import TicketRepository from './ticket.repository.js'
import TicketMongoDAO from '../dao/mongoDao/ticketsDao.js'

export const ProductService = new ProductRepository(new ProductMongoDAO()) 
export const CartService = new CartRepository(new CartMongoDAO()) 
export const TicketService = new TicketRepository(new TicketMongoDAO()) 
