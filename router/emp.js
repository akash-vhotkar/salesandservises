const { Router } = require('express');
const express = require('express');
const employee = require('../controller/employee');
const router = express.Router();
const employee_controller = require('../controller/employee');
// all post requst empiyees
router.post('/lead/hodassign/assign/:mycustomer_id', (req, res) => {
    employee_controller.hodassigntoemployee(req, res, req.params.mycustomer_id);
})
router.get('/logout', (req, res) => {
    employee_controller.logout(req, res);

})
router.get('/register', (req, res) => {
    res.render('register');
})
router.post('/register', (req, res) => {
    employee_controller.registeradmin(req, res);
})
router.get('/lead/assign/:id', (req, res) => {
    employee_controller.forward_lead(req, res, req.params.id);
})
router.post('/lead/callmanagement/close', (req, res) => {
    employee_controller.closelead(req, res);
})
router.get('/lead/callmanagement/closeleads', (req, res) => {
    employee_controller.getcloseleads(req, res);
})
router.get('/lead/hodassign/:id', (req, res) => {
    employee_controller.gethodassignleads(req, res, req.params.id);
})
router.get('/hodcallmanagement', (req, res) => {
    employee_controller.gethoddashboard(req, res);
})

router.get('/changepassword/:id', (req, res) => {

    employee_controller.getchangepassword(req, res, req.params.id);
})

router.post('/changepassword/:id', (req, res) => {

    employee_controller.changepassword(req, res, req.params.id);
})

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

router.post('/lead/getdeptbyid', (req, res) => {
    employee_controller.get_dept_id(req, res, req.body.id);
})
router.post('/lead/assign/:id/assign', (req, res) => {
    employee_controller.finalforwordlead(req, res, req.params.id);

})


router.get('/lead/service/details', (req, res) => {
    employee_controller.servise_details(req, res);

})



module.exports = router;