const strongid = require('shortid');
const employee = require('../model/employee');
const lead_form = require('../model/lead');
const service = require('../model/service');
module.exports = {
    add_lead: function (req, res) {
        const lead_data = {
            c_name: req.body.c_name,
            c_id: req.body.c_id,
            c_email: req.body.c_email,
            lead_status: req.body.lead_status
        }
        lead_form.create(lead_data).then(() => {
            const c_id = strongid.generate();
            if (req.session.type == 'admin') {
                res.render('leadform', { c_id })
            }
            else {
                res.send('<h1>you dont have access to thies page</h1>')
            }

        }).catch(err => {
            console.log(err);
        })

    },
    get_leadform: function (req, res) {
        const c_id = strongid.generate();
        const type = req.session.type;
        res.render('leadform', { c_id, type })


    },
    callmanagement: function (req, res) {
        lead_form.find({ lead_status: false }).then((cust) => {

            res.render('callmanage', { cust });

        }).catch((err) => {
            console.log(err);
        })

    },
    updatelead: function (req, res) {
        const lead_data = {
            c_name: req.body.c_name,
            c_id: req.body.c_id,
            c_email: req.body.c_email,
            lead_status: req.body.lead_status
        }

        lead_form.findOneAndUpdate({ c_id: lead_data.c_id }, lead_data, { new: true }, (err, data) => {
            if (err) console.log(err);
            else res.redirect('/emp/lead/callmanagement');
        })
    },
    addreminder: function (req, res) {
        const custid = req.body.cust_id;
        console.log("add remonder  " + custid);
        const rem_data = {
            rem_date: req.body.rem_date,
            rem_time: req.body.rem_time,
            rem_desc: req.body.rem_desc
        }
        console.log(rem_data);
        lead_form.findOneAndUpdate({ c_id: custid }, {
            $push: {
                reminder: {
                    rem_date: rem_data.rem_date,
                    rem_time: rem_data.rem_time,
                    rem_desc: rem_data.rem_desc
                }
            }
        }, { new: true }, (err, data) => {
            console.log(data);
            if (err) console.log(err);
            else res.redirect('/emp/lead/callmanagement')
        })




    },
    calldesc: function (req, res) {
        const custid = req.body.c_id;
        lead_form.findOne({ c_id: custid }).then((customer) => {
            const call = customer.call;
            let c_name = customer.c_name;
            let customer_id = customer.c_id
            res.render('call_desc', { call, c_name, customer_id })

        }).catch(err => {
            if (err) console.log(err);
        })
    },
    callupdate: function (req, res) {

        const custid = req.body.c_id;
        const callid = req.body.call_id;
        const calldate = req.body.call_date
        const calltime = req.body.call_time;
        const calldesc = req.body.call_desc;
        lead_form.findOneAndUpdate({ c_id: custid }, {
            $pull: { call: { _id: callid } }
        }, { new: true }, (err, data) => {
            if (err) console.log(err);
            else if (data) {
                lead_form.findOneAndUpdate({ c_id: custid }, {
                    $push: {
                        call: {
                            call_date: calldate,
                            call_time: calltime,
                            call_desc: calldesc,
                            call_motive: req.body.call_motive
                        }
                    }
                }, { new: true }, (err, data) => {
                    if (err) console.log(err);
                    if (data) {
                        res.redirect('/emp/lead/callmanagement')
                    }
                })
            }

        })




    },
    addcall: function (req, res) {
        const custid = req.body.c_id;
        lead_form.findOneAndUpdate({ c_id: custid }, {
            $push: {
                call: {
                    call_date: req.body.calldate,
                    call_time: req.body.calltime,
                    call_desc: req.body.calldesc,
                    call_motive: req.body.callmotive
                }
            }
        }, { new: true }, (err, data) => {
            if (err) console.log(err);
            if (data) {
                res.redirect('/emp/lead/callmanagement')
            }

        })
    },
    salepage: function (req, res) {

        lead_form.find({ lead_status: true }).then(cust => {
            res.render('salespage', { cust })

        }).catch(err => {
            if (err) console.log(err);

        })
    },
    servicepage: function (req, res) {
        res.render('sericepage')
    },
    servicepost: function (req, res) {

        const servise_data = {
            c_name: req.body.c_name,
            c_email: req.body.c_email,
            c_mobile: req.body.c_mobile,
            pro_name: req.body.pro_name,
            ser_desc: req.body.ser_desc,
            ser_type: req.body.ser_type,
            ser_status: req.body.ser_status
        }
        service.create(servise_data).then((ser) => {
            res.render('sericepage')
        }).catch(err => {
            console.log(err);
        })

    },
    servise_details: function (req, res) {
        service.find().then(ser => {
            res.render('service_table', { ser })

        }).catch(err => {
            if (err) console.log(err);
        })
    },
    login: function (req, res) {
        const username = req.body.username;
        const password = req.body.password;
        req.session.username = username;
        employee.findOne({ emp_name: username }).then(emp => {
            if (emp && emp.password == password) {
                if (emp.type == "employee") {
                    req.session.type = "employee";
                    res.redirect('/emp/');
                }
                if (emp.type == 'admin') {
                    req.session.type = "admin"
                    res.redirect('/dept/')
                }
            }
            else {
                res.redirect('/emp/login')
            }
        }).catch(err => {
            if (err) console.log(err);
        })

    }
}