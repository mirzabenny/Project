// Cart utility functions
function addToCart(productData, size = 'M', color = 'Default', quantity = 1) {
    console.log('addToCart called with:', productData, size, color, quantity);
    
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to add items to cart');
        window.location.href = 'login.html';
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    console.log('Current cart before adding:', cart);
    
    // Check if product already exists in cart with same size and color
    const existingItemIndex = cart.findIndex(item => 
        item.id === productData.id && 
        item.size === size && 
        item.color === color
    );

    if (existingItemIndex !== -1) {
        // Update quantity if item already exists
        cart[existingItemIndex].quantity += quantity;
        console.log('Updated existing item quantity');
    } else {
        // Add new item to cart
        const cartItem = {
            ...productData,
            size: size,
            color: color,
            quantity: quantity,
            addedAt: new Date().toISOString()
        };
        cart.push(cartItem);
        console.log('Added new item to cart:', cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    // Also update user-specific cart if logged in
    const user = localStorage.getItem('user');
    if (user) {
        try {
            const userData = JSON.parse(user);
            const userId = userData.id || userData.email || userData.name || '';
            if (userId) {
                localStorage.setItem('cart_' + userId, JSON.stringify(cart));
            }
        } catch (e) {}
    }
    console.log('Updated cart in localStorage:', cart);
    updateCartIcon();
    console.log('Cart icon updated');
}

function removeFromCart(productId, size, color) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter(item => 
        !(item.id === productId && item.size === size && item.color === color)
    );
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
    
    // Reload cart page if we're on it
    if (window.location.pathname.includes('cart.html')) {
        loadCart();
    }
}

function updateCartItemQuantity(productId, size, color, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId, size, color);
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const itemIndex = cart.findIndex(item => 
        item.id === productId && item.size === size && item.color === color
    );
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartIcon();
        
        // Reload cart page if we're on it
        if (window.location.pathname.includes('cart.html')) {
            loadCart();
        }
    }
}

function getCartTotal() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
        return total + (price * item.quantity);
    }, 0);
}

function getCartItemCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart.reduce((count, item) => count + item.quantity, 0);
}

function updateCartIcon() {
    const cartCount = getCartItemCount();
    console.log('updateCartIcon called, cart count:', cartCount);
    
    // Target the cart icon in the top navigation - using the correct class
    const cartIcons = document.querySelectorAll('#navbar a[href="cart.html"] .fa-shopping-bag');
    console.log('Found cart icons:', cartIcons.length);
    
    cartIcons.forEach(icon => {
        // Remove existing cart count badge
        const existingBadge = icon.parentElement.querySelector('.cart-badge');
        if (existingBadge) {
            existingBadge.remove();
            console.log('Removed existing cart badge');
        }
        
        // Add new badge if there are items
        if (cartCount > 0) {
            const badge = document.createElement('span');
            badge.className = 'cart-badge';
            badge.textContent = cartCount;
            badge.style.cssText = `
                position: absolute;
                top: -8px;
                right: -8px;
                background: #e63946;
                color: white;
                border-radius: 50%;
                width: 18px;
                height: 18px;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                z-index: 10;
            `;
            icon.parentElement.style.position = 'relative';
            icon.parentElement.appendChild(badge);
            console.log('Added new cart badge with count:', cartCount);
        }
    });
}

function loadCart() {
    const cartContainer = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartContainer) return;
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cart.length === 0) {
        cartContainer.style.display = 'none';
        emptyCart.style.display = 'block';
        if (cartTotal) cartTotal.textContent = '₹0';
    } else {
        cartContainer.style.display = 'block';
        emptyCart.style.display = 'none';
        
        cartContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="brand">${item.brand}</p>
                    <p class="price">${item.price}</p>
                    
                    <div class="cart-item-options">
                        <div class="option-group">
                            <label>Size:</label>
                            <select onchange="updateCartItemSize('${item.id}', '${item.size}', '${item.color}', this.value)">
                                <option value="XS" ${item.size === 'XS' ? 'selected' : ''}>XS</option>
                                <option value="S" ${item.size === 'S' ? 'selected' : ''}>S</option>
                                <option value="M" ${item.size === 'M' ? 'selected' : ''}>M</option>
                                <option value="L" ${item.size === 'L' ? 'selected' : ''}>L</option>
                                <option value="XL" ${item.size === 'XL' ? 'selected' : ''}>XL</option>
                                <option value="XXL" ${item.size === 'XXL' ? 'selected' : ''}>XXL</option>
                            </select>
                        </div>
                        
                        <div class="option-group">
                            <label>Color:</label>
                            <select onchange="updateCartItemColor('${item.id}', '${item.size}', '${item.color}', this.value)">
                                <option value="Default" ${item.color === 'Default' ? 'selected' : ''}>Default</option>
                                <option value="Black" ${item.color === 'Black' ? 'selected' : ''}>Black</option>
                                <option value="White" ${item.color === 'White' ? 'selected' : ''}>White</option>
                                <option value="Blue" ${item.color === 'Blue' ? 'selected' : ''}>Blue</option>
                                <option value="Red" ${item.color === 'Red' ? 'selected' : ''}>Red</option>
                                <option value="Green" ${item.color === 'Green' ? 'selected' : ''}>Green</option>
                            </select>
                        </div>
                        
                        <div class="option-group">
                            <label>Quantity:</label>
                            <div class="quantity-controls">
                                <button onclick="updateCartItemQuantity('${item.id}', '${item.size}', '${item.color}', ${item.quantity - 1})">-</button>
                                <span>${item.quantity}</span>
                                <button onclick="updateCartItemQuantity('${item.id}', '${item.size}', '${item.color}', ${item.quantity + 1})">+</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-btn" onclick="removeFromCart('${item.id}', '${item.size}', '${item.color}')">
                        <i class="fa fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `).join('');
        
        if (cartTotal) {
            const total = getCartTotal();
            cartTotal.textContent = `₹${total.toFixed(2)}`;
        }
    }
}

function updateCartItemSize(productId, oldSize, color, newSize) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const itemIndex = cart.findIndex(item => 
        item.id === productId && item.size === oldSize && item.color === color
    );
    
    if (itemIndex !== -1) {
        cart[itemIndex].size = newSize;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

function updateCartItemColor(productId, size, oldColor, newColor) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const itemIndex = cart.findIndex(item => 
        item.id === productId && item.size === size && item.color === oldColor
    );
    
    if (itemIndex !== -1) {
        cart[itemIndex].color = newColor;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

function clearCart() {
    // Set cart to empty array (triggers storage event everywhere)
    localStorage.setItem('cart', JSON.stringify([]));
    // Also remove user-specific cart if logged in
    const user = localStorage.getItem('user');
    if (user) {
        try {
            const userData = JSON.parse(user);
            const userId = userData.id || userData.email || userData.name || '';
            if (userId) {
                localStorage.setItem('cart_' + userId, JSON.stringify([]));
            }
        } catch (e) {}
    }
    updateCartIcon();
    if (window.location.pathname.includes('cart.html')) {
        loadCart();
    }
}

function handleCartClick(event, productId) {
    event.preventDefault();
    event.stopPropagation();
    // Get product data based on productId
    const productData = getProductData(productId);
    if (productData) {
        // Show size and color selection modal
        showCartOptionsModal(productData);
    }
}

function showCartOptionsModal(productData) {
    // Create modal HTML
    const modalHTML = `
        <div id="cart-modal" class="cart-modal">
            <div class="cart-modal-content">
                <span class="close-modal" onclick="closeCartModal()">&times;</span>
                <h3>Add to Cart</h3>
                <div class="product-info">
                    <img src="${productData.image}" alt="${productData.name}">
                    <div>
                        <h4>${productData.name}</h4>
                        <p>${productData.brand}</p>
                        <p class="price">${productData.price}</p>
                    </div>
                </div>
                
                <div class="options-form">
                    <div class="option-group">
                        <label>Size:</label>
                        <select id="cart-size-select">
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M" selected>M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                        </select>
                    </div>
                    
                    <div class="option-group">
                        <label>Color:</label>
                        <select id="cart-color-select">
                            <option value="Black" selected>Black</option>
                            <option value="White">White</option>
                            <option value="Blue">Blue</option>
                            <option value="Red">Red</option>
                            <option value="Green">Green</option>
                        </select>
                    </div>
                    
                    <div class="option-group">
                        <label>Quantity:</label>
                        <div class="quantity-controls">
                            <button onclick="updateModalQuantity(-1)">-</button>
                            <span id="modal-quantity">1</span>
                            <button onclick="updateModalQuantity(1)">+</button>
                        </div>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button onclick="addToCartFromModal('${productData.id}')" class="add-to-cart-btn">Add to Cart</button>
                    <button onclick="closeCartModal()" class="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add modal styles if not already present
    if (!document.getElementById('cart-modal-styles')) {
        const styles = `
            <style id="cart-modal-styles">
                .cart-modal {
                    display: block;
                    position: fixed;
                    z-index: 1000;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,0.5);
                }
                
                .cart-modal-content {
                    background-color: white;
                    margin: 15% auto;
                    padding: 20px;
                    border-radius: 10px;
                    width: 80%;
                    max-width: 500px;
                    position: relative;
                }
                
                .close-modal {
                    color: #aaa;
                    float: right;
                    font-size: 28px;
                    font-weight: bold;
                    cursor: pointer;
                }
                
                .close-modal:hover {
                    color: #000;
                }
                
                .product-info {
                    display: flex;
                    gap: 15px;
                    margin: 20px 0;
                }
                
                .product-info img {
                    width: 80px;
                    height: 80px;
                    object-fit: cover;
                    border-radius: 5px;
                }
                
                .options-form {
                    margin: 20px 0;
                }
                
                .option-group {
                    margin: 15px 0;
                }
                
                .option-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                }
                
                .option-group select {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }
                
                .quantity-controls {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .quantity-controls button {
                    width: 30px;
                    height: 30px;
                    border: 1px solid #ddd;
                    background: white;
                    cursor: pointer;
                }
                
                .modal-actions {
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                    margin-top: 20px;
                }
                
                .add-to-cart-btn {
                    background: #1723cd;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                }
                
                .cancel-btn {
                    background: #ddd;
                    color: #333;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }
}

function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.remove();
    }
}

function updateModalQuantity(change) {
    const quantitySpan = document.getElementById('modal-quantity');
    let currentQuantity = parseInt(quantitySpan.textContent);
    currentQuantity = Math.max(1, currentQuantity + change);
    quantitySpan.textContent = currentQuantity;
}

function addToCartFromModal(productId) {
    const size = document.getElementById('cart-size-select').value;
    const color = document.getElementById('cart-color-select').value;
    const quantity = parseInt(document.getElementById('modal-quantity').textContent);
    
    const productData = getProductData(productId);
    if (productData) {
        addToCart(productData, size, color, quantity);
        closeCartModal();
    }
}

// Initialize cart icon on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartIcon();
}); 