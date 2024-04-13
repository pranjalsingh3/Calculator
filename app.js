const express = require("express");
const app = express();
const PORT = 3040;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/calculator.html');
});

// API endpoints
app.get('/add', (req, res) => {
    const { num1, num2 } = req.query;
    if (!isValid(num1) || !isValid(num2)) {
        return res.status(400).json({ error: 'Parameters must be valid numbers' });
    }
    const result = parseFloat(num1) + parseFloat(num2);
    res.json({ result });
});

app.get('/subtract', (req, res) => {
    const { num1, num2 } = req.query;
    if (!isValid(num1) || !isValid(num2)) {
        return res.status(400).json({ error: 'Parameters must be valid numbers' });
    }
    const result = parseFloat(num1) - parseFloat(num2);
    res.json({ result });
});

app.get('/multiply', (req, res) => {
    const { num1, num2 } = req.query;
    if (!isValid(num1) || !isValid(num2)) {
        return res.status(400).json({ error: 'Parameters must be valid numbers' });
    }
    const result = parseFloat(num1) * parseFloat(num2);
    res.json({ result });
});

app.get('/divide', (req, res) => {
    const { num1, num2 } = req.query;
    if (!isValid(num1) || !isValid(num2)) {
        return res.status(400).json({ error: 'Parameters must be valid numbers' });
    }
    
    const result = parseFloat(num1) / parseFloat(num2);
    res.json({ result });
});

// Helper function to check if input is a valid number
function isValid(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
