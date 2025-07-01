// Wishlist utility functions
function addToWishlist(productData) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to add items to wishlist');
        window.location.href = 'login.html';
        return;
    }

    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    // Check if product already exists in wishlist
    const existingItem = wishlist.find(item => item.id === productData.id);
    if (existingItem) {
        alert('This item is already in your wishlist!');
        return;
    }

    // Add to wishlist
    wishlist.push(productData);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Also update user-specific wishlist if logged in
    const user = localStorage.getItem('user');
    if (user) {
        try {
            const userData = JSON.parse(user);
            const userId = userData.id || userData.email || userData.name || '';
            if (userId) {
                localStorage.setItem('wishlist_' + userId, JSON.stringify(wishlist));
            }
        } catch (e) {}
    }
    
    // Update wishlist icon
    updateWishlistIcon(productData.id, true);
    updateWishlistBadge();
}

function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    wishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Also update user-specific wishlist if logged in
    const user = localStorage.getItem('user');
    if (user) {
        try {
            const userData = JSON.parse(user);
            const userId = userData.id || userData.email || userData.name || '';
            if (userId) {
                localStorage.setItem('wishlist_' + userId, JSON.stringify(wishlist));
            }
        } catch (e) {}
    }
    
    // Update wishlist icon
    updateWishlistIcon(productId, false);
    updateWishlistBadge();
    
    // If we're on the wishlist page, reload it
    if (window.location.pathname.includes('wishlist.html') && typeof loadWishlist === 'function') {
        loadWishlist();
    }
}

function getWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return wishlist.length;
}

function updateWishlistBadge() {
    const wishlistCount = getWishlistCount();
    console.log('updateWishlistBadge called, wishlist count:', wishlistCount);
    
    // Target the wishlist icon in the top navigation - using more specific selector
    const wishlistIcons = document.querySelectorAll('#navbar a[href="wishlist.html"] .fa-heart-o, #navbar a[href="wishlist.html"] .fa-heart');
    console.log('Found wishlist icons:', wishlistIcons.length);
    
    wishlistIcons.forEach(icon => {
        // Remove existing wishlist count badge
        const existingBadge = icon.parentElement.querySelector('.wishlist-badge');
        if (existingBadge) {
            existingBadge.remove();
            console.log('Removed existing wishlist badge');
        }
        
        // Add new badge if there are items
        if (wishlistCount > 0) {
            const badge = document.createElement('span');
            badge.className = 'wishlist-badge';
            badge.textContent = wishlistCount;
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
            console.log('Added new wishlist badge with count:', wishlistCount);
        }
    });
}

function updateWishlistIcon(productId, isInWishlist) {
    const wishlistIcons = document.querySelectorAll(`[data-product-id="${productId}"]`);
    wishlistIcons.forEach(icon => {
        if (isInWishlist) {
            icon.classList.remove('fa-heart-o');
            icon.classList.add('fa-heart');
            icon.style.color = '#e63946';
        } else {
            icon.classList.remove('fa-heart');
            icon.classList.add('fa-heart-o');
            icon.style.color = '';
        }
    });
}

function checkWishlistStatus(productId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const isInWishlist = wishlist.some(item => item.id === productId);
    updateWishlistIcon(productId, isInWishlist);
    return isInWishlist;
}

function initializeWishlistIcons() {
    const wishlistIcons = document.querySelectorAll('.wishlist');
    wishlistIcons.forEach(icon => {
        const productId = icon.getAttribute('data-product-id');
        if (productId) {
            checkWishlistStatus(productId);
        }
    });
    updateWishlistBadge();
}

// New function to handle wishlist toggle with event prevention
function handleWishlistToggle(event, productId) {
    event.preventDefault(); // Prevent the default link behavior
    event.stopPropagation(); // Stop event bubbling
    
    const isInWishlist = checkWishlistStatus(productId);
    
    if (isInWishlist) {
        removeFromWishlist(productId);
    } else {
        // Get product data based on productId
        const productData = getProductData(productId);
        if (productData) {
            addToWishlist(productData);
        }
    }
}

// New function to move item from wishlist to cart
function moveToCart(productId) {
    console.log('moveToCart called with productId:', productId);
    
    // Get product data from wishlist
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    console.log('Current wishlist:', wishlist);
    
    const productData = wishlist.find(item => item.id === productId);
    console.log('Found product data:', productData);
    
    if (productData) {
        console.log('Adding to cart...');
        
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to add items to cart');
            window.location.href = 'login.html';
            return;
        }
        
        // Ensure product data has all required fields
        const cartProductData = {
            id: productData.id,
            name: productData.name,
            brand: productData.brand || 'Unknown',
            price: productData.price,
            image: productData.image,
            category: productData.category || 'General',
            link: productData.link || '#'
        };
        
        console.log('Processed product data for cart:', cartProductData);
        
        // Add to cart using the cart utility function
        addToCart(cartProductData);
        
        console.log('Removing from wishlist...');
        // Remove from wishlist
        removeFromWishlist(productId);
        
        console.log('Updating wishlist badge...');
        // Update wishlist badge after removal
        updateWishlistBadge();
        
        console.log('Move to cart completed successfully');
        
        // Debug: Check final state
        const finalCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const finalWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        console.log('Final cart state:', finalCart);
        console.log('Final wishlist state:', finalWishlist);
    } else {
        console.log('Product not found in wishlist');
    }
}

// Debug function to check current state - call this from browser console
function debugState() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const token = localStorage.getItem('token');
    
    console.log('=== DEBUG STATE ===');
    console.log('Token exists:', !!token);
    console.log('Cart items:', cart.length);
    console.log('Wishlist items:', wishlist.length);
    console.log('Cart details:', cart);
    console.log('Wishlist details:', wishlist);
    console.log('==================');
}

function clearWishlist() {
    localStorage.removeItem('wishlist');
    // Also remove user-specific wishlist if logged in
    const user = localStorage.getItem('user');
    if (user) {
        try {
            const userData = JSON.parse(user);
            const userId = userData.id || userData.email || userData.name || '';
            if (userId) {
                localStorage.removeItem('wishlist_' + userId);
            }
        } catch (e) {}
    }
    updateWishlistBadge();
} 