// Website Configuration Data
const websiteConfig = {
    name: "MediMatch",
    logo: "images/logo.png",
    contact: {
        phone: "+91 9416108970",
        email: "rsingla31@gmail.com",
        address: "123 Healthcare Street, Medical City"
    },
    social: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
        linkedin: "#"
    }
};

// Hero Section Data
const heroSection = {
    title: "Your Health, Our Priority",
    subtitle: "Professional healthcare solutions with expert consultation and reliable medicine delivery.",
    image: "images/hero-image.png",
    buttons: [
        {
            text: "Browse Medicines",
            link: "#medicines",
            class: "btn-primary"
        },
        {
            text: "Health Packages",
            link: "#health-packages",
            class: "btn-outline-primary"
        }
    ]
};

// Features Section Data
const features = [
    {
        icon: "fas fa-truck",
        title: "Fast Delivery",
        description: "24/7 delivery service with real-time tracking",
        image: "images/delivery.png"
    },
    {
        icon: "fas fa-user-md",
        title: "Expert Consultation",
        description: "Professional healthcare advice from experienced pharmacists",
        image: "images/consultation.png"
    },
    {
        icon: "fas fa-shield-alt",
        title: "Quality Assured",
        description: "100% genuine medicines from trusted manufacturers",
        image: "images/quality.png"
    }
];

// Medicine Categories Data
const medicineCategories = [
    {
        icon: "fas fa-heartbeat",
        title: "Cardiovascular",
        description: "Heart health medicines and supplements",
        image: "images/cardio.jpg"
    },
    {
        icon: "fas fa-brain",
        title: "Neurological",
        description: "Brain and nerve health medications",
        image: "images/neuro.jpg"
    },
    {
        icon: "fas fa-lungs",
        title: "Respiratory",
        description: "Lung and breathing medications",
        image: "images/respiratory.jpg"
    },
    {
        icon: "fas fa-bone",
        title: "Orthopedic",
        description: "Bone and joint health medicines",
        image: "images/ortho.jpg"
    }
];

// Health Packages Data
const healthPackages = [
    {
        name: "Basic Health",
        price: 999,
        features: [
            "Basic Health Checkup",
            "2 Doctor Consultations",
            "Basic Medicines"
        ],
        image: "images/basic-package.jpg"
    },
    {
        name: "Premium Health",
        price: 1999,
        features: [
            "Comprehensive Health Checkup",
            "5 Doctor Consultations",
            "Premium Medicines"
        ],
        image: "images/premium-package.jpg"
    },
    {
        name: "Family Health",
        price: 3999,
        features: [
            "Family Health Checkup",
            "Unlimited Consultations",
            "Family Medicine Kit"
        ],
        image: "images/family-package.jpg"
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Update website name and logo
    updateWebsiteBranding();
    
    // Update hero section
    updateHeroSection();
    
    // Update features section
    updateFeaturesSection();
    
    // Update medicine categories
    updateMedicineCategories();
    
    // Update health packages
    updateHealthPackages();
});

// Update website branding
function updateWebsiteBranding() {
    // Update logo and brand name
    const brandLogo = document.querySelector('.navbar-brand img');
    const brandName = document.querySelector('.navbar-brand span');
    if (brandLogo) brandLogo.src = websiteConfig.logo;
    if (brandName) brandName.textContent = websiteConfig.name;
    
    // Update contact information
    const phoneElement = document.querySelector('.contact-info span:first-child');
    const emailElement = document.querySelector('.contact-info span:last-child');
    if (phoneElement) phoneElement.innerHTML = `<i class="fas fa-phone"></i> ${websiteConfig.contact.phone}`;
    if (emailElement) emailElement.innerHTML = `<i class="fas fa-envelope"></i> ${websiteConfig.contact.email}`;
}

// Update hero section
function updateHeroSection() {
    const heroTitle = document.querySelector('.hero-content h1');
    const heroSubtitle = document.querySelector('.hero-content .lead');
    const heroImage = document.querySelector('.hero-image img');
    
    if (heroTitle) heroTitle.textContent = heroSection.title;
    if (heroSubtitle) heroSubtitle.textContent = heroSection.subtitle;
    if (heroImage) heroImage.src = heroSection.image;
    
    // Update hero buttons
    const heroButtons = document.querySelector('.hero-buttons');
    if (heroButtons) {
        heroButtons.innerHTML = heroSection.buttons.map(button => 
            `<a href="${button.link}" class="btn ${button.class}">${button.text}</a>`
        ).join('');
    }
}

// Update features section
function updateFeaturesSection() {
    const featuresContainer = document.querySelector('.features .row');
    if (featuresContainer) {
        featuresContainer.innerHTML = features.map(feature => `
            <div class="col-md-4">
                <div class="feature-card">
                    <i class="${feature.icon}"></i>
                    <h3>${feature.title}</h3>
                    <p>${feature.description}</p>
                </div>
            </div>
        `).join('');
    }
}

// Update medicine categories
function updateMedicineCategories() {
    const categoriesContainer = document.querySelector('.medicine-categories .row');
    if (categoriesContainer) {
        categoriesContainer.innerHTML = medicineCategories.map(category => `
            <div class="col-md-3">
                <div class="category-card">
                    <i class="${category.icon}"></i>
                    <h4>${category.title}</h4>
                    <p>${category.description}</p>
                </div>
            </div>
        `).join('');
    }
}

// Update health packages
function updateHealthPackages() {
    const packagesContainer = document.querySelector('.health-packages .row');
    if (packagesContainer) {
        packagesContainer.innerHTML = healthPackages.map(package => `
            <div class="col-md-4">
                <div class="package-card">
                    <div class="package-header">
                        <h3>${package.name}</h3>
                        <div class="price">₹${package.price}</div>
                    </div>
                    <ul class="package-features">
                        ${package.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                    </ul>
                    <button class="btn btn-primary">Select Package</button>
                </div>
            </div>
        `).join('');
    }
} 