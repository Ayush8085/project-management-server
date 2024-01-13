const dotenv = require('dotenv').config();
const express = require('express');

const PORT = process.env.PORT || 5000;

const app = express();


// ------------- TEST ROUTE -------------
app.get('/', (req, res) => {
    res.send('<h1>Test page</h1>');
});

// ------------- LISTENING FROM THE SERVER -------------
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});