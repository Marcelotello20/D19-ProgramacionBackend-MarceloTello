document.addEventListener('DOMContentLoaded', async () => {
    const cartId = getCartIdURL();
    const cartContainer = document.querySelector('.container');

    try {
        const response = await fetch(`/api/carts/${cartId}`);
        if (!response.ok) {
            throw new Error('Error al obtener el carrito');
        }

        const cart = await response.json();

        if (cart && cart.products.length > 0) {
            const productList = document.createElement('ul');
            cart.products.forEach(product => {
                const listItem = document.createElement('li');
                listItem.textContent = `${product.product.title}: ${product.quantity}`;
                productList.appendChild(listItem);
            });
            cartContainer.appendChild(productList);
        } 
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
    }
});

function getCartIdURL() {
    const url = window.location.href; //referencia del url
    const parts = url.split('/'); //Divide en los /
    return parts[parts.length - 1]; // Devuelve la última parte de la URL, que debería ser el cartId
}