import productModel from './models/productModel.js';

class ProductManagerDB {

    async addProduct(product) {

        const {title, description, code, price, stock, category, thumbnails} = product;

        // //Todos los campos son obligatorios expresion ternaria
        // if(!product.title || !product.description || !product.category || !product.price || !product.code || !product.stock) {
        //     console.error("Todos los campos son obligatorios.");
        // }


        try {
            const result = await productModel.create({title, description, code, price, stock, category, thumbnails: thumbnails ?? []});
            return result
            console.log("Producto creado correctamente"); 
        } catch (e) {
            console.error("Error al crear  el producto \n", e);
        }
        
    }
    
    //Obtener Productos
    async getProducts() {
        try {
            let response = await productModel.find().explain('executionStats');
            console.log(response)
            
            return await productModel.find().lean();
        } catch (error) {
            console.error(error.message);
            throw new Error("Error al buscar los productos")
        }
    }
    
    //Obtener el producto por su Id 
    async getProductById(productId) {
        const product = await productModel.findOne({_id: productId});

        if (!product) throw new Error(`El producto ${productId} no existe`)

        return product;
    }

    //Actualizar producto
    async updateProduct(productId,update) {
        try{
            const result = await productModel.updateOne({_id: productId}, update);

            return result;
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }

    }

    async deleteProduct(productId) {
        try {
            //Productos
            const result = await productModel.deleteOne({_id: productId});
                   
            console.log("Producto eliminado correctamente");
            if (result.deletedCount === 0) throw new Error(`El producto ${productoId} no existe`)
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error al eliminar el producto ${productId}`)
        }
    }


}

export default ProductManagerDB;






