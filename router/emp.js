const express = require('express');
const router = express.Router();
const employee_controller = require('../controller/employee');
// all post requst empiyees

// leadform generate
router.post('/lead', (req, res) => {
    employee_controller.add_lead(req, res)
})
// call desk page 
router.post('/lead/callmanagement/calldesc', (req, res) => {
    employee_controller.calldesc(req, res);
})
// add call to  call managenment
router.post('/lead/callmanagement/calldesc/addcall', (req, res) => {
    employee_controller.addcall(req, res);
})
router.post('/login', (req, res) => {
    employee_controller.login(req, res);
})
router.post('/lead/servicepage', (req, res) => {
    employee_controller.servicepost(req, res);
})
router.post('/lead/callmanagement/calldesc/callupdate', (req, res) => {
    employee_controller.callupdate(req, res);
})


router.post('/lead/updatecall', (req, res) => {
    employee_controller.updatelead(req, res);
})

router.post('/lead/addreminder', (req, res) => {
    employee_controller.addreminder(req, res);
})


// all ger requst of the page
router.get('/production', (req, res) => {
    res.render('production')
})
router.get('/purchase', (req, res) => {
    res.render('purchase');
})
router.get('/', (req, res) => {
    res.render('employee');
})
router.get('/lead', (req, res) => {
    employee_controller.get_leadform(req, res);
})
router.get('/lead/salespage', (req, res) => {
    employee_controller.salepage(req, res)
})
router.get('/lead/callmanagement', (req, res) => {
    employee_controller.callmanagement(req, res);
})

router.get('/login', (req, res) => {
    res.render('login');
})
router.get('/lead/service', (req, res) => {
    employee_controller.servicepage(req, res);
})
router.get('/register', (req, res) => {
    employee_controller.getregister(req, res);
})


router.get('/lead/service/details', (req, res) => {
    employee_controller.servise_details(req, res);

})



module.exports = router;