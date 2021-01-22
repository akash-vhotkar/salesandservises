const express = require('express');
const app = express();
const mongoose = require('mongoose');
const body_parser = require('body-parser');
const ejs = require('ejs');
const sortid = require('shortid');
const URl = require('./keys').URl;
const shortid = require('shortid');

app.use(body_parser.urlencoded({ extended: true }))
app.set('view engine', "ejs");

mongoose.connect(URl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("database connected")).catch(err => { console.log(err); })

app.use('/dept', require('./controller/depart'))
app.use('/emp', require('./controller/emp'));
const port = process.env.PORT || 3000;
app.listen(port, err => {
    if (err) console.log(err);
    console.log("server running on 3000");
})