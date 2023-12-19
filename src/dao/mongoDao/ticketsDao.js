import ticketModel from "./models/ticket.model.js";

export default class TicketMongoDAO {
    getAll = async() => await ticketModel.find().lean().exec()
    getById = async(id) => await ticketModel.findById(id).lean().exec();
    create = async(data) => await ticketModel.create(data)
    update = async(id, data) => await usersModel.updateOne({_id: id}, data) //////////////////////
}