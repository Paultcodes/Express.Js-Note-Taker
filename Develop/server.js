const express = require('express');
const fs = require('fs');
const path = require('path');
const idRandom = require('./helpers/randomId');

const PORT = 3001;

const app = express();

// Middleware for the application
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

//Route for reading file and parsing the notes data
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      return res.json(JSON.parse(data));
    }
  });
});

//Route for deleting notes. Reads the file, parses the data and finds the note with right ID and then rewrites the file.
app.delete('/api/notes/:id', (req, res) => {
  const deleteNoteId = req.params.id;

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let parsedNotes = JSON.parse(data);
      const indexOfId = parsedNotes.findIndex((obj) => obj.id === deleteNoteId);
      if (indexOfId > -1) {
        parsedNotes.splice(indexOfId, 1);
      }
      fs.writeFile(
        './db/db.json',
        JSON.stringify(parsedNotes, null, 4),
        (err) =>
          err ? console.log(err) : console.log('Data base has been updated')
      );
    }
  });

  res.sendFile('./db/db.json');
});

//Route for creating a new note
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
