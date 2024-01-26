import cartsModel from "./models/carts.model.js";

export default class CartMongoDAO {
    getProducts = async (id) => {
        const products = await cartsModel
        .findById(id)
        .populate("products.product")
        .lean();
        return products
    };
    getById = async(id) => await cartsModel.findById(id) // .lean().exec();
    create = async() => await cartsModel.create({});
    update = async (id, cartToUpdate, options = {} ) => {
        const result = await cartsModel.findByIdAndUpdate(id, cartToUpdate, options)
        return result
    }
}