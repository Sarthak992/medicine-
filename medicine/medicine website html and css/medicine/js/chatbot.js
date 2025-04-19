// Chatbot functionality
let isChatOpen = false;

function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    const chatToggle = document.querySelector('.chatbot-toggle');
    
    if (!isChatOpen) {
        chatWindow.style.display = 'block';
        chatToggle.style.display = 'none';
        isChatOpen = true;
    } else {
        chatWindow.style.display = 'none';
        chatToggle.style.display = 'flex';
        isChatOpen = false;
    }
}

function sendMessage() {
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');
    const message = userInput.value.trim();
    
    if (message) {
        // Add user message
        addMessage(message, 'user');
        userInput.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const botResponse = getBotResponse(message);
            addMessage(botResponse, 'bot');
        }, 1000);
    }
}

function addMessage(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = message;
    
    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(messageTime);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Basic response system
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return "Hello! How can I help you today?";
    }
    else if (lowerMessage.includes('medicine') || lowerMessage.includes('prescription')) {
        return "For prescription medicines, please upload your prescription through our prescription upload section. For over-the-counter medicines, you can browse our catalog.";
    }
    else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        return "Our prices are competitive and vary based on the medicine. You can check specific prices in our medicine catalog.";
    }
    else if (lowerMessage.includes('delivery') || lowerMessage.includes('shipping')) {
        return "We offer fast delivery within 24-48 hours. Free delivery is available on orders above ₹500.";
    }
    else if (lowerMessage.includes('contact') || lowerMessage.includes('phone')) {
        return "You can reach us at +91 9416108970 or email us at rsingla31@gmail.com";
    }
    else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        return "You're welcome! Is there anything else I can help you with?";
    }
    else {
        return "I'm here to help! You can ask me about medicines, prescriptions, delivery, or contact information.";
    }
}

// Handle Enter key in input
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Close chat when clicking outside
document.addEventListener('click', function(e) {
    const chatWindow = document.getElementById('chatWindow');
    const chatToggle = document.querySelector('.chatbot-toggle');
    
    if (isChatOpen && !chatWindow.contains(e.target) && !chatToggle.contains(e.target)) {
        toggleChat();
    }
});

// Show notification when chat is closed
function showNotification() {
    const notification = document.getElementById('chatNotification');
    if (!isChatOpen) {
        notification.style.display = 'block';
    }
}

// Initialize notification
showNotification();

// Add event listener for prescription form submission
document.getElementById('prescriptionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show success message
    const notification = document.getElementById('prescriptionNotification');
    notification.style.display = 'block';
    
    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('prescriptionModal'));
    modal.hide();
}); 