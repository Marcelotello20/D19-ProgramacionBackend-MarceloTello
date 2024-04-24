import messageModel from './models/messageModel.js';

class MessageManager {

    // Función para agregar un nuevo mensaje
    async addMessage(user, message) {
        try {
            const newMessage = await messageModel.create({ user, message });
            console.log("Mensaje guardado correctamente");
            return newMessage;
        } catch (error) {
            console.error("Error al guardar el mensaje:", error);
            throw new Error("Error al guardar el mensaje");
        }
    }

    // Función para obtener todos los mensajes
    async getAllMessages() {
        try {
            return await messageModel.find().lean();
        } catch (error) {
            console.error("Error al obtener los mensajes:", error);
            throw new Error("Error al obtener los mensajes");
        }
    }
    
}

export default MessageManager;