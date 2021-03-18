const strongid = require('shortid');
const employee = require('../model/employee');
const departmentmodel = require('../model/depart1');
const lead_form = require('../model/lead');
const service = require('../model/service');
module.exports = {
    close_lead: function (req, res, customer_id) {
        departmentmodel.find().then((dept_data) => {
            let alldepartments = [];
            dept_data.forEach(item => {
                alldepartments.push(item.dept_name);
            });
            lead_form.findOne({ c_id: customer_id }).then(data => {
                res.render('closelead', { customer_name: data.c_name, mycustomer_id: data.c_id, customer_mobile: data.c_no, customer_email: data.c_email, alldepts: alldepartments });
            }).catch(err => {
                console.log(err);
            })


        }).catch(err => {
            console.log(err);
        })


    },
    finalcloselead: function (req, res, id) {
        const forworded_department = req.body.forworded_department;
        const employee_working = req.body.employee;
        lead_form.findOneAndUpdate({ c_id: id }, {
            forworded_to: forworded_department,
            employee_working: employee_working,
            lead_status: true,
            lead_type: "successes"
        }, { new: true }, (err, cust) => {
            if (err) console.log(err);
            res.redirect('/emp/lead/callmanagement')
        })

    },

    add_lead: function (req, res) {
        const customer_id = strongid.generate();

        const lead_data = {
            emp_id: req.session.employee_id,
            c_name: req.body.c_name,
            c_no: req.body.c_no,
            c_id: customer_id,
            c_email: req.body.c_email,
            lead_status: false,
            lead_type: req.body.lead_type,
            forworded_to: "nan",
            employee_working: "nan"

        }
        if (req.session.type) {
            lead_form.create(lead_data).then(() => {
                const c_id = strongid.generate();

                res.render('leadform', { c_id, type: "both" })

            }).catch(err => {
                console.log(err);
            })
        }
        else {
            res.redirect('/emp/login')
        }

    },

    get_leadform: function (req, res) {
        const type = req.session.type;
        res.render('leadform', { type })


    },
    callmanagement: function (req, res) {
        const emp_id = req.session.employee_id;
        lead_form.find({ emp_id: emp_id }).then((cust) => {

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
        lead_form.findOne({ c_id: custid }).then(data => {
            let lastid = 879872937;
            data.call.forEach(element => {
                lastid = element.call_id;
            });
            let finallast = parseInt(lastid) + 1;



            lead_form.findOneAndUpdate({ c_id: custid }, {
                $push: {
                    call: {
                        call_id: finallast,
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


        }).catch(err => {
            if (err) console.log(err);
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
                req.session.employee_id = emp.emp_id
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