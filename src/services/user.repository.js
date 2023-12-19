export default class UserRepository {
    constructor(dao) {
        this.dao = dao
    }
    getAll = async() => await this.dao.getAll()
    getById = async(id) => await this.dao.getById(id)
    create = async(data) => await this.dao.create(data)
}