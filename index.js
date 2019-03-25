'use strict'
const timeSpan = require('./app/dateUtils.js').timeSpan;
const dateUtils = require('./app/dateUtils.js').dateUtils;
const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000

function capitalize (str) {
  const firstLetter = str.charAt(0) // we can check what's inside here
  return `${firstLetter.toUpperCase()}${str.slice(1)}`
};

app.get('/name', (req, res) => {
    console.log("ell" + req.baseUrl);
});



app.listen(PORT, () => console.log(`App listening on *:${PORT}`))
