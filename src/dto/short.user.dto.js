export default class ShortUsersDTO {
    constructor(users) {
        this.usersDTO = users.map(user => ({
            name: user.first_name + ' ' + user.last_name || "",
            email: user.email || "",
            role: user.role || ""
        }));
    }
}
