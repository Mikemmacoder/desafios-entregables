import { fechaLegible } from "../utils/utils.js";
export default class ShortUsersDTO {
    constructor(users) {
        this.usersDTO = users.map(user => ({
            _id: user._id,
            name: user.first_name + ' ' + user.last_name || "",
            email: user.email || "",
            role: user.role || "",
            last_connection: user.last_connection
        }));
    }
}