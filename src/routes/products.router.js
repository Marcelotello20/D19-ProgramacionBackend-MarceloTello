import express from 'express';
import __dirname from '../utils/utils.js';
// import ProductManagerFS from '../dao/ProductManagerFS.js';
import ProductManagerDB from '../dao/ProductManagerDB.js';

const router = express.Router();
const productsRouter = router;

//const PM = new ProductManager(`${__dirname}/Productos.json`);
const PM = new ProductManagerDB();

// Endpoint para buscar los productos
router.get('/', async (req, res) => {
    try {
        
        const { limit = 10, page, sort, query } = req.query;
        
        const products = await PM.getProducts({ limit, page, sort, query });

        const response = {
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage || null,
            nextPage: products.nextPage || null,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.prevPage ? `/api/products?limit=${limit}&page=${products.prevPage}` : null,
            nextLink: products.nextPage ? `/api/products?limit=${limit}&page=${products.nextPage}` : null,
        };

        res.json(response);
    } catch (e) {
        console.error("Error al obtener los productos")
        res.status(500).send(`Error al obtener los producto`,e)
    }
});

// Endpoint con el productId para buscar uno especifico 
router.get('/:id', async (req, res) => {
    //FS
    // const productId = +req.params.id;
    //DB
    const productId = req.params.id;

    try{
        let product = await PM.getProductById(productId);

        if (!product) {
            console.error("No se encontró el producto solicitado");
            return res.status(404).json({
                error: `No se encontró el producto con ID ${productId}`
            });
        }

        res.json(product);

    } catch (e) {
        console.error("Error al obtener el producto por Id")
        res.status(500).send(`Error al obtener el producto`,e)
    }

    
});

// Agregar un nuevo producto
router.post('/', async (req, res) => {

    const product = req.body;

    try {
        await PM.addProduct(product);
        res.status(201).send('Producto creado correctamente');
    } catch (error) {
        console.error("Error al crear el producto:", error);
        res.status(500).send('Error al crear el producto');
    }
});

// Actualizar un producto por su id
router.put('/:id', async (req, res) => {
    //FS
    // const productId = +req.params.id;

    //DB
    const productId = req.params.id;

    const update = req.body;

    try {
        await PM.updateProduct(productId, update);
        res.send('Producto actualizado correctamente');
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).send('Error al actualizar el producto');
    }
});

// Eliminar un producto por su id
router.delete('/:id', async (req, res) => {
    //FS
    // const productId = +req.params.id;
    //DB
    const productId = req.params.id;
    
    try {
        await PM.deleteProduct(productId);
        res.send('Producto eliminado correctamente');
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).send('Error al eliminar el producto');
    }
});

// Endpoint para eliminar un producto por su id combinandolo con un form en HTML y en views.router( DELETE NO EXISTE EN HTML )
router.post('/deleteproduct', async (req, res) => {
    //FS
    // const productId = +req.body.productId;
    
    //DB
    const productId = req.body.productId;

    try {
        await PM.deleteProduct(productId);
        res.send('Producto eliminado correctamente');
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).send('Error al eliminar el producto');
    }
});

export default productsRouter;

