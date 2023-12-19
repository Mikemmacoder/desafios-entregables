export default class ticketDTO {
    constructor(ticket) {
        this.id = this.id || this._id || null ////////////
        this.purchaser = ticket.purchaser || ""
        this.amount = ticket.amount || ""
    }
}