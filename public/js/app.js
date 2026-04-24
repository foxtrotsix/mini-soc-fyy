/**
 * GourmetHub Frontend Logic
 * Handles API integration, cart management, and UI updates.
 */

const API_BASE = 'https://www.themealdb.com/api/json/v1/1';
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// DOM Elements
const foodGrid = document.getElementById('foodGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartToggle = document.getElementById('cartToggle');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalDisplay = document.getElementById('cartTotal');
const cartCountDisplay = document.getElementById('cartCount');
const categoryList = document.getElementById('categoryList');
const checkoutBtn = document.getElementById('checkoutBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (foodGrid) {
        loadCategories();
        loadMeals('Seafood'); // Default category
        updateCartUI();
    }

    if (cartToggle) {
        cartToggle.onclick = () => cartSidebar.classList.add('open');
    }

    if (closeCart) {
        closeCart.onclick = () => cartSidebar.classList.remove('open');
    }

    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            if (cart.length > 0) {
                window.location.href = 'payment.html';
            } else {
                alert('Your selection is empty.');
            }
        };
    }
});

/**
 * Fetch and display food categories
 */
async function loadCategories() {
    try {
        const res = await fetch(`${API_BASE}/categories.php`);
        const data = await res.json();
        
        if (categoryList) {
            categoryList.innerHTML = data.categories.slice(0, 8).map(cat => `
                <button class="btn glass ${cat.strCategory === 'Seafood' ? 'active' : ''}" style="white-space: nowrap;" 
                        onclick="loadMeals('${cat.strCategory}', this)">
                    ${cat.strCategory}
                </button>
            `).join('');
        }
    } catch (err) {
        console.error('Error loading categories:', err);
    }
}

/**
 * Fetch and display meals by category
 */
async function loadMeals(category, btn = null) {
    if (btn) {
        // Update active button state
        document.querySelectorAll('#categoryList button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }

    if (foodGrid) {
        foodGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 50px;"><p>Loading exquisite cuisines...</p></div>';
        try {
            const res = await fetch(`${API_BASE}/filter.php?c=${category}`);
            const data = await res.json();
            
            foodGrid.innerHTML = data.meals.map(meal => `
                <div class="food-card glass">
                    <img src="${meal.strMealThumb}" class="food-img" alt="${meal.strMeal}">
                    <div class="food-info">
                        <span class="food-cat">${category}</span>
                        <h3 class="food-title">${meal.strMeal}</h3>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 700; color: var(--primary);">$${(Math.random() * 20 + 10).toFixed(2)}</span>
                             <button class="btn btn-primary" style="padding: 8px 15px; font-size: 0.7rem;" 
                                    onclick="addToCart('${meal.idMeal}', '${meal.strMeal.replace(/'/g, "\\'")}', '${meal.strMealThumb}')">
                                Add to selection
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        } catch (err) {
            foodGrid.innerHTML = '<p>Error loading menu. Please try again.</p>';
        }
    }
}

/**
 * Add item to cart
 */
function addToCart(id, name, img) {
    const price = 19.99; // Constant price for demo
    const existing = cart.find(i => i.id === id);
    
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ id, name, img, price, qty: 1 });
    }
    
    saveCart();
    updateCartUI();
    
    // Feedback
    cartSidebar.classList.add('open');
}

/**
 * Remove item from cart
 */
function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateCartUI();
}

/**
 * Update Cart UI
 */
function updateCartUI() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.img}" class="cart-item-img">
            <div style="flex: 1;">
                <h4 style="font-size: 0.9rem; margin-bottom: 5px;">${item.name}</h4>
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-dim);">
                    <span>$${item.price.toFixed(2)} x ${item.qty}</span>
                    <i class="fas fa-trash" style="cursor: pointer; color: var(--accent);" onclick="removeFromCart('${item.id}')"></i>
                </div>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    cartTotalDisplay.textContent = `$${total.toFixed(2)}`;
    cartCountDisplay.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}
