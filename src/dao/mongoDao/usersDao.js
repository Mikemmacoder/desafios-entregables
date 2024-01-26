import usersModel from "./models/usersModel.js";

export default class UserMongoDAO {
    getAll = async() => await usersModel.find().lean().exec()
    getById = async(id) => await usersModel.findById(id).lean().exec();
    getByData = async(data) => await usersModel.findOne(data).lean().exec();
    getAllByData = async(data) => await usersModel.find(data).lean().exec();
    create = async(data) => await usersModel.create(data)
    update = async(id, data) => await usersModel.updateOne({_id: id}, data)
    delete = async(id) => await usersModel.deleteOne({_id: id})
    deleteMany = async(data) => await usersModel.deleteMany(data)
}