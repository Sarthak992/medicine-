// Health Packages Data
const healthPackages = {
    basic: {
        name: "Basic Health Package",
        price: 999,
        duration: "3 months",
        includes: [
            "Basic health checkup",
            "Blood pressure monitoring",
            "Blood sugar test",
            "General consultation",
            "Basic medicines"
        ],
        image: "images/basic-package.jpg"
    },
    standard: {
        name: "Standard Health Package",
        price: 1999,
        duration: "6 months",
        includes: [
            "Comprehensive health checkup",
            "Regular blood pressure monitoring",
            "Blood sugar and cholesterol test",
            "Specialist consultation",
            "Prescribed medicines",
            "Diet plan consultation"
        ],
        image: "images/standard-package.jpg"
    },
    premium: {
        name: "Premium Health Package",
        price: 3999,
        duration: "12 months",
        includes: [
            "Full body health checkup",
            "24/7 health monitoring",
            "All diagnostic tests",
            "Multiple specialist consultations",
            "All prescribed medicines",
            "Personalized diet plan",
            "Emergency support"
        ],
        image: "images/premium-package.jpg"
    }
};

// Medicine Categories Data
const medicineCategories = {
    tablets: {
        name: "Tablets",
        items: [
            {
                name: "Paracetamol",
                price: 50,
                description: "Pain reliever and fever reducer",
                prescription: false,
                image: "images/paracetamol.jpg"
            },
            {
                name: "Metformin",
                price: 150,
                description: "Diabetes medication",
                prescription: true,
                image: "images/metformin.jpg"
            }
        ]
    },
    syrups: {
        name: "Syrups",
        items: [
            {
                name: "Cough Syrup",
                price: 120,
                description: "Relieves cough and cold symptoms",
                prescription: false,
                image: "images/cough-syrup.jpg"
            },
            {
                name: "Vitamin Syrup",
                price: 200,
                description: "Multivitamin supplement",
                prescription: false,
                image: "images/vitamin-syrup.jpg"
            }
        ]
    },
    capsules: {
        name: "Capsules",
        items: [
            {
                name: "Antibiotic Capsules",
                price: 180,
                description: "Broad-spectrum antibiotic",
                prescription: true,
                image: "images/antibiotic.jpg"
            },
            {
                name: "Probiotic Capsules",
                price: 250,
                description: "Gut health supplement",
                prescription: false,
                image: "images/probiotic.jpg"
            }
        ]
    }
};

// Diet Plans Data
const dietPlans = {
    diabetes: {
        name: "Diabetes Diet Plan",
        meals: {
            breakfast: [
                "Oatmeal with fruits",
                "Low-fat milk",
                "Nuts and seeds"
            ],
            lunch: [
                "Brown rice",
                "Grilled chicken/fish",
                "Mixed vegetables"
            ],
            dinner: [
                "Whole grain bread",
                "Lean protein",
                "Green salad"
            ],
            snacks: [
                "Fresh fruits",
                "Greek yogurt",
                "Nuts"
            ]
        },
        restrictions: [
            "Avoid sugary foods",
            "Limit refined carbs",
            "Control portion sizes"
        ]
    },
    hypertension: {
        name: "Hypertension Diet Plan",
        meals: {
            breakfast: [
                "Whole grain cereal",
                "Banana",
                "Low-fat yogurt"
            ],
            lunch: [
                "Quinoa",
                "Baked fish",
                "Steamed vegetables"
            ],
            dinner: [
                "Sweet potato",
                "Grilled chicken",
                "Fresh salad"
            ],
            snacks: [
                "Fresh fruits",
                "Unsalted nuts",
                "Vegetable sticks"
            ]
        },
        restrictions: [
            "Reduce salt intake",
            "Avoid processed foods",
            "Limit alcohol"
        ]
    }
};

// Functions to display health packages
function displayHealthPackages() {
    const container = document.getElementById('health-packages-container');
    if (!container) return;

    let html = '';
    for (const [key, package] of Object.entries(healthPackages)) {
        html += `
            <div class="health-package-card">
                <img src="${package.image}" alt="${package.name}">
                <h3>${package.name}</h3>
                <div class="package-price">₹${package.price}</div>
                <div class="package-duration">${package.duration}</div>
                <ul class="package-features">
                    ${package.includes.map(item => `<li>${item}</li>`).join('')}
                </ul>
                <button onclick="selectPackage('${key}')" class="btn btn-primary">Select Package</button>
            </div>
        `;
    }
    container.innerHTML = html;
}

// Functions to display medicine categories
function displayMedicineCategories() {
    const container = document.getElementById('medicine-categories-container');
    if (!container) return;

    let html = '';
    for (const [key, category] of Object.entries(medicineCategories)) {
        html += `
            <div class="medicine-category">
                <h3>${category.name}</h3>
                <div class="medicine-grid">
                    ${category.items.map(item => `
                        <div class="medicine-card">
                            <img src="${item.image}" alt="${item.name}">
                            <h4>${item.name}</h4>
                            <p>${item.description}</p>
                            <div class="medicine-price">₹${item.price}</div>
                            ${item.prescription ? 
                                '<div class="prescription-notice">Prescription Required</div>' : 
                                '<button onclick="addToCart(\'' + item.name + '\')" class="btn btn-primary">Add to Cart</button>'
                            }
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

// Function to display diet plans
function displayDietPlan(condition) {
    const plan = dietPlans[condition];
    if (!plan) return;

    const container = document.getElementById('diet-plan-container');
    if (!container) return;

    const html = `
        <h3>${plan.name}</h3>
        <div class="diet-plan-grid">
            <div class="meal-section">
                <h4>Breakfast</h4>
                <ul>${plan.meals.breakfast.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>
            <div class="meal-section">
                <h4>Lunch</h4>
                <ul>${plan.meals.lunch.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>
            <div class="meal-section">
                <h4>Dinner</h4>
                <ul>${plan.meals.dinner.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>
            <div class="meal-section">
                <h4>Snacks</h4>
                <ul>${plan.meals.snacks.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>
        </div>
        <div class="diet-restrictions">
            <h4>Restrictions</h4>
            <ul>${plan.restrictions.map(item => `<li>${item}</li>`).join('')}</ul>
        </div>
    `;
    container.innerHTML = html;
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    displayHealthPackages();
    displayMedicineCategories();
}); 