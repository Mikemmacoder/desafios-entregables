import usersModel from "./models/usersModel.js";

export default class UserMongoDAO {
    getAll = async() => await usersModel.find().lean().exec()
    getById = async(id) => await usersModel.findById(id).lean().exec();
    create = async(data) => await usersModel.create(data)
    update = async(id, data) => await usersModel.updateOne({_id: id}, data)
}