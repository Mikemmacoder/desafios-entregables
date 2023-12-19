import { UserService } from "../services/index.js";

export const get = async (req, res) => {
    const users = await UserService.getAll()
    res.json ({users})
}
export const create = async (req, res) => {
    const user = req.body
    const newUser= await UserService.create(user)
    res.json({user: newUser})
}