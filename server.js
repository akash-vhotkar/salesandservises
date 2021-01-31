const express = require('express');
const app = express();
const mongoose = require('mongoose');
const body_parser = require('body-parser');
const ejs = require('ejs');
const session = require('express-session');
const sortid = require('shortid');
const URl = require('./keys').URl;
const shortid = require('shortid');

app.use(body_parser.urlencoded({ extended: true }))
app.set('view engine', "ejs");
mongoose.set('useFindAndModify', false)

mongoose.connect(URl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("database connected")).catch(err => { console.log(err); })
app.use(session({
    secret: "secreat",
    resave: true,
    saveUninitialized: false
}))
app.use('/dept', require('./router/depart'))
app.use('/emp', require('./router/emp'));
const port = process.env.PORT || 1234;
app.listen(port, err => {
    if (err) console.log(err);
    console.log("server running on 1234");
})