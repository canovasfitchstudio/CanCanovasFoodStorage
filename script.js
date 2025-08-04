document.addEventListener('DOMContentLoaded', () => {
    const addItemForm = document.getElementById('addItemForm');
    const stockList = document.getElementById('stockList');

    let stockItems = JSON.parse(localStorage.getItem('stockItems')) || [];

    // Función para renderizar la lista de stock
    function renderStockList() {
        stockList.innerHTML = ''; // Limpiar la lista antes de volver a renderizar
        
        // Ordenar los productos por fecha de vencimiento
        stockItems.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        if (stockItems.length === 0) {
            stockList.innerHTML = '<p style="text-align:center;">No hay productos en tu stock.</p>';
        }

        stockItems.forEach((item, index) => {
            const listItem = document.createElement('li');
            
            // Revisa si la fecha de vencimiento ya pasó
            const isDue = new Date(item.dueDate) < new Date();
            if (isDue) {
                listItem.style.backgroundColor = '#f2dede'; // Rojo claro para items vencidos
            }

            listItem.innerHTML = `
                <div class="item-details">
                    <strong>${item.name}</strong> - Cantidad: ${item.quantity}
                    <br>
                    Fecha de Vencimiento: ${item.dueDate}
                </div>
                <div class="item-quantity-controls">
                    <button class="add-one-btn" data-index="${index}">+1</button>
                    <button class="remove-one-btn" data-index="${index}">-1</button>
                </div>
                <button class="delete-button" data-index="${index}">Eliminar</button>
            `;
            stockList.appendChild(listItem);
        });
        saveStockItems();
    }

    // Función para guardar los productos en el local storage
    function saveStockItems() {
        localStorage.setItem('stockItems', JSON.stringify(stockItems));
    }

    // Manejar el envío del formulario para añadir un nuevo producto
    addItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const itemName = document.getElementById('itemName').value;
        const itemQuantity = parseInt(document.getElementById('itemQuantity').value);
        const itemDueDate = document.getElementById('itemDueDate').value;

        const existingItemIndex = stockItems.findIndex(item => item.name.toLowerCase() === itemName.toLowerCase());
        
        if (existingItemIndex > -1) {
            // Si el producto ya existe, actualiza la cantidad
            stockItems[existingItemIndex].quantity += itemQuantity;
        } else {
            // Si no existe, añade un nuevo producto
            const newItem = {
                name: itemName,
                quantity: itemQuantity,
                dueDate: itemDueDate
            };
            stockItems.push(newItem);
        }

        addItemForm.reset();
        renderStockList();
    });

    // Manejar los clics para añadir uno, quitar uno o eliminar un producto
    stockList.addEventListener('click', (e) => {
        const index = e.target.dataset.index;

        if (!index) return; // Asegurarse de que se hizo clic en un botón

        if (e.target.classList.contains('add-one-btn')) {
            stockItems[index].quantity++;
        } else if (e.target.classList.contains('remove-one-btn')) {
            if (stockItems[index].quantity > 1) {
                stockItems[index].quantity--;
            } else {
                stockItems.splice(index, 1); // Elimina el producto si la cantidad es 1 y se quita uno más
            }
        } else if (e.target.classList.contains('delete-button')) {
            stockItems.splice(index, 1); // Elimina el producto por completo
        }

        renderStockList();
    });

    // Renderizar la lista al cargar la página
    renderStockList();
});
