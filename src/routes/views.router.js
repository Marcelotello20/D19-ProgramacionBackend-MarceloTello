import express from 'express';
import __dirname from '../utils/utils.js';
// import ProductManagerFS from '../dao/ProductManagerFS.js';
import ProductManagerDB from '../dao/ProductManagerDB.js';
import productModel from '../dao/models/productModel.js';
import CartManagerDB from '../dao/CartManagerDB.js'

const router = express.Router();

// const PM = new ProductManagerFS(`${__dirname}/../Productos.json`);
const PM = new ProductManagerDB();
const CM = new CartManagerDB();

router.get('/', async (req, res) => {
    let { page = 1, limit = 10, sort, query } = req.query;

    if (sort) {
        sort = JSON.parse(sort);
    } else {
        sort = { _id: 'asc' }; 
    }

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sort,
        lean: true 
    };

    const queryOptions = query ? { title: { $regex: query, $options: 'i' } } : {};

    try {
        
        const result = await productModel.paginate(queryOptions, options);

        const baseURL = "http://localhost:8080";
        result.prevLink = result.hasPrevPage ? `${baseURL}?page=${result.prevPage}&limit=${limit}&sort=${JSON.stringify(sort)}` : "";
        result.nextLink = result.hasNextPage ? `${baseURL}?page=${result.nextPage}&limit=${limit}&sort=${JSON.stringify(sort)}` : "";
        result.isValid = !(page <= 0 || page > result.totalPages);

        console.log("Productos obtenidos con éxito");
        res.render('index', {
            products: result.docs,
            style: 'index.css',
            ...result
        });
    } catch (error) {
        console.error("Error al obtener productos");
        res.status(500).send('Error al obtener los productos', error);
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
        console.error("Error al obtener productos en tiempo real");
        res.status(500).send('Error al obtener los productos en tiempo real', error);
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

router.get('/cart/:cid', async (req,res) => {
    let cartId = req.params.cid;

    try{
        let cart = await CM.getCartById(cartId)
        res.render('cart', {
            cart,
            style: 'index.css'
        });
    } catch (error) {
        console.error("Error al obtener el carrito");
        res.status(500).send('Error al obtener el carrito', error);
    }
})

export default router;