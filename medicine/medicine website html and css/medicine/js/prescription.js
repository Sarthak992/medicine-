// Prescription System Class
class PrescriptionSystem {
    constructor() {
        this.prescriptions = [];
        this.setupEventListeners();
    }

    // Add new prescription
    addPrescription(prescriptionData) {
        const prescription = {
            id: this.generatePrescriptionId(),
            ...prescriptionData,
            status: 'pending',
            date: new Date().toISOString()
        };
        this.prescriptions.push(prescription);
        this.updatePrescriptionList();
        return prescription.id;
    }

    // Generate unique prescription ID
    generatePrescriptionId() {
        return 'PRES' + Date.now().toString().slice(-8);
    }

    // Update prescription list display
    updatePrescriptionList() {
        const container = document.querySelector('.prescription-list');
        if (!container) return;

        container.innerHTML = this.prescriptions.map(prescription => `
            <div class="prescription-item ${prescription.status}">
                <div class="prescription-header">
                    <h4>Prescription #${prescription.id}</h4>
                    <span class="status-badge">${prescription.status}</span>
                </div>
                <div class="prescription-details">
                    <p><strong>Doctor:</strong> ${prescription.doctorName}</p>
                    <p><strong>Date:</strong> ${new Date(prescription.date).toLocaleDateString()}</p>
                    <p><strong>Notes:</strong> ${prescription.notes || 'No additional notes'}</p>
                </div>
                ${prescription.image ? `
                    <div class="prescription-image">
                        <img src="${prescription.image}" alt="Prescription">
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    // Handle prescription upload
    handlePrescriptionUpload(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        // Handle image upload
        const imageFile = formData.get('prescriptionImage');
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const prescriptionData = {
                    doctorName: formData.get('doctorName'),
                    date: formData.get('prescriptionDate'),
                    notes: formData.get('notes'),
                    image: e.target.result
                };
                
                const prescriptionId = this.addPrescription(prescriptionData);
                this.showNotification(`Prescription uploaded successfully! ID: ${prescriptionId}`);
                form.reset();
                bootstrap.Modal.getInstance(document.getElementById('prescriptionModal')).hide();
            };
            reader.readAsDataURL(imageFile);
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
        const prescriptionForm = document.getElementById('prescriptionForm');
        if (prescriptionForm) {
            prescriptionForm.addEventListener('submit', (e) => this.handlePrescriptionUpload(e));
        }
    }
}

// Initialize prescription system when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.prescriptionSystem = new PrescriptionSystem();
}); 