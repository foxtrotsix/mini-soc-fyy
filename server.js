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

// Mock Database (In-Memory for SOC simulation)
const usersDB = [
    { id: 1, username: 'admin', password: 'SuperSecretPassword2026', role: 'Administrator' },
    { id: 2, username: 'ceo_gourmet', password: 'MillionDollarPassword!', role: 'CEO' },
    { id: 3, username: 'staff_kitchen', password: 'password123', role: 'Staff' }
];

// Vulnerable Login Logic (Simulated SQL Injection)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    // INTENTIONALLY VULNERABLE: Simulated SQLi via flexible search.
    // An attacker can use: ' OR '1'='1 to bypass.
    const user = usersDB.find(u => {
        // This logic mimics a poorly written SQL query where OR logic can be injected
        const query = `username === '${username}' && password === '${password}'`;
        
        // Using a simple regex/string trick to simulate OR bypass
        if (username.includes("' OR '1'='1") || password.includes("' OR '1'='1")) {
            return true; // Bypass triggered
        }
        
        return u.username === username && u.password === password;
    });

    if (user) {
        res.json({ success: true, message: 'Login successful', username: user.username, role: user.role });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Simple Order Submission Logic
app.post('/api/order', (req, res) => {
    const { cart, paymentInfo } = req.body;
    console.log('Order received:', { cart, paymentInfo });
    res.json({ success: true, message: 'Order placed successfully!', orderId: Math.floor(Math.random() * 100000) });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
