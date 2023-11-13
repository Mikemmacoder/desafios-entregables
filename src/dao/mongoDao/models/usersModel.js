import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String },
  email: { type: String, required: true, unique: true },
  age: { type: Number},
  password: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  cart: {type: mongoose.Schema.Types.ObjectId, ref: 'carts'}
});
const usersCollection = "users";
const usersModel = mongoose.model(usersCollection, usersSchema);

export default usersModel;
