// Chat bot functionality
const chatbot = {
    messages: [],
    isOpen: false,
    
    init() {
        this.chatBody = document.querySelector('.chat-body');
        this.messageContainer = document.getElementById('chatMessages');
        this.userInput = document.getElementById('userInput');
        
        // Add event listener for user input
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Add initial suggestions
        setTimeout(() => {
            this.addMessage('bot', 'Here are some things I can help you with:');
            this.addQuickReplies([
                'Find medicines',
                'Get diet plan',
                'Upload prescription',
                'Health consultation'
            ]);
        }, 1000);
    },

    toggleChat() {
        this.isOpen = !this.isOpen;
        document.getElementById('chatbot').classList.toggle('open');
        if (this.isOpen) {
            this.userInput.focus();
        }
    },

    sendMessage() {
        const message = this.userInput.value.trim();
        if (message) {
            // Add user message
            this.addMessage('user', message);
            this.userInput.value = '';

            // Simulate bot response
            this.showTypingIndicator();
            setTimeout(() => {
                this.hideTypingIndicator();
                this.processUserMessage(message);
            }, 1000);
        }
    },

    processUserMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('medicine') || lowerMessage.includes('drug')) {
            this.addMessage('bot', "I can help you find medicines. What type of medicine are you looking for?");
            this.addQuickReplies([
                'Pain relief',
                'Diabetes',
                'Heart health',
                'Vitamins'
            ]);
        } else if (lowerMessage.includes('diet') || lowerMessage.includes('food')) {
            this.addMessage('bot', "Let's create a personalized diet plan for you. What's your main health goal?");
            this.addQuickReplies([
                'Weight loss',
                'Diabetes control',
                'Heart health',
                'General wellness'
            ]);
        } else if (lowerMessage.includes('prescription')) {
            this.addMessage('bot', "You can easily upload your prescription for quick medicine delivery. Would you like to upload now?");
            this.addQuickReplies([
                'Upload prescription',
                'How it works',
                'Talk to pharmacist'
            ]);
        } else if (lowerMessage.includes('consult') || lowerMessage.includes('doctor')) {
            this.addMessage('bot', "Our healthcare experts are available for consultation. What type of specialist would you like to consult?");
            this.addQuickReplies([
                'General Physician',
                'Nutritionist',
                'Cardiologist',
                'Diabetologist'
            ]);
        } else {
            this.addMessage('bot', "I'm here to help you with medicines, diet plans, prescriptions, and health consultations. What would you like to know more about?");
            this.addQuickReplies([
                'Find medicines',
                'Get diet plan',
                'Upload prescription',
                'Health consultation'
            ]);
        }
    },

    addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type} animate-fade-in`;
        messageDiv.textContent = content;
        this.messageContainer.appendChild(messageDiv);
        this.scrollToBottom();
    },

    addQuickReplies(replies) {
        const quickRepliesDiv = document.createElement('div');
        quickRepliesDiv.className = 'quick-replies animate-fade-in';
        
        replies.forEach(reply => {
            const button = document.createElement('button');
            button.className = 'quick-reply-btn';
            button.textContent = reply;
            button.onclick = () => {
                this.userInput.value = reply;
                this.sendMessage();
                quickRepliesDiv.remove();
            };
            quickRepliesDiv.appendChild(button);
        });
        
        this.messageContainer.appendChild(quickRepliesDiv);
        this.scrollToBottom();
    },

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing animate-fade-in';
        typingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        this.messageContainer.appendChild(typingDiv);
        this.scrollToBottom();
    },

    hideTypingIndicator() {
        const typingIndicator = this.messageContainer.querySelector('.typing');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    },

    scrollToBottom() {
        this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
    }
};

// Enhanced UI Interactions
function addButtonAnimation(button) {
    button.addEventListener('click', function(e) {
        const circle = document.createElement('div');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${e.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    });
}

// Enhanced Notifications
function showNotification(message, type = 'info') {
    const toastContainer = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type} fade-in`;
    toast.innerHTML = `
        <div class="toast-header">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                          type === 'error' ? 'fa-exclamation-circle' : 
                          'fa-info-circle'} me-2"></i>
            <strong class="me-auto">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">${message}</div>
    `;
    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Enhanced Form Validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            showInputError(input, 'This field is required');
        } else {
            clearInputError(input);
            
            // Specific validations
            if (input.type === 'email' && !validateEmail(input.value)) {
                isValid = false;
                showInputError(input, 'Please enter a valid email');
            } else if (input.type === 'tel' && !validatePhone(input.value)) {
                isValid = false;
                showInputError(input, 'Please enter a valid phone number');
            }
        }
    });

    return isValid;
}

function showInputError(input, message) {
    const formGroup = input.closest('.mb-3');
    const errorDiv = formGroup.querySelector('.error-message') || document.createElement('div');
    errorDiv.className = 'error-message text-danger mt-1 slide-up';
    errorDiv.textContent = message;
    
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(errorDiv);
    }
    
    input.classList.add('is-invalid');
}

function clearInputError(input) {
    const formGroup = input.closest('.mb-3');
    const errorDiv = formGroup.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    input.classList.remove('is-invalid');
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^\d{10}$/.test(phone.replace(/\D/g, ''));
}

// Enhanced Login/Register Handling
function handleLogin() {
    const form = document.getElementById('loginForm');
    if (!validateForm(form)) return;

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Simulate API call
    showNotification('Logging in...', 'info');
    
    setTimeout(() => {
        currentUser = {
            email: email,
            name: email.split('@')[0],
            loginTime: new Date()
        };

        updateUserInterface();
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        loginModal.hide();
        
        showNotification('Welcome back, ' + currentUser.name + '!', 'success');
    }, 1000);
}

function handleRegister() {
    const form = document.getElementById('registerForm');
    if (!validateForm(form)) return;

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const phone = document.getElementById('registerPhone').value;

    // Simulate API call
    showNotification('Creating your account...', 'info');
    
    setTimeout(() => {
        currentUser = {
            name: name,
            email: email,
            phone: phone,
            registrationTime: new Date()
        };

        updateUserInterface();
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        loginModal.hide();
        
        showNotification('Welcome to MediCare, ' + name + '!', 'success');
    }, 1000);
}

// Appointment Booking
function bookAppointment(doctorName, specialty) {
    const modal = new bootstrap.Modal(document.getElementById('appointmentModal'));
    document.getElementById('selectedDoctor').textContent = doctorName;
    document.getElementById('selectedSpecialty').textContent = specialty;
    modal.show();
}

// Lab Test Booking
function bookLabTest(packageName) {
    const modal = new bootstrap.Modal(document.getElementById('labTestModal'));
    document.getElementById('selectedPackage').textContent = packageName;
    modal.show();
}

// Video Consultation
function startVideoConsultation() {
    const modal = new bootstrap.Modal(document.getElementById('videoModal'));
    modal.show();
}

// Diet Plan Modal
function showDietPlanModal(type) {
    const modal = new bootstrap.Modal(document.getElementById('dietPlanModal'));
    const planTypes = {
        'weight': 'Weight Management Plan',
        'diabetes': 'Diabetes Care Plan',
        'heart': 'Heart Health Plan'
    };
    document.getElementById('selectedPlan').textContent = planTypes[type];
    modal.show();
}

// File Upload for Prescriptions
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('uploadedImage').src = e.target.result;
            document.getElementById('uploadSuccess').classList.remove('d-none');
        };
        reader.readAsDataURL(file);
    }
}

// Drag and Drop
function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
}

function handleDragLeave(event) {
    event.currentTarget.classList.remove('drag-over');
}

function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        document.getElementById('fileUpload').files = files;
        handleFileUpload({ target: { files: files } });
    }
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

// Handle form submissions
document.addEventListener('DOMContentLoaded', function() {
    // Prescription form submission
    const prescriptionForm = document.getElementById('prescriptionForm');
    if (prescriptionForm) {
        prescriptionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Get form data
            const formData = new FormData(prescriptionForm);
            // Here you would typically send this to a server
            showNotification('Prescription submitted successfully!', 'success');
            prescriptionForm.reset();
        });
    }

    // File upload handling
    const fileUpload = document.getElementById('fileUpload');
    if (fileUpload) {
        fileUpload.addEventListener('change', handleFileUpload);
    }
});

// File upload handlers
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const dropArea = e.currentTarget;
    dropArea.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    handleFiles(files);
}

function handleFileUpload(event) {
    const files = event.target.files || event.dataTransfer.files;
    handleFiles(files);
}

function handleFiles(files) {
    if (files.length === 0) return;

    const file = files[0];
    if (!isValidFile(file)) {
        showNotification('Please upload a valid image or PDF file (max 5MB)', 'error');
        return;
    }

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('uploadedImage').src = e.target.result;
            document.getElementById('uploadSuccess').classList.remove('d-none');
        };
        reader.readAsDataURL(file);
    } else {
        // Handle PDF files
        document.getElementById('uploadSuccess').classList.remove('d-none');
        document.getElementById('uploadedImage').style.display = 'none';
    }

    showNotification('File uploaded successfully!', 'success');
}

function isValidFile(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    return validTypes.includes(file.type) && file.size <= maxSize;
}

// Cart functionality
let cart = [];
let totalAmount = 0;

function addToCart(medicineId, name, price) {
    cart.push({
        id: medicineId,
        name: name,
        price: price,
        quantity: 1
    });
    updateCartDisplay();
    showNotification('Added to cart successfully!', 'success');
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.querySelector('.cart-count');
    totalAmount = 0;

    if (cartItems) {
        cartItems.innerHTML = '';
        cart.forEach((item, index) => {
            totalAmount += item.price * item.quantity;
            cartItems.innerHTML += `
                <div class="cart-item d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h6 class="mb-0">${item.name}</h6>
                        <small class="text-muted">₹${item.price} x ${item.quantity}</small>
                    </div>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary me-2" onclick="updateQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary ms-2" onclick="updateQuantity(${index}, 1)">+</button>
                        <button class="btn btn-sm btn-danger ms-3" onclick="removeFromCart(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        const cartTotal = document.getElementById('cartTotal');
        if (cartTotal) {
            cartTotal.textContent = `₹${totalAmount.toFixed(2)}`;
        }
    }

    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

function updateQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity = Math.max(1, cart[index].quantity + change);
        updateCartDisplay();
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    showNotification('Item removed from cart', 'success');
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('show');
    }
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }

    // Show payment modal
    const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
    paymentModal.show();
}

function processPayment() {
    const paymentForm = document.getElementById('paymentForm');
    const formData = new FormData(paymentForm);

    // Validate payment form
    if (!paymentForm.checkValidity()) {
        showNotification('Please fill all required fields', 'error');
        return;
    }

    // Simulate payment processing
    showNotification('Processing payment...', 'info');
    setTimeout(() => {
        showNotification('Payment successful! Order confirmed.', 'success');
        cart = [];
        updateCartDisplay();
        const paymentModal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
        paymentModal.hide();
    }, 1500);
}

// Initialize Enhanced UI
document.addEventListener('DOMContentLoaded', () => {
    // Add ripple effect to all buttons
    document.querySelectorAll('.btn').forEach(addButtonAnimation);

    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));

    // Initialize forms with enhanced validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(form)) {
                form.classList.add('was-validated');
            }
        });
    });

    // Add input animations
    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('focus', () => {
            input.closest('.mb-3').classList.add('focused');
        });
        input.addEventListener('blur', () => {
            input.closest('.mb-3').classList.remove('focused');
        });
    });

    chatbot.init();
    // Initialize forms
    const forms2 = document.querySelectorAll('form');
    forms2.forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
});

// Login and Register functionality
let currentUser = null;

function showLoginModal() {
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
}

function showLoginForm() {
    document.getElementById('loginForm').classList.remove('d-none');
    document.getElementById('registerForm').classList.add('d-none');
}

function showRegisterForm() {
    document.getElementById('loginForm').classList.add('d-none');
    document.getElementById('registerForm').classList.remove('d-none');
}

function updateUserInterface() {
    const loginButton = document.querySelector('.btn-outline-primary');
    if (currentUser) {
        loginButton.innerHTML = `<i class="fas fa-user me-2"></i>${currentUser.name}`;
        loginButton.onclick = handleLogout;
    } else {
        loginButton.innerHTML = `<i class="fas fa-user me-2"></i>Login`;
        loginButton.onclick = showLoginModal;
    }
}

function handleLogout() {
    currentUser = null;
    updateUserInterface();
    showNotification('Logged out successfully', 'success');
}

// Toast notification function
function showToast(message, type = 'success') {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    document.body.appendChild(toastContainer);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toastContainer);
        }, 300);
    }, 3000);
}

// Button click handlers
function showLoginModal() {
    showToast('Opening login form...', 'info');
    // Add your login modal logic here
}

function toggleCart() {
    showToast('Opening your shopping cart...', 'info');
    // Add your cart toggle logic here
}

function showUploadModal() {
    showToast('Opening prescription upload...', 'info');
    // Add your upload modal logic here
}

function addToCart(medicineId) {
    showToast('Medicine added to cart!', 'success');
    // Add your add to cart logic here
}

function findMedicines() {
    showToast('Searching for medicines...', 'info');
    // Add your medicine search logic here
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers to all action buttons
    const actionButtons = document.querySelectorAll('.action-btn, .btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            showToast(`${buttonText} action initiated!`, 'info');
        });
    });
});

// Add ripple effect to buttons
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;
    
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - rect.left - radius}px`;
    ripple.style.top = `${event.clientY - rect.top - radius}px`;
    ripple.className = 'ripple';
    
    button.appendChild(ripple);
    
    ripple.addEventListener('animationend', () => {
        button.removeChild(ripple);
    });
}

// Add ripple effect to all buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
});
