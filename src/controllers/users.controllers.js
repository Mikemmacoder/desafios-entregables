import { CartService, UserService } from "../services/index.js";
import ShortUsersDTO from "../dto/short.user.dto.js";
import { sendEmail } from "../utils/utils.js";
import logger from "../utils/logger.js";
import { generateRandomString } from "../utils/utils.js";
import { createHash } from "../utils/utils.js";

///----------Controllers en api/users----------///
export const get = async (req, res) => {
    const users = await UserService.getAll()
    const usersDTO = new ShortUsersDTO(users)
    res.json (usersDTO)
}
export const create = async (req, res) => {
    try {
        const {email} = req.body
        const usr = await UserService.getByData({ email });
        if (usr) {
            throw new Error('User already exists');
        } 
        const cartForNewUser = await CartService.create() 
        const user = {
            ...req.body, 
            password: createHash(generateRandomString(16)),
            cart: cartForNewUser
        } 
        if(!user.first_name || !user.email){
            throw new Error ('Los campos first_name y email son requeridos')
        }
        const newUser= await UserService.create(user)
        res.status(201).json({ status: "success", payload: newUser });
    } catch (err) {
    logger.error(err.message)
    res.status(500).json({ status: "error", error: err.message });
    }
}

export const deleteByLastConnection = async (req, res) => {
    try {
        const currentDate = new Date();
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(currentDate.getDate() - 2); //Setea la fecha de ahora restandole un 2 al día. En lugar de 2024-01-23T14:30:10.636Z => 2024-01-21T14:30:10.636Z
        const thirtyMinutesAgo = new Date();
        thirtyMinutesAgo.setTime(currentDate.getTime() - 30 * 60 * 1000); //calcula el equivalente en milisegundos de 30' minutos'. Luego, se resta ese valor al tiempo actual

        const usersToDelete = await UserService.getAllByData({last_connection: { $lt: thirtyMinutesAgo} }) //Colocar aquí la variable según el tiempo deseado
        const result = await UserService.deleteMany({ last_connection: { $lt: thirtyMinutesAgo} });//Colocar aquí la variable según el tiempo deseado
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

export const deleteUser = async (req, res) => {
    try {
        const id = req.params.uid;
        const result = await UserService.delete(id)
        res.json({ status: 'success', message: `${result.deletedCount} usuario eliminado correctamente.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor.' });
    }
}

///----------Controllers en viewUsersRouter----------///

export const getUsersContoller = async (req, res) => {
    const users = await UserService.getAll()
    res.render("users", {users});
}