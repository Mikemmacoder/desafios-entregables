import cartsModel from "./models/carts.model.js";

export default class CartMongoDAO {
    getProducts = async (id) => {
        const products = await cartsModel
        .findById(id) // id del cart
        .populate("products.product") //id de productos
        .lean();
        return products
    };
    getProductsbyModel = async (id) => {
        const products = await cartsModel.findById(id).lean();
        return products // solo retorna el id del cart y products{_id, quantity}
    };
    getById = async(id) => await cartsModel.findById(id) // .lean().exec();
    create = async() => await cartsModel.create({});
    update = async (id, cartToUpdate, options = {} ) => {
        const result = await cartsModel.findByIdAndUpdate(id, cartToUpdate, options)
        return result
    }
}