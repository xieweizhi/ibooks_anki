const ibooks = require('ibooks-highlights');
const spawn = require('child_process').spawn;
const anki = require('./anki_api');

Red = "\x1b[31m";
Green = "\x1b[32m";

async function getWords() {
  let words = await ibooks.getAnnotations()
  return words
    .filter(w => w.selectedText.length < 15);  // only accept word. (I know REGEX! Maybe next time)
}

async function translatewords() {
  let words = await getWords();
  for (w of words) {
    translate(w);
  }
}

function translate(note) {
  let { selectedText: word, book: { title, author } } = note;
  const pythonProcess = spawn('python3', ["./src/dictionary.py", word.trim()]);

  pythonProcess.stdout.on('data', (data) => {
    let result = data.toString();
    anki.createNote(
      {
        "action": "addNote",
        "version": 6,
        "params": {
          "note": {
            "deckName": "ibooks_highlighted",
            "modelName": "Basic",
            "fields": {
              "Front": word,
              "Back": result
            },
            "options": {
              "allowDuplicate": false,
              "duplicateScope": "deck"
            },
            "tags": [
              "ibooks_highlighted",
              title.split(' ').join('_')
            ]
          }
        }
      })
      .then(result => {
        if (result.error != null) {

          console.log(Red, `${word} added to anki failed, error: ${result.error}`);
        } else if (result.result != null) {
          console.log(Green, `(${word} added to anki)`);
        }
      });
  });

  pythonProcess.stdout.on('error', (err) => {
    console.log(`error translate: ${word}, ${err}`);
  });
}

translatewords();