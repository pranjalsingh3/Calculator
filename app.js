const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const PORT = 3040;

const mongoUrl = process.env.MONGO_URL || "mongodb+srv://admin:password1234@cluster.3uxvwkt.mongodb.net/?retryWrites=true&w=majority";
let db;

MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        db = client.db('cloud');  // Use the 'cloud' database
        console.log('Connected to MongoDB Atlas');
    })
    .catch(error => console.error(error));

app.use(express.json());  // Middleware to parse JSON

app.get('/', function(req, res){
    res.sendFile(__dirname + '/calculator.html');
});

// Insert data into MongoDB
app.post('/insert', (req, res) => {
    const { num1, num2, operation, result } = req.body;
    if (!isValid(num1) || !isValid(num2) || !operation || !isValid(result)) {
        return res.status(400).json({ error: 'Invalid data' });
    }

    const document = {
        num1: parseFloat(num1),
        num2: parseFloat(num2),
        operation,
        result: parseFloat(result),
        timestamp: new Date()
    };

    db.collection('data').insertOne(document, (err, result) => {  // Use 'data' collection
        if (err) {
            return res.status(500).json({ error: 'Failed to insert document' });
        }
        res.json({ success: 'Document inserted', documentId: result.insertedId });
    });
});

// Retrieve data from MongoDB
app.get('/retrieve', (req, res) => {
    db.collection('data').find().toArray((err, documents) => {  // Use 'data' collection
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve documents' });
        }
        res.json(documents);
    });
});

// Helper function to check if input is a valid number
function isValid(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

// API endpoints for calculator operations
app.get('/add', (req, res) => {
    const { num1, num2 } = req.query;
    if (!isValid(num1) || !isValid(num2)) {
        return res.status(400).json({ error: 'Parameters must be valid numbers' });
    }
    const result = parseFloat(num1) + parseFloat(num2);
    res.json({ result });

    // Insert the calculation into MongoDB
    db.collection('data').insertOne({ num1: parseFloat(num1), num2: parseFloat(num2), operation: 'add', result, timestamp: new Date() });
});

app.get('/subtract', (req, res) => {
    const { num1, num2 } = req.query;
    if (!isValid(num1) || !isValid(num2)) {
        return res.status(400).json({ error: 'Parameters must be valid numbers' });
    }
    const result = parseFloat(num1) - parseFloat(num2);
    res.json({ result });

    // Insert the calculation into MongoDB
    db.collection('data').insertOne({ num1: parseFloat(num1), num2: parseFloat(num2), operation: 'subtract', result, timestamp: new Date() });
});

app.get('/multiply', (req, res) => {
    const { num1, num2 } = req.query;
    if (!isValid(num1) || !isValid(num2)) {
        return res.status(400).json({ error: 'Parameters must be valid numbers' });
    }
    const result = parseFloat(num1) * parseFloat(num2);
    res.json({ result });

    // Insert the calculation into MongoDB
    db.collection('data').insertOne({ num1: parseFloat(num1), num2: parseFloat(num2), operation: 'multiply', result, timestamp: new Date() });
});

app.get('/divide', (req, res) => {
    const { num1, num2 } = req.query;
    if (!isValid(num1) || !isValid(num2)) {
        return res.status(400).json({ error: 'Parameters must be valid numbers' });
    }
    const result = parseFloat(num1) / parseFloat(num2);
    res.json({ result });

    // Insert the calculation into MongoDB
    db.collection('data').insertOne({ num1: parseFloat(num1), num2: parseFloat(num2), operation: 'divide', result, timestamp: new Date() });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
