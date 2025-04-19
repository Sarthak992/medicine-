const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/medical_store', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/prescriptions/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Define Schemas
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    address: String,
    createdAt: { type: Date, default: Date.now }
});

const medicineSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    stock: Number,
    image: String,
    manufacturer: String,
    requiresPrescription: Boolean
});

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{
        medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
        quantity: Number,
        price: Number
    }],
    total: Number,
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'shipped', 'delivered'],
        default: 'pending'
    },
    shippingAddress: String,
    paymentMethod: String,
    paymentStatus: { 
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    prescriptionImage: String,
    date: { type: Date, default: Date.now }
});

const prescriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    image: String,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    notes: String,
    uploadedAt: { type: Date, default: Date.now }
});

const chatMessageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    type: { type: String, enum: ['user', 'bot'] },
    timestamp: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Medicine = mongoose.model('Medicine', medicineSchema);
const Order = mongoose.model('Order', orderSchema);
const Prescription = mongoose.model('Prescription', prescriptionSchema);
const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

// API Routes
// User Routes
app.post('/api/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: 'User registered successfully', userId: user._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Medicine Routes
app.get('/api/medicines', async (req, res) => {
    try {
        const { category, search, sort } = req.query;
        let query = {};
        
        if (category) {
            query.category = category;
        }
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        let sortOption = {};
        if (sort === 'price-low') {
            sortOption.price = 1;
        } else if (sort === 'price-high') {
            sortOption.price = -1;
        } else if (sort === 'name') {
            sortOption.name = 1;
        }

        const medicines = await Medicine.find(query).sort(sortOption);
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Order Routes
app.post('/api/orders', async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json({ 
            message: 'Order placed successfully', 
            orderId: order._id,
            status: order.status
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/orders/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId })
            .populate('items.medicineId')
            .sort({ date: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Prescription Routes
app.post('/api/prescriptions/upload', upload.single('prescription'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const prescription = new Prescription({
            userId: req.body.userId,
            image: req.file.filename,
            notes: req.body.notes
        });

        await prescription.save();
        res.status(201).json({ 
            message: 'Prescription uploaded successfully',
            prescriptionId: prescription._id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Chat Routes
app.post('/api/chat/message', async (req, res) => {
    try {
        const { userId, message } = req.body;
        
        // Save user message
        const userMessage = new ChatMessage({
            userId,
            message,
            type: 'user'
        });
        await userMessage.save();

        // Generate bot response
        let botResponse = '';
        if (message.toLowerCase().includes('prescription')) {
            botResponse = 'You can upload your prescription through the Upload Prescription button on our website. Our pharmacists will review it and process your order accordingly.';
        } else if (message.toLowerCase().includes('delivery')) {
            botResponse = 'We typically deliver medicines within 24-48 hours of order confirmation. For urgent requirements, please contact our support team.';
        } else if (message.toLowerCase().includes('payment')) {
            botResponse = 'We accept various payment methods including credit/debit cards, UPI, and cash on delivery.';
        } else {
            botResponse = 'How can I assist you today? Feel free to ask about our medicines, prescriptions, delivery, or payment options.';
        }

        // Save bot response
        const botMessage = new ChatMessage({
            userId,
            message: botResponse,
            type: 'bot'
        });
        await botMessage.save();

        res.json({
            userMessage: userMessage,
            botResponse: botMessage
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/chat/history/:userId', async (req, res) => {
    try {
        const messages = await ChatMessage.find({ userId: req.params.userId })
            .sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Payment webhook (simulated)
app.post('/api/payment/webhook', async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.paymentStatus = status;
        if (status === 'completed') {
            order.status = 'confirmed';
        }
        
        await order.save();
        res.json({ message: 'Payment status updated', order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
