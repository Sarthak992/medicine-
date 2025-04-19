// Medicine Database Class
class MedicineDatabase {
    constructor() {
        this.medicines = {
            diabetes: {
                name: "Diabetes Medicines",
                description: "Comprehensive diabetes management solutions",
                image: "images/diabetes-medicine.jpg",
                items: [
                    { id: "D1", name: "Metformin 500mg", price: 150, prescription: true },
                    { id: "D2", name: "Glimepiride 2mg", price: 200, prescription: true },
                    { id: "D3", name: "Insulin", price: 800, prescription: true }
                ],
                diet: {
                    recommended: [
                        "Whole grains",
                        "Leafy vegetables",
                        "Lean proteins",
                        "Low glycemic fruits"
                    ],
                    avoid: [
                        "Refined sugar",
                        "White bread",
                        "Processed foods",
                        "High-fat dairy"
                    ]
                }
            },
            hypertension: {
                name: "Blood Pressure Medicines",
                description: "Effective blood pressure management solutions",
                image: "images/hypertension-medicine.jpg",
                items: [
                    { id: "H1", name: "Amlodipine 5mg", price: 180, prescription: true },
                    { id: "H2", name: "Lisinopril 10mg", price: 250, prescription: true },
                    { id: "H3", name: "Hydrochlorothiazide", price: 120, prescription: true }
                ],
                diet: {
                    recommended: [
                        "Low-sodium foods",
                        "Potassium-rich foods",
                        "Leafy greens",
                        "Berries"
                    ],
                    avoid: [
                        "Salt",
                        "Processed meats",
                        "Canned foods",
                        "Alcohol"
                    ]
                }
            },
            arthritis: {
                name: "Arthritis Medicines",
                description: "Pain relief and management for arthritis",
                image: "images/arthritis-medicine.jpg",
                items: [
                    { id: "A1", name: "Ibuprofen 400mg", price: 100, prescription: false },
                    { id: "A2", name: "Methotrexate", price: 300, prescription: true },
                    { id: "A3", name: "Glucosamine", price: 450, prescription: false }
                ],
                diet: {
                    recommended: [
                        "Anti-inflammatory foods",
                        "Omega-3 rich foods",
                        "Colorful vegetables",
                        "Whole grains"
                    ],
                    avoid: [
                        "Processed foods",
                        "Red meat",
                        "Dairy products",
                        "Nightshade vegetables"
                    ]
                }
            }
        };
        this.setupEventListeners();
    }

    // Show disease information
    showDiseaseInfo(disease) {
        const diseaseInfo = this.medicines[disease];
        if (!diseaseInfo) return;

        const modal = document.getElementById('diseaseModal');
        const content = document.getElementById('diseaseContent');
        
        content.innerHTML = `
            <div class="disease-header">
                <img src="${diseaseInfo.image}" alt="${diseaseInfo.name}" class="disease-image">
                <h3>${diseaseInfo.name}</h3>
                <p>${diseaseInfo.description}</p>
            </div>
            <div class="row mt-4">
                <div class="col-md-6">
                    <div class="medicine-list">
                        <h4>Available Medicines</h4>
                        <ul>
                            ${diseaseInfo.items.map(item => `
                                <li>
                                    <div class="medicine-item">
                                        <span class="medicine-name">${item.name}</span>
                                        <span class="medicine-price">₹${item.price}</span>
                                        ${item.prescription ? '<span class="prescription-badge">Prescription Required</span>' : ''}
                                    </div>
                                    <button class="btn btn-primary btn-sm" onclick="medicineDatabase.addToCart('${disease}', '${item.id}')">
                                        Add to Cart
                                    </button>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="diet-guidelines">
                        <h4>Dietary Guidelines</h4>
                        <div class="diet-section">
                            <h5>Recommended Foods:</h5>
                            <ul>
                                ${diseaseInfo.diet.recommended.map(food => `<li>${food}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="diet-section">
                            <h5>Foods to Avoid:</h5>
                            <ul>
                                ${diseaseInfo.diet.avoid.map(food => `<li>${food}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;

        new bootstrap.Modal(modal).show();
    }

    // Add medicine to cart
    addToCart(disease, itemId) {
        const diseaseInfo = this.medicines[disease];
        const item = diseaseInfo.items.find(i => i.id === itemId);
        
        if (item) {
            if (window.paymentSystem) {
                window.paymentSystem.addToCart({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image: diseaseInfo.image
                });
                this.showNotification(`${item.name} added to cart`);
            }
        }
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
        // Disease card click handlers
        document.querySelectorAll('.disease-card').forEach(card => {
            card.addEventListener('click', () => {
                const disease = card.dataset.disease;
                this.showDiseaseInfo(disease);
            });
        });
    }
}

// Initialize medicine database when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.medicineDatabase = new MedicineDatabase();
}); 