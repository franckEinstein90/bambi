'use strict'
const express = require('express')
const app = express()
const html_dir = './public/';

const PORT = process.env.PORT || 3000

app.get('/name', (req, res) => {
    console.log("ell" + req.baseUrl);
    res.sendfile(html_dir + 'index.html');
});



app.listen(PORT, () => console.log(`App listening on *:${PORT}`))
