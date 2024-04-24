import cartModel from "./models/cartModel.js";
import ProductManagerDB from "./ProductManagerDB.js";

const PM = new ProductManagerDB();

class CartManagerDB {

    async createCart() {
        try {
            const result = await cartModel.create({ products: [] });  // Crear un nuevo carrito sin productos inicialmente
            console.log("Nuevo carrito creado");
            return result;
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            return null;
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                console.error(`No se encontró el carrito con ID ${cartId}`);
                return;
            }
    
            const product = await PM.getProductById(productId);
            if (!product) {
                console.error(`No se encontró el producto con ID ${productId}`);
                return;
            }
    
            // Verificar si el producto ya está en el carrito
            const productInCart = cart.products.find(item => item.product.equals(productId));
    
            if (productInCart) {
                productInCart.quantity += quantity;
            } else {
                cart.products.push({ product: product._id, quantity });  // Aquí usamos el ObjectId del producto
            }
    
            await cart.save();  // Guardar el carrito actualizado
    
            console.log("Producto agregado al carrito");
        } catch (error) {
            console.error("Error al agregar el producto al carrito", error);
        }
    }

    async getCarts() {
        try {
            return await cartModel.find().lean(); 
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            return [];
        }
    }

    async getCartById(cartId) {
        try {
            console.log(`Buscando el carrito con id ${cartId}`);
            const cart = await cartModel.findOne({_id: cartId}).populate('products.product');
            if (!cart) {
                console.error("No se encontro este carrito");
                return null;
            }
            return cart;
        } catch (error) {
            console.error('No se pudo encontrar el carrito con el id solicitado', error);
            return null;
        }
    }

    async deleteCart(cartId) {
        try {

            const result = await cartModel.deleteOne({ _id: cartId });
            console.log("Carrito eliminado correctamente");
            if (result.deletedCount === 0) throw new Error(`El carrito ${cartId} no existe`);
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error al eliminar el carrito ${cartId}`);
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                console.error(`No se encontró el carrito con ID ${cartId}`);
                return;
            }
    
            cart.products = cart.products.filter(item => !item.product.equals(productId));
    
            await cart.save();  // Guardar el carrito actualizado
    
            console.log("Producto eliminado del carrito");
        } catch (error) {
            console.error("Error al eliminar el producto del carrito", error);
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                console.error(`No se encontró el carrito con ID ${cartId}`);
                return;
            }
    
            const productInCart = cart.products.find(item => item.product.equals(productId));
    
            if (productInCart) {
                productInCart.quantity = quantity;
            }
    
            await cart.save();  // Guardar el carrito actualizado
    
            console.log("Cantidad de producto actualizada en el carrito");
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito", error);
        }
    }
}

export default CartManagerDB;