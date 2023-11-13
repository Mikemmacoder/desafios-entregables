import cartsModel from "./models/carts.model.js";

export const getProductsFromCart = async (id) => {
    const products = await cartsModel
    .findById(id)
    .populate("products.product")
    .lean();
    return products
};

export const createCart = async () => {
    const result = await cartsModel.create({});
    return result
};
export const getCart = async (cid) => {
    const result = await cartsModel.findById(cid)
    return result
};
export const updateCart = async (cid, cartToUpdate, options = {} ) => {
    const result = await cartsModel.findByIdAndUpdate(cid, cartToUpdate, options)
    return result
};
