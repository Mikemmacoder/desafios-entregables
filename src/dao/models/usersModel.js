import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  role: String,
});
const usersCollection = "users";
const usersModel = mongoose.model(usersCollection, usersSchema);

export default usersModel;
