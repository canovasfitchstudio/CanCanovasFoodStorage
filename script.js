document.addEventListener('DOMContentLoaded', () => {
    const addItemForm = document.getElementById('addItemForm');
    const stockList = document.getElementById('stockList');

    let stockItems = JSON.parse(localStorage.getItem('stockItems')) || [];

    function renderStockList() {
        stockList.innerHTML = '';
        
        stockItems.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        if (stockItems.length === 0) {
            stockList.innerHTML = '<p style="text-align:center;">No hay productos en tu stock.</p>';
        }

        stockItems.forEach((item, index) => {
            const listItem = document.createElement('li');
            
            const isDue = new Date(item.dueDate) < new Date();
            if (isDue) {
                listItem.style.backgroundColor = '#f2dede';
            }

            listItem.innerHTML = `
                <div class="item-details">
                    <strong>${item.name}</strong> - Cantidad: ${item.quantity}
                    <br>
                    Caduca el: ${item.dueDate}
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

    function saveStockItems() {
        localStorage.setItem('stockItems', JSON.stringify(stockItems));
    }

    addItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const itemName = document.getElementById('itemName').value;
        const itemQuantity = parseInt(document.getElementById('itemQuantity').value);
        const itemDueDate = document.getElementById('itemDueDate').value;

        const existingItemIndex = stockItems.findIndex(item => item.name.toLowerCase() === itemName.toLowerCase());
        
        if (existingItemIndex > -1) {
            const existingItem = stockItems[existingItemIndex];
            existingItem.quantity += itemQuantity;
            
            const newItemDate = new Date(itemDueDate);
            const existingItemDate = new Date(existingItem.dueDate);
            if (newItemDate < existingItemDate) {
                existingItem.dueDate = itemDueDate;
            }
        } else {
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

    stockList.addEventListener('click', (e) => {
        const index = e.target.dataset.index;

        if (!index) return;

        if (e.target.classList.contains('add-one-btn')) {
            stockItems[index].quantity++;
        } else if (e.target.classList.contains('remove-one-btn')) {
            if (stockItems[index].quantity > 1) {
                stockItems[index].quantity--;
            } else {
                stockItems.splice(index, 1);
            }
        } else if (e.target.classList.contains('delete-button')) {
            stockItems.splice(index, 1);
        }

        renderStockList();
    });

    renderStockList();
});
