const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['cardiac', 'diabetes', 'pain', 'respiratory', 'orthopedic', 'neurological']
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    requiresPrescription: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    manufacturer: {
        type: String,
        required: true
    },
    dosage: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Medicine', medicineSchema);
