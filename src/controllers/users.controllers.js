import { UserService } from "../services/index.js";
import usersModel from "../dao/mongoDao/models/usersModel.js";
import ShortUsersDTO from "../dto/short.user.dto.js";
import { sendEmail } from "../utils/utils.js";

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
        // Setea la fecha de ahora restandole un 2 al día 
        twoDaysAgo.setDate(currentDate.getDate() - 2); // En lugar de 2024-01-23T14:30:10.636Z => 2024-01-21T14:30:10.636Z
        const usersToDelete = await usersModel.find({last_connection: { $lt: twoDaysAgo} })
        const result = await usersModel.deleteMany({ last_connection: { $lt: twoDaysAgo} });
        // result devuelve:  { acknowledged: true, deletedCount: 1 }
        usersToDelete.forEach((user) =>{
            const subject = '[Ethereal] Cuenta eliminada';
            const htmlMessage = `<h1>Tu cuenta en Ethereal ha sido eliminada por inactividad!!!</h1><br/><br/>Saludos,<br><strong>El equipo de Ethereal</strong>`
            sendEmail(user.email, subject, htmlMessage)
        })
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

