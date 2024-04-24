
import __dirname from "./utils/utils.js";
//import ProductManagerFS from "./dao/ProductManagerFS.js";
//const PM = new ProductManagerFS(`${__dirname}/../Productos.json`);

import ProductManagerDB from "./dao/ProductManagerDB.js";
import MessageManager from "./dao/MessageManager.js";

const PM = new ProductManagerDB();
const MM = new MessageManager();

//Funcion para Actualizacion de Productos en tiempo real
const socketUpdatedProducts = async (socket) => {
    const products = await PM.getProducts();
    socket.emit('productList',products);
    console.log("Productos Actualizados en tiempo real")
}

export default (io) => {

    let messages = [];

    io.on("connection", (socket) => {
        
        console.log("Nuevo cliente conectado")

        // Cuando se conecta un cliente, emite la lista de productos actual
        socketUpdatedProducts(socket);

        //socket escuchando lista de productos en tiempo real
        socket.on('messageProduct',data=>{
            console.log(data);
        })

        socket.on('messageChat', async (data) => {
            try {
                const newMessage = await MM.addMessage(data.user, data.message);
                const messages = await MM.getAllMessages();
                io.emit('messageLogs', messages);
            } catch (error) {
                console.error("Error al guardar el mensaje:", error);
            }
        });
    })
}

