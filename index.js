// Import the Express library
const express = require('express');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator'); // Import express-validator

// Create an instance of an Express application
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(500).json({ error: 'Something went wrong!' }); 
});

// array to store user data
const users = [];

// Route to handle GET requests
app.get('/users', (req, res) => {
    console.log('GET /users endpoint was accessed'); 
    res.status(200).json(users);
});

// Route to handle POST requests with validation
app.post('/register', [
    // Input validation
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if the email already exists in the users array
    const userExists = users.find(user => user.email === email);
    if (userExists) {
        return res.status(409).json({ message: 'Email already exists' });
    }

    // If the email is unique, add the user to the array
    users.push({ name, email, password });
    console.log(`POST /users endpoint was accessed ${JSON.stringify(users)}`);
    res.status(201).json({ message: 'User registered successfully' });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
