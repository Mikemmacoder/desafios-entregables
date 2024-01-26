export default class UserPasswordRepository {
    constructor(dao) {
        this.dao = dao
    }
    getByData = async(data) => await this.dao.getByData(data) //data puede ser cualquier prop como token o email
    create = async(data) => await this.dao.create(data)
    delete = async(email) => await this.dao.delete(email)
}