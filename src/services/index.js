import ProductMongoDAO from '../dao/mongoDao/productsDao.js'
import ProductRepository from './product.repository.js'
import CartMongoDAO from '../dao/mongoDao/cartsDao.js'
import CartRepository from './cart.repository.js'
import TicketRepository from './ticket.repository.js'
import TicketMongoDAO from '../dao/mongoDao/ticketsDao.js'
import UserRepository from './user.repository.js'
import UserMongoDAO from '../dao/mongoDao/usersDao.js'
import UserPasswordRepository from './user.password.repository.js'
import UserPasswordMongoDAO from '../dao/mongoDao/usersPasswordDao.js'

export const ProductService = new ProductRepository(new ProductMongoDAO()) 
export const CartService = new CartRepository(new CartMongoDAO()) 
export const TicketService = new TicketRepository(new TicketMongoDAO()) 
export const UserService = new UserRepository(new UserMongoDAO()) 
export const UserPasswordService = new UserPasswordRepository(new UserPasswordMongoDAO()) 
