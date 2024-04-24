import express from 'express';
import __dirname from '../utils/utils.js';
// import ProductManagerFS from '../dao/ProductManagerFS.js';
import ProductManagerDB from '../dao/ProductManagerDB.js';

const router = express.Router();

// const PM = new ProductManagerFS(`${__dirname}/../Productos.json`);
const PM = new ProductManagerDB();

router.get('/', async (req, res) => {
    try {
        console.log("Productos obtenidos con exito");
        const products = await PM.getProducts();
        res.render('index', {
            products,
            style: 'index.css'
        });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send('Error al obtener los productos');
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await PM.getProducts();
        res.render('realtimeproducts', {
            products,
            style: 'index.css'
        });
    } catch (error) {
        console.error("Error al obtener productos en tiempo real:", error);
        res.status(500).send('Error al obtener los productos en tiempo real');
    }
});

router.get('/addproduct', (req, res) => {
    res.render('addproduct', {
        style: 'index.css'
    });
});

router.get('/deleteproduct', async (req, res) => {
    res.render('deleteproduct', {
        style: 'index.css'
    });
});

router.get('/chat', async (req,res) => {
    res.render('chat', {
        style: 'chat.css'
    });
})

export default router;