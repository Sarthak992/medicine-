const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/medimatch', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// File Upload Configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/prescriptions');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Models
const Medicine = require('./models/Medicine');
const Order = require('./models/Order');
const User = require('./models/User');

// Routes
app.get('/api/medicines', async (req, res) => {
    try {
        const medicines = await Medicine.find();
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/medicines/:category', async (req, res) => {
    try {
        const medicines = await Medicine.find({ category: req.params.category });
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/orders', upload.single('prescription'), async (req, res) => {
    try {
        const order = new Order({
            medicines: req.body.medicines,
            totalAmount: req.body.totalAmount,
            prescriptionPath: req.file ? req.file.path : null,
            userId: req.body.userId,
            status: 'pending'
        });
        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone
        });
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const validPassword = await user.comparePassword(req.body.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = user.generateAuthToken();
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
