// Medicine Database
const medicines = {
    diabetes: {
        name: "Diabetes Medicines",
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
    }
};

// Health Packages
const healthPackages = [
    {
        id: "HP1",
        name: "Basic Health Checkup",
        price: 999,
        includes: [
            "Blood Pressure Check",
            "Blood Sugar Test",
            "Basic Health Consultation",
            "Diet Plan"
        ]
    },
    {
        id: "HP2",
        name: "Comprehensive Health Package",
        price: 2499,
        includes: [
            "Complete Blood Count",
            "Lipid Profile",
            "Liver Function Test",
            "Kidney Function Test",
            "Health Consultation",
            "Diet & Exercise Plan"
        ]
    }
];

// Health News
const healthNews = [
    {
        id: "N1",
        title: "New Breakthrough in Diabetes Treatment",
        date: "2024-03-15",
        summary: "Researchers discover new treatment method for type 2 diabetes...",
        image: "images/news1.jpg"
    },
    {
        id: "N2",
        title: "Importance of Regular Health Checkups",
        date: "2024-03-14",
        summary: "Learn why regular health checkups are crucial for maintaining good health...",
        image: "images/news2.jpg"
    }
];

// Prescription System
class PrescriptionSystem {
    constructor() {
        this.prescriptions = [];
    }

    addPrescription(prescription) {
        prescription.id = `P${this.prescriptions.length + 1}`;
        prescription.status = "pending";
        prescription.date = new Date().toISOString();
        this.prescriptions.push(prescription);
        return prescription.id;
    }

    approvePrescription(id) {
        const prescription = this.prescriptions.find(p => p.id === id);
        if (prescription) {
            prescription.status = "approved";
            prescription.approvalDate = new Date().toISOString();
            return true;
        }
        return false;
    }

    getPrescription(id) {
        return this.prescriptions.find(p => p.id === id);
    }
}

// Initialize prescription system
const prescriptionSystem = new PrescriptionSystem();

// Event Handlers
function showDiseaseInfo(disease) {
    const diseaseInfo = medicines[disease];
    if (!diseaseInfo) return;

    const modal = document.getElementById('diseaseModal');
    const content = document.getElementById('diseaseContent');
    
    content.innerHTML = `
        <h3>${diseaseInfo.name}</h3>
        <div class="row">
            <div class="col-md-6">
                <h4>Recommended Medicines</h4>
                <ul>
                    ${diseaseInfo.items.map(item => `
                        <li>${item.name} - ₹${item.price} ${item.prescription ? '(Prescription Required)' : ''}</li>
                    `).join('')}
                </ul>
            </div>
            <div class="col-md-6">
                <h4>Dietary Guidelines</h4>
                <h5>Recommended Foods:</h5>
                <ul>
                    ${diseaseInfo.diet.recommended.map(food => `<li>${food}</li>`).join('')}
                </ul>
                <h5>Foods to Avoid:</h5>
                <ul>
                    ${diseaseInfo.diet.avoid.map(food => `<li>${food}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;

    $('#diseaseModal').modal('show');
}

function submitPrescription(event) {
    event.preventDefault();
    const form = event.target;
    const prescription = {
        doctorName: form.querySelector('input[type="text"]').value,
        date: form.querySelector('input[type="date"]').value,
        notes: form.querySelector('textarea').value,
        image: form.querySelector('input[type="file"]').files[0]
    };

    const prescriptionId = prescriptionSystem.addPrescription(prescription);
    showNotification(`Prescription submitted successfully! ID: ${prescriptionId}`);
    $('#prescriptionModal').modal('hide');
    form.reset();
}

function showNotification(message) {
    const notification = document.getElementById('prescriptionNotification');
    notification.querySelector('span').textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load health packages
    const packagesContainer = document.querySelector('.health-packages-container');
    if (packagesContainer) {
        packagesContainer.innerHTML = healthPackages.map(pkg => `
            <div class="health-package">
                <h3>${pkg.name}</h3>
                <p class="price">₹${pkg.price}</p>
                <ul>
                    ${pkg.includes.map(item => `<li>${item}</li>`).join('')}
                </ul>
                <button class="btn btn-primary" onclick="bookPackage('${pkg.id}')">Book Now</button>
            </div>
        `).join('');
    }

    // Load health news
    const newsContainer = document.querySelector('.health-news-container');
    if (newsContainer) {
        newsContainer.innerHTML = healthNews.map(news => `
            <div class="news-item">
                <img src="${news.image}" alt="${news.title}">
                <h3>${news.title}</h3>
                <p class="date">${new Date(news.date).toLocaleDateString()}</p>
                <p>${news.summary}</p>
                <a href="#" class="read-more">Read More</a>
            </div>
        `).join('');
    }

    // Initialize prescription form
    const prescriptionForm = document.getElementById('prescriptionForm');
    if (prescriptionForm) {
        prescriptionForm.addEventListener('submit', submitPrescription);
    }
}); 