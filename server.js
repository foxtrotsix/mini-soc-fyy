const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Basic route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Simple Login Logic (Simulated)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    // For this simple demo, any username/password works
    if (username && password) {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(400).json({ success: false, message: 'Username and password required' });
    }
});

// Simple Order Submission Logic
app.post('/api/order', (req, res) => {
    const { cart, paymentInfo } = req.body;
    console.log('Order received:', { cart, paymentInfo });
    res.json({ success: true, message: 'Order placed successfully!', orderId: Math.floor(Math.random() * 100000) });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
