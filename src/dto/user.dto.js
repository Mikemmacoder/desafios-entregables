export default class UserDTO {
    constructor(user) {
        this.id = user.id || user._id || null
        this.first_name = user.first_name || ""
        this.email = user.email || ""
        this.role = user.role || ""
        this.tickets = this.tickets || [] 
    }
}