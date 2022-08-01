/* eslint-disable no-loop-func */
const express = require('express');
const path = require('path');
require('dotenv').config();

const { getAll } = require('./getAll.js');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.get('/test', (req, res) => {
  res.send('it works');
});
app.get('/qa/questions/:id/all/:page', getAll);

app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));
