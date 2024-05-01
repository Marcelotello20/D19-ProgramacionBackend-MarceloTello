document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.dataset.productId;
            try {
                const response = await fetch(`/api/add-to-cart/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ quantity: 1 }) 
                });

                if (response.ok) {
                    console.log('Producto agregado al carrito exitosamente');
                    
                   
                } else {
                    console.error('Error al agregar el producto al carrito');
                    
                }
            } catch (error) {
                console.error('Error de red:', error);
                // Maneja el error de red si es necesario
            }
        });
    });
});
