// Payment System Class
class PaymentSystem {
    constructor() {
        this.cart = [];
        this.total = 0;
        this.setupEventListeners();
    }

    // Add item to cart
    addToCart(item) {
        this.cart.push(item);
        this.updateCart();
        this.calculateTotal();
    }

    // Remove item from cart
    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.updateCart();
        this.calculateTotal();
    }

    // Update cart display
    updateCart() {
        const cartContainer = document.querySelector('.cart-items');
        if (!cartContainer) return;

        cartContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>₹${item.price}</p>
                </div>
                <button onclick="paymentSystem.removeFromCart('${item.id}')" class="remove-item">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    // Calculate total amount
    calculateTotal() {
        this.total = this.cart.reduce((sum, item) => sum + item.price, 0);
        const totalElement = document.querySelector('.cart-total');
        if (totalElement) {
            totalElement.textContent = `Total: ₹${this.total}`;
        }
    }

    // Process card payment
    processCardPayment(cardDetails) {
        // Simulate payment processing
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this.validateCardDetails(cardDetails)) {
                    resolve({
                        success: true,
                        message: 'Payment processed successfully!',
                        orderId: this.generateOrderId()
                    });
                } else {
                    reject({
                        success: false,
                        message: 'Invalid card details. Please try again.'
                    });
                }
            }, 2000);
        });
    }

    // Validate card details
    validateCardDetails(details) {
        // Basic validation
        return (
            details.cardNumber.length === 16 &&
            details.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/);
        );
    }

    // Generate order ID
    generateOrderId() {
        return 'ORD' + Date.now().toString().slice(-8);
    }

    // Show payment confirmation
    showPaymentConfirmation(orderId, amount) {
        const modal = document.getElementById('paymentConfirmationModal');
        if (modal) {
            modal.querySelector('.order-id').textContent = orderId;
            modal.querySelector('.amount').textContent = `₹${amount}`;
            new bootstrap.Modal(modal).show();
        }
    }

    // Copy UPI ID
    copyUPIId(provider) {
        const upiId = provider === 'phonepe' ? 'pharmacy@phonepe' : 'pharmacy@gpay';
        navigator.clipboard.writeText(upiId).then(() => {
            this.showNotification('UPI ID copied to clipboard!');
        });
    }

    // Show notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-bell"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Setup event listeners
    setupEventListeners() {
        // Card payment form
        const cardPaymentForm = document.getElementById('cardPaymentForm');
        if (cardPaymentForm) {
            cardPaymentForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(cardPaymentForm);
                const cardDetails = {
                    cardNumber: formData.get('cardNumber'),
                    expiryDate: formData.get('expiryDate'),
                    cvv: formData.get('cvv'),
                    cardHolderName: formData.get('cardHolderName')
                };

                try {
                    const result = await this.processCardPayment(cardDetails);
                    this.showPaymentConfirmation(result.orderId, this.total);
                    this.cart = [];
                    this.updateCart();
                    this.calculateTotal();
                } catch (error) {
                    this.showNotification(error.message);
                }
            });
        }

        // UPI payment buttons
        document.querySelectorAll('.upi-option button').forEach(button => {
            button.addEventListener('click', (e) => {
                const provider = e.target.closest('.upi-option').dataset.provider;
                this.copyUPIId(provider);
            });
        });
    }
}

// Initialize payment system when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.paymentSystem = new PaymentSystem();
}); 