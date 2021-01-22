const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const depart1 = require('../model/depart1')

const shortid = require('shortid');
router.get('/', (req, res) => {
    const emp_id = shortid.generate();
    res.render('department', { emp_id })
})

router.post('/addemp', (req, res) => {

    const data = {
        emp_name: req.body.emp_name,
        emp_id: req.body.emp_id,
        emp_email: req.body.emp_email,
        emp_dept: req.body.emp_dept
    }

    depart1.create(data).then(() => {

        console.log("data inserted");
        const emp_id = shortid.generate();
        res.render('department', { emp_id })
    }).catch(err => {
        console.log(err);
    })



})
router.get('/dept1', (req, res) => {

    depart1.find({ emp_dept: 'dept1' }).then(emp => {
        res.send(emp)
    }).catch(err => {
        console.log(err);
    })

})

router.get('/dept2', (req, res) => {

    depart1.find({ emp_dept: 'dept2' }).then(emp => {
        res.send(emp)
    }).catch(err => {
        console.log(err);
    })

})
module.exports = router;
