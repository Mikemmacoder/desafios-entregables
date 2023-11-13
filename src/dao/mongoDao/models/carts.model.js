import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
  products: {
    type: [
      {
        _id: false,
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: Number,
      },
    ],
    default: [],
  },
});
const cartsCollection = "carts";
const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;
