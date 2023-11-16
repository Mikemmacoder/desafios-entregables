import { PORT } from "../app.js"
export default class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }
    getAll = async() => await this.dao.getAll()
    getById = async(id) => await this.dao.getById(id)
    getAllPaginate = async(req, options) => await this.dao.getAllPaginate(req, options)
    create = async(product) => await this.dao.create(product)
    update = async(id, data, options) => await this.dao.update(id, data, options)
    delete = async(id) => await this.dao.delete(id)
}