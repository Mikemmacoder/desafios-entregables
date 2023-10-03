import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnails: { type: [String], required: false, default: [] },
  code: { type: String, required: true },
  stock: { type: Number, required: true },
  status: { type: Boolean, required: true },
  category: { type: String, required: true },
});

mongoose.set("strictQuery", false);
productsSchema.plugin(mongoosePaginate);

const productsCollection = "products";
const productsModel = mongoose.model(productsCollection, productsSchema);

export default productsModel;
