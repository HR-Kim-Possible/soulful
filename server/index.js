/* eslint-disable no-loop-func */
const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();
const morgan = require('morgan');
const { getAll } = require('./getAll.js');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
app.use(morgan('tiny'));

app.get('/qa/questions/:id/all/:page', getAll);

app.all('/*', (req, res) => {
  console.log(req);
  axios({
    url: req.url,
    baseURL: 'http://localhost:3000/',
    method: req.method,
    data: req.body,
  })
    .then((response) => {
      res.status(response.status).send(response.data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));
