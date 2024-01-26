import UserPasswordModel from "./models/user.password.model.js";

export default class UserPasswordMongoDAO {
    getByData = async(data) => await UserPasswordModel.findOne(data).lean().exec();
    create = async(data) => await UserPasswordModel.create(data)
    delete = async(email) => await UserPasswordModel.deleteOne({ email: email})
}