
export default class CartRepository {
    constructor(dao) {
        this.dao = dao
    }
    geProducts = async(id) => await this.dao.getProducts(id)
    getById = async(id) => await this.dao.getById(id)
    create = async() => await this.dao.create()
    update = async(id, cartToUpdate, options) => await this.dao.update(id, cartToUpdate, options)
}