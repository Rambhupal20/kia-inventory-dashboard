const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Fixes the connection block/CSP error
app.use(bodyParser.json());

// In-Memory Database (Resets when server restarts)
// You can replace this with SQLite later if needed.
let inventory = [
    { id: 1, partName: "Brake Pad (Front)", quantity: 24, status: "In Stock" },
    { id: 2, partName: "Oil Filter (Kia Seltos)", quantity: 5, status: "Low Stock" },
    { id: 3, partName: "Headlight Assembly", quantity: 0, status: "Out of Stock" }
];

// --- API ROUTES ---

// 1. GET all parts
app.get('/api/parts', (req, res) => {
    res.json(inventory);
});

// 2. POST a new part
app.post('/api/parts', (req, res) => {
    const { partName, quantity, status } = req.body;
    if (!partName || !quantity) {
        return res.status(400).json({ error: "Missing fields" });
    }
    const newPart = {
        id: Date.now(), // Simple unique ID
        partName,
        quantity: parseInt(quantity),
        status: status || "In Stock"
    };
    inventory.push(newPart);
    res.status(201).json(newPart);
});

// 3. DELETE a part
app.delete('/api/parts/:id', (req, res) => {
    const { id } = req.params;
    inventory = inventory.filter(part => part.id != id);
    res.json({ message: "Part deleted successfully" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Backend Server is running on http://localhost:${PORT}`);
});