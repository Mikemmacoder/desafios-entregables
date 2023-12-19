import { TicketService } from "../services/index.js";

export const get = async (req, res) => {
    const tickets = await TicketService.getAll()
    res.json ({tickets})
}
export const create = async (req, res) => {
    const ticket = req.body
    const newTicket= await UserService.create(ticket)
    res.json({user: newTicket})
}