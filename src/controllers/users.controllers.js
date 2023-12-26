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
export const update = async (req, res, data) => {
    const id = req.params.uid
    try {
        const user = await UserService.getById(id)
        await UserService.update( id, { role: user.role === 'user' ? 'premium' : 'user' })
        res.json({ status: 'success', message: 'Se ha actualizado el rol del usuario' })
    } catch(err) {
        res.json({ status: 'error', error: err.message })
    }
}

