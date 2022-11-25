const express = require('express');
const fs = require('fs');
const path = require('path');
const idRandom = require('./helpers/randomId');

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
      return res.json(JSON.parse(data));
    }
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const deleteNoteId = req.params.id;

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let parsedNotes = JSON.parse(data);
      const findId = parsedNotes.findIndex((obj) => obj.id === deleteNoteId);
      if (findId > -1) {
        parsedNotes.splice(findId, 1);
      }
      console.log(parsedNotes);
    }
  });
});

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: randomId(),
    };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNOtes = JSON.parse(data);

        parsedNOtes.push(newNote);

        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNOtes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated notes!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
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
