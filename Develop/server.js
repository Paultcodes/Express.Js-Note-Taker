const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
  });

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});


app.listen(PORT, () =>
  console.log(`Listening at this location http://localhost:${PORT}`)
);
