const strongid = require('shortid');
const employee = require('../model/employee');
const departmentmodel = require('../model/depart1');
const lead_form = require('../model/lead');
const service = require('../model/service');
module.exports = {
    logout: function (req, res) {
        req.session = null;
        res.redirect('/emp/login')
    },
    getcloseleads: function (req, res) {
        const emp_id = req.session.employee_id;
        console.log(emp_id);
        lead_form.find({ forworded_to_emp_id: emp_id, lead_status: true }).then(cust => {
            console.log(cust);
            res.render("completedleads", { cust })

        }).catch(err => {
            console.log(err);
        })
    },
    closelead: function (req, res) {
        const customerid = req.body.c_id;
        const closedby = req.session.employee_id;
        console.log("lead close by emp");
        lead_form.findOneAndUpdate({ c_id: customerid }, {
            lead_status: true,
            lead_status_string: "closed",
            lead_closed_by_emp: closedby,
            close_desc: req.body.call_desc
        }, { new: true }, (err, data) => {
            if (err) console.log(err);
            else {
                res.redirect('/emp/lead/callmanagement')

            }
        })
    },
    getchangepassword: function (req, res, id) {
        employee.findOne({ emp_id: id }).then((data) => {
            const emp_id = data.emp_id;
            res.render('changepassword', { emp_id })

        }).catch(err => {
            if (err) console.log(err);
        })

    },
    changepassword: function (req, res, id) {
        employee.findOneAndUpdate({ emp_id: id }, {
            password: req.body.password
        }, { new: true }, (err, data) => {
            if (err) console.log(err);
            if (data) {
                res.redirect('/emp/login')
            }
        })
    },
    forward_lead: function (req, res, customer_id) {
        departmentmodel.find().then((dept_data) => {
            lead_form.findOne({ c_id: customer_id }).then(data => {
                res.render('assignlead', { customer_name: data.c_name, mycustomer_id: data.c_id, customer_mobile: data.c_no, customer_email: data.c_email, alldepts: dept_data });
            }).catch(err => {
                console.log(err);
            })

        }).catch(err => {
            console.log(err);
        })
    },
    finalforwordlead: function (req, res, id) {
        let copy = {};
        const deptid = req.body.forworded_department;
        const employee_working_id = req.body.employee;

        departmentmodel.findById(deptid).then(data => {
            employee.findOne({ emp_id: employee_working_id }).then(employeedata => {
                lead_form.findOneAndUpdate({ c_id: id }, {
                    forworded_to_dept: data.dept_name,
                    forworded_to_emp_name: employeedata.emp_name,
                    lead_status: false,
                    lead_status_string: "assigned",
                    forworded_to_emp_id: employee_working_id
                }, { new: true }, (err, cust) => {
                    if (err) console.log(err);
                    if (cust) res.redirect('/emp/lead/callmanagement')


                })


            }).catch(err => {
                if (err) console.log(err);
            })


        }).catch(err => {
            if (err) console.log(err);
        })



    },
    get_dept_id: async function (req, res, deptid) {
        try {
            const data = await departmentmodel.findById(deptid);
            console.log(data);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
        }
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
            lead_desc: req.body.lead_desc,
            lead_type: req.body.lead_type,
            forworded_to_dept: "nan",
            forworded_to_emp_name: "nan",
            lead_status_string: "Pending"

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
        if (req.session.type === "employee") {
            lead_form.find({ forworded_to_emp_id: emp_id, lead_status: false }).then((cust) => {

                res.render('employeecallmanagement', { cust });

            }).catch((err) => {
                console.log(err);
            })

        }
        else {
            lead_form.find({ emp_id: emp_id, lead_status: false }).then((cust) => {

                res.render('callmanage', { cust });

            }).catch((err) => {
                console.log(err);
            })
        }

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
                    res.redirect('/emp/lead/callmanagement');
                }
                if (emp.type == 'admin') {
                    req.session.type = "admin"
                    res.redirect('/dept/')
                }
                if (emp.type == "reception") {
                    req.session.type = "reception";
                    res.redirect('/emp/lead/')
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