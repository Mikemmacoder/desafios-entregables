import { UserService } from "../services/index.js";
import usersModel from "../dao/mongoDao/models/usersModel.js";
import ShortUsersDTO from "../dto/short.user.dto.js";

export const get = async (req, res) => {
    const users = await UserService.getAll()
    const usersDTO = new ShortUsersDTO(users)
    res.json (usersDTO)
}
export const create = async (req, res) => {
    const user = req.body
    const newUser= await UserService.create(user)
    res.json({user: newUser})
}
export const deleteByLastConnection = async (req, res) => {
    try {
        const currentDate = new Date();
        const twoDaysAgo = new Date();
        // Setea la fecha de ahora restandole un 2 al día 23
        twoDaysAgo.setDate(currentDate.getDate() - 2); // En lugar de 2024-01-23T14:30:10.636Z => 2024-01-21T14:30:10.636Z
        const result = await usersModel.deleteMany({ last_connection: { $lt: varprueba } });
        // result devuelve:  { acknowledged: true, deletedCount: 1 }
        res.json({ message: `${result.deletedCount} usuarios eliminados correctamente.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor.' });
    }
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

