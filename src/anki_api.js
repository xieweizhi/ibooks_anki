const fetch = require('node-fetch');

let anki = {};

anki.createNote = async function createNote(note) {
  return request('POST', note);
}

async function request(method, params) {
  let response = await fetch('http://127.0.0.1:8765', {
    method: method,
    body: JSON.stringify(params),
    headers: { 'Content-Type': 'application/json' }
  });

  let json = await response.json();
  return json;
}

module.exports = anki;