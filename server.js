const express = require('express');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());
app.use(express.static('public'));

// Initialize SQLite Database
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error("Database opening error: ", err);
    console.log("Connected to SQLite database.");
});

// Create the Users table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'customer'
)`);

// Registering a new user with secure password hashing
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;

    // Server-side validation
    if (!email.includes('@') || password.length < 8) {
        return res.status(400).json({ error: "Invalid input data." });
    }

    try {
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Using prepared statements to prevent SQL Injection
        const stmt = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)");
        stmt.run(email, hashedPassword, function(err) {
            if (err) return res.status(500).json({ error: "Email already exists." });
            res.status(201).json({ message: "User registered securely!" });
        });
        stmt.finalize();
    } catch (err) {
        res.status(500).json({ error: "Server error." });
    }
});

// Login a user with secure password comparison
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    // Use a placeholder (?) to prevent SQL Injection
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        // Compare the hashed password
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            res.json({ message: "Login successful!", role: user.role });
        } else {
            res.status(401).json({ error: "Invalid credentials." });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Secure server running at http://localhost:${PORT}`));