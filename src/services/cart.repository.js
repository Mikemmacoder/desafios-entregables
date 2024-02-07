
export default class CartRepository {
    constructor(dao) {
        this.dao = dao
    }
    getProducts = async(id) => await this.dao.getProducts(id)
    getProductsbyModel = async(id) => await this.dao.getProductsbyModel(id)
    getById = async(id) => await this.dao.getById(id)
    create = async() => await this.dao.create()
    update = async(id, cartToUpdate, options) => await this.dao.update(id, cartToUpdate, options)
}