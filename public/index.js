const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const express = require('express');
const app = express();

app.use(cors);

// Rutas de tu servidor
app.post('/translate', (req, res) => {
  // Lógica de traducción
});

exports.api = functions.https.onRequest(app);
