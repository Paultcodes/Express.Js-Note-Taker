const express = require('express');
const fs = require('fs');
const path = require('path');
var uniqid = require('uniqid');

const PORT = 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      return parsedNotes = res.json(JSON.parse(data));
      
    }
  });
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () =>
  console.log(`Listening at this location http://localhost:${PORT}`)
);
