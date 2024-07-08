document.addEventListener('DOMContentLoaded', function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    updateCartCount();

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function () {
                const product = this.closest('.product-item').getAttribute('data-product');
                addToCart(product);
            });
        });
    }

    if (document.querySelector('#cart-items')) {
        updateCartTable();
    }

    if (document.querySelector('.cart-container')) {
        updateCartDisplay();
    }

    function updateCartCount() {
        const cartItems = Object.values(cart).reduce((total, count) => total + count, 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        if (cartCountElements.length > 0) {
            cartCountElements.forEach(element => {
                element.textContent = cartItems;
            });
        }
    }

    function addToCart(product) {
        if (cart[product]) {
            cart[product]++;
        } else {
            cart[product] = 1;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
    }

    function updateCartTable() {
        const cartTableBody = document.querySelector('#cart-items');
        if (!cartTableBody) return;

        cartTableBody.innerHTML = '';

        let totalPrice = 0;
        for (const [product, quantity] of Object.entries(cart)) {
            const price = 1;
            const total = price * quantity;
            totalPrice += total;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product}</td>
                <td>$${price}</td>
                <td>
                    <div class="cart-item-controls">
                        <button class="decrease-quantity" data-product="${product}">-</button>
                        <span>${quantity}</span>
                        <button class="increase-quantity" data-product="${product}">+</button>
                    </div>
                </td>
                <td>$${total}</td>
            `;
            cartTableBody.appendChild(row);
        }

        const totalPriceElement = document.querySelector('.total-price');
        if (totalPriceElement) {
            totalPriceElement.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
        }

        attachQuantityControlEvents();
    }

    function updateCartDisplay() {
        const cartContainer = document.querySelector('.cart-container');
        if (!cartContainer) return;

        cartContainer.innerHTML = ''; // Clear existing items

        const cartItems = Object.keys(cart);
        if (cartItems.length > 0) {
            cartItems.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.textContent = item;

                // Add remove button
                const removeButton = document.createElement('button');
                removeButton.textContent = '-';
                removeButton.classList.add('remove-from-cart');
                removeButton.setAttribute('data-product', item);
                removeButton.addEventListener('click', function () {
                    delete cart[item];
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartDisplay();
                    updateCartCount();
                });

                itemElement.appendChild(removeButton);
                cartContainer.appendChild(itemElement);
            });
        } else {
            cartContainer.textContent = 'Your cart is empty.';
        }
    }

    function attachQuantityControlEvents() {
        const decreaseButtons = document.querySelectorAll('.decrease-quantity');
        if (decreaseButtons.length > 0) {
            decreaseButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const product = this.getAttribute('data-product');
                    if (cart[product] > 1) {
                        cart[product]--;
                    } else {
                        delete cart[product];
                    }
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartTable();
                    updateCartCount();
                });
            });
        }

        const increaseButtons = document.querySelectorAll('.increase-quantity');
        if (increaseButtons.length > 0) {
            increaseButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const product = this.getAttribute('data-product');
                    cart[product]++;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartTable();
                    updateCartCount();
                });
            });
        }
    }
});
document.getElementById('orderButton').addEventListener('click', function() {
    localStorage.setItem('cart', JSON.stringify(cart));
    // Redirect to the admin page
    window.location.href = 'admin.html';
});