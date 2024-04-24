import express from 'express';
import handlebars from 'express-handlebars';
import productsRouter from'./routes/products.router.js';
import cartsRouter from'./routes/carts.router.js';
import chatRouter from './routes/chat.router.js';
import viewsRouter from './routes/views.router.js';
import __dirname from './utils/utils.js';


import {Server} from 'socket.io';
import websocket from './websocket.js';
import mongoose from 'mongoose';

const app = express();

//MongoDB connect
const uri = "mongodb+srv://marcelotellocortez:wpmoneDQ4aKUwrPI@codercluster.ngzogsp.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=CoderCluster";
mongoose.connect(uri);
mongoose.connection.on('connected', () => {
    console.log('Conectado a MongoDB');
});
mongoose.connection.on('error', (err) => {
    console.error('Error de conexión a MongoDB:', err);
});

//Handlebars Config
app.engine('handlebars', handlebars.engine());
app.set('views',__dirname+'/../views');
app.set('view engine','handlebars');

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname+'/../public'))


//Routers
app.use('/',viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/chat', chatRouter);


const PORT = 8080;
const httpServer = app.listen(PORT,() => { 
    console.log("Escuchando por el puerto 8080");
});

const io = new Server(httpServer);

websocket(io);

