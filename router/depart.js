const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const depart1 = require('../model/depart1')
const shortid = require('shortid');



router.get('/', (req, res) => {
    const dept_controller = require('../controller/department');
    dept_controller.all_departments(req, res);


})

router.post('/adddept', (req, res) => {
    const depart_con = require('../controller/department');
    depart_con.add_department(req, res);
})



router.get('/getemp/:id', (req, res) => {
    const constroller_dept = require('../controller/department');
    constroller_dept.get_employees(req.params.id, res)


})

router.post('/:id/addemp', (req, res) => {
    const controler = require('../controller/department');
    controler.add_employees(req.params.id, req, res);
})

router.get('/getallemp', (req, res) => {
    const controller = require('../controller/department');
    controller.get_all_employees(req, res);
})


router.get('/dept1', (req, res) => {
    res.render('dept_employees');

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
