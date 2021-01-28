const express = require('express');
const router = express.Router();
const employee_controller = require('../controller/employee');
router.get('/', (req, res) => {
    res.render('employee');
})
router.get('/lead', (req, res) => {
    employee_controller.get_leadform(req, res);
})
router.post('/lead', (req, res) => {
    employee_controller.add_lead(req, res)
})
router.get('/lead/salespage', (req, res) => {
    employee_controller.salepage(req, res)
})
router.get('/lead/callmanagement', (req, res) => {
    employee_controller.callmanagement(req, res);
})
router.post('/lead/callmanagement/calldesc', (req, res) => {
    employee_controller.calldesc(req, res);
})
router.post('/lead/callmanagement/calldesc/addcall', (req, res) => {
    employee_controller.addcall(req, res);
})
router.get('/lead/service', (req, res) => {
    employee_controller.servicepage(req, res);

})
router.get('/lead/service/details', (req, res) => {
    employee_controller.servise_details(req, res);

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
module.exports = router;