import fs from 'fs';

class ProductManagerFS {

    constructor(path) {
        this.path = path;
    }

    async addProduct(product) {

        const products = await this.getProducts();

        // Validar que el código del producto no esté repetido utilizando lo declarado en code
        if (products.some(p => p.code === product.code)) {
            console.error("Ya existe un producto con el mismo código.");
            return;
        }

        //Todos los campos son obligatorios expresion ternaria
        if(!product.title || !product.description || !product.category || !product.price || !product.code || !product.stock) {
            console.error("Todos los campos son obligatorios.");
            return;
        }


        const Product = {
            code: product.code ?? "Sin Nombre",
            title: product.title ?? "Sin titulo",
            description: product.description ?? "Sin Descripción",
            category: product.category ?? "Sin Categoria",
            price: product.price ?? "Sin Precio ",
            thumbnail: product.thumbnail ?? "Sin Imagen",
            stock: product.stock ?? "Agrega un stock válido",
            id: await this.#getId(),
            status: true,
            
        };

        products.push(Product);

        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
            console.log("Producto creado correctamente");
        } catch (e) {
            console.error("Error al crear  el producto \n", e);
        }
        
    }
    
    //Obtener Productos
    async getProducts() {

        const products = await fs.promises.readFile(this.path, "utf-8");

        try {

            return JSON.parse(products);
        } catch (error) {
            console.error("No hay productos");

            return [];
        }
    }
    
    //Id Incrementable con expresion ternaria
    async #getId() {
        try {
            const products = await this.getProducts();
            return products.length === 0 ? 1 : products[products.length - 1].id + 1;
        } catch (error) {
            console.error(error)
            return
        }
        //Si no hay products devuelve 1, si no devuelve el codigo del ultimo product +1

    }

    //Obtener el producto por su Id 
    async getProductById(productId) {
        const products = await this.getProducts();
        const product = await products.find(product => product.id === productId);

        try {
            console.log(`Buscando el producto de id ${productId}`)
            return product;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    //Actualizar producto
    async updateProduct(productId,update) {
        try{
            //Productos
            const products = await this.getProducts();
            
            //Ocupamos el metodo findIndex para el parametro productId , asi elegimos el producto a actualizar
            const i = products.findIndex(product => product.id === productId);

            // Valor predeterminado de findIndex es -1 si no encuentra nada
            if ( i === -1 ) {

                console.error(`No se encontro un producto con el Id : ${productId}`);

            } else {
                // Con desestructuracion creamos un nuevo objeto updatedProduct con dos objetos dentro para la actualizacion 
                const updatedProduct = { ...products[i], ...update };

                products[i] = updatedProduct;

                // Guardar los cambios en el archivo JSON
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));

                console.log(`Producto con el id ${i} fue actualizado correctamente`);
            }
            
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }

    }

    async deleteProduct(productId) {
        try {
            //Productos
            const products = await this.getProducts();

            //Ocupamos el mismo metodo que en updateProduct con findIndex
            const i = products.findIndex(product => product.id === productId);

            if ( i === -1 ) {

                console.error(`No se encontro un producto con el Id : ${productId} , no se elimino nada`);

            } else { 

                //Eliminando el producto del array con el uso de splice, desde el indice se borra solo 1 objeto
                products.splice(i,1)   
                
                // Guardar los cambios en el archivo JSON
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
                console.log("Producto eliminado correctamente");
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error)
        }
    }


}

export default ProductManagerFS;









