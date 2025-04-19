// Medicine data
const medicines = [
    {
        id: 1,
        name: "Paracetamol",
        category: "fever",
        price: 9.99,
        originalPrice: 12.99,
        image: "images/med1.jpg",
        description: "Effective pain and fever relief",
        discount: "20% OFF"
    },
    {
        id: 2,
        name: "Cough Syrup",
        category: "cold",
        price: 14.99,
        originalPrice: 17.99,
        image: "images/med2.jpg",
        description: "Relief from cough and cold symptoms",
        discount: "15% OFF"
    },
    {
        id: 3,
        name: "Diabetes Control",
        category: "diabetes",
        price: 29.99,
        originalPrice: 34.99,
        image: "images/med3.jpg",
        description: "Blood sugar management medicine",
        discount: "10% OFF"
    },
    {
        id: 4,
        name: "Heart Health Plus",
        category: "heart",
        price: 39.99,
        originalPrice: 44.99,
        image: "images/med4.jpg",
        description: "Supports cardiovascular health",
        discount: "12% OFF"
    },
    {
        id: 5,
        name: "Multivitamin Complex",
        category: "vitamins",
        price: 19.99,
        originalPrice: 24.99,
        image: "images/med5.jpg",
        description: "Complete daily vitamin supplement",
        discount: "25% OFF"
    }
];

// Shopping cart
let cart = [];
let currentSort = { field: null, ascending: true };

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(medicines);
    updateCartCount();
});

// Display products
function displayProducts(products) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'col-md-4 col-lg-3';
        card.innerHTML = `
            <div class="card product-card h-100">
                <div class="position-absolute top-0 end-0 m-2">
                    <span class="badge bg-danger">${product.discount}</span>
                </div>
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted small">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <div>
                            <span class="text-primary fw-bold">$${product.price}</span>
                            <small class="text-muted text-decoration-line-through ms-2">$${product.originalPrice}</small>
                        </div>
                        <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Filter and search
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;

    let filtered = medicines.filter(medicine => {
        const matchesSearch = medicine.name.toLowerCase().includes(searchTerm) ||
                            medicine.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || medicine.category === category;
        return matchesSearch && matchesCategory;
    });

    if (currentSort.field) {
        sortProducts(currentSort.field);
    } else {
        displayProducts(filtered);
    }
}

// Sort products
function sortProducts(field) {
    if (currentSort.field === field) {
        currentSort.ascending = !currentSort.ascending;
    } else {
        currentSort.field = field;
        currentSort.ascending = true;
    }

    let sorted = [...medicines].sort((a, b) => {
        let comparison = 0;
        if (field === 'price') {
            comparison = a.price - b.price;
        } else if (field === 'name') {
            comparison = a.name.localeCompare(b.name);
        }
        return currentSort.ascending ? comparison : -comparison;
    });

    displayProducts(sorted);
}

// Shopping cart functions
function addToCart(productId) {
    const product = medicines.find(m => m.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    showToast(`Added ${product.name} to cart`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, item.quantity + delta);
        updateCart();
    }
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('cartSubtotal');
    const totalElement = document.getElementById('cartTotal');
    
    cartItems.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        cartItems.innerHTML += `
            <div class="cart-item mb-3">
                <div class="d-flex align-items-center">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image me-3">
                    <div class="flex-grow-1">
                        <h6 class="mb-0">${item.name}</h6>
                        <p class="text-muted mb-0">$${item.price}</p>
                        <div class="quantity-controls mt-2">
                            <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <button class="btn btn-link text-danger" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-muted my-4">Your cart is empty</p>';
    }

    const total = subtotal + 5; // Adding $5 delivery fee
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

function toggleCart() {
    const cartOffcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));
    cartOffcanvas.show();
}

function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty', 'warning');
        return;
    }
    showToast('Proceeding to checkout...', 'success');
    // Add checkout logic here
}

// Toast notifications
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(container);
    return container;
}
