export default class UserRepository {
    constructor(dao) {
        this.dao = dao
    }
    getAll = async() => await this.dao.getAll()
    getById = async(id) => await this.dao.getById(id)
    getByData = async(data) => await this.dao.getByData(data) //data puede ser cualquier prop como email o cart
    getAllByData = async(data) => await this.dao.getAllByData(data) //data puede ser cualquier prop como email o cart
    create = async(data) => await this.dao.create(data)
    update = async(id, data) => await this.dao.update(id, data)
    delete = async(id) => await this.dao.delete(id)
    deleteMany = async(data) => await this.dao.deleteMany(data)
}