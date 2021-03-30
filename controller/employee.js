const strongid = require('shortid');
const employee = require('../model/employee');
const departmentmodel = require('../model/depart1');
const lead_form = require('../model/lead');
const service = require('../model/service');

const sendgrid = require('@sendgrid/mail');
const gridapi = require('../keys').sendgridapi;


module.exports = {
    logout: function (req, res) {
        req.session = null;
        res.redirect('/emp/login')
    },
    getcloseleads: function (req, res) {
        if (req.session.employee_id) {
            const emp_id = req.session.employee_id;
            console.log(emp_id);
            lead_form.find({ forworded_to_emp_id: emp_id, lead_status: true }).then(cust => {
                console.log(cust);
                res.render("completedleads", { cust })

            }).catch(err => {
                console.log(err);
            })
        }
        else {
            const alertmessages = [];
            alertmessages.push({ msg: "please login " });
            res.render('login', { alertmessages })
        }
    },
    closelead: function (req, res) {
        if (req.session.employee_id) {
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
        }
        else {
            const alertmessages = [];
            alertmessages.push({ msg: "please login" });
            res.render('login', { alertmessages })


        }
    },
    gethodassignleads: function (req, res, id) {
        lead_form.findOne({ c_id: id }).then(leaddata => {
            const department = leaddata.forworded_to_dept;
            employee.find({ dept_name: department }).then(allemp => {
                const mycustomer_id = leaddata.c_id;
                const customer_name = leaddata.c_name;
                const customer_email = leaddata.c_email;
                const customer_mobile = leaddata.c_no;
                res.render('hodassignleads', { allemp, mycustomer_id, customer_email, customer_mobile, customer_name })

            }).catch(err => {
                if (err) console.log(err);
            })



        }).catch(err => {
            if (err) console.log(err);
        })

    },
    hodassigntoemployee: function (req, res, customerid) {
        const emp_id = req.body.employee;
        console.log(emp_id);
        employee.findOne({ emp_id: emp_id }).then(employeedata => {
            console.log("empoyee data", employeedata);
            lead_form.findOneAndUpdate({ c_id: customerid }, {
                forworded_to_emp_id: emp_id,
                forworded_to_emp_name: employeedata.emp_name,
                lead_status_string: "assigned"
            }, { new: true }, (err, data) => {
                if (err) console.log(err);
                if (data) res.redirect('/emp/hodcallmanagement')

            })

        }).catch(err => {
            if (err) console.log(err);
        })
    },
    gethoddashboard: function (req, res) {
        if (req.session.employee_id && req.session.type == "hod") {
            employee.findOne({ emp_id: req.session.employee_id }).then((employeedata) => {
                let pendingtoassign = {};
                let closedleads = {};
                let productionleads = {};
                let emp = [];
                lead_form.find({ forworded_to_dept: employeedata.dept_name, lead_status: true }).then(leadsdata => {
                    closedleads = leadsdata;
                    lead_form.find({ forworded_to_dept: employeedata.dept_name, lead_status: false, lead_status_string: "assigned" }).then(leadsdata2 => {
                        productionleads = leadsdata2;
                        employee.find({ dept_name: employeedata.dept_name }).then(depttotalemployees => {
                            emp = depttotalemployees;

                            lead_form.find({ forworded_to_dept: employeedata.dept_name, lead_status: false, lead_status_string: "Pending" }).then(leadsdata3 => {
                                pendingtoassign = leadsdata3;
                                res.render("hoddashboard", { emp, closedleads, productionleads, pendingtoassign })



                            }).catch(err => {
                                if (err) console.log(err);
                            })



                        }).catch(err => {
                            if (err) console.log(err);
                        })

                    }).catch(err => {
                        if (err) console.log(err);
                    })
                }).catch(err => {
                    if (err) console.log(err);
                })


            }).catch(err => {
                if (err) console.log(err);
            })

        }
        else {

        }

    },
    getchangepassword: function (req, res, id) {
        if (req.session.employee_id) {
            employee.findOne({ emp_id: id }).then((data) => {
                const emp_id = data.emp_id;
                res.render('changepassword', { emp_id })

            }).catch(err => {
                if (err) console.log(err);
            })
        }
        else {

            const alertmessages = [];
            alertmessages.push({ msg: "please login" });
            res.render('login', { alertmessages })
        }

    },
    changepassword: function (req, res, id) {
        if (req.session.employee_id) {
            const emp_id = id;
            if (req.body.password != req.body.confirm_password) {
                const alertmessages = [];
                alertmessages.push({ msg: "new password and confirm password does not match" });

                res.render('changepassword', { emp_id, alertmessages })
            }
            else {

                employee.findOneAndUpdate({ emp_id: id }, {
                    password: req.body.password
                }, { new: true }, (err, data) => {
                    if (err) console.log(err);
                    if (data) {
                        const alertmessages = [];
                        alertmessages.push({ msg: "password changed successfully" });

                        res.render('changepassword', { emp_id, alertmessages })
                    }
                })
            }
        }

        else {

            const alertmessages = [];
            alertmessages.push({ msg: "please login" });
            res.render('login', { alertmessages })
        }
    },
    forward_lead: function (req, res, customer_id) {
        console.log("thise is customer id   ", customer_id);
        if (req.session.employee_id) {
            employee.findOne({ emp_id: req.session.employee_id }).then((employeedata) => {

                departmentmodel.find({ adminid: employeedata.adminid }).then((dept_data) => {
                    lead_form.findOne({ c_id: customer_id }).then(data => {
                        console.log("thise is data ", data);
                        res.render('receptionassignlead', { customer_name: data.c_name, mycustomer_id: data.c_id, customer_mobile: data.c_no, customer_email: data.c_email, alldepts: dept_data });
                    }).catch(err => {
                        console.log(err);
                    })
                }).catch(err => {
                    console.log(err);
                })

            }).catch(err => {
                if (err) console.log(err);
            })
        }
        else {

            const alertmessages = [];
            alertmessages.push({ msg: "please login" });
            res.render('login', { alertmessages })
        }
    },
    finalforwordlead: function (req, res, id) {
        if (req.session.employee_id) {
            let copy = {};
            const deptid = req.body.forworded_department;

            departmentmodel.findById(deptid).then(data => {
                lead_form.findOneAndUpdate({ c_id: id }, {
                    forworded_to_dept: data.dept_name,
                    forworded_to_emp_name: "nan",
                    lead_status: false,
                    lead_status_string: "Pending"
                }, { new: true }, (err, cust) => {
                    if (err) console.log(err);
                    if (cust) {
                        sendgrid.setApiKey(gridapi);

                        res.redirect('/emp/lead/callmanagement')



                    }

                })




            }).catch(err => {
                if (err) console.log(err);
            })
        }
        else {

            const alertmessages = [];
            alertmessages.push({ msg: "please login" });
            res.render('login', { alertmessages })
        }



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
        if (req.session.employee_id) {
            const type = req.session.type;
            res.render('leadform', { type })
        }
        else {

            const alertmessages = [];
            alertmessages.push({ msg: "please login" });
            res.render('login', { alertmessages })
        }
    },
    callmanagement: function (req, res) {
        if (req.session.employee_id) {
            const emp_id = req.session.employee_id;
            if (req.session.type === "employee") {
                lead_form.find({ forworded_to_emp_id: emp_id, lead_status: false }).then((cust) => {


                    res.render('employeecallmanagement', { cust, emp_id });

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
        }
        else {

            const alertmessages = [];
            alertmessages.push({ msg: "please login" });
            res.render('login', { alertmessages })
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
    registeradmin: function (req, res) {
        if (req.body.password != req.body.confirm_password) {
            let alertmessages = [];
            alertmessages.push({ msg: " password and correct password does not match" })
            res.render('register', { alertmessages })
        }
        else {
            const adminid = strongid.generate();
            const admindata = {
                adminid: adminid,
                adminname: req.body.adminusername,
                adminemail: req.body.adminemail

            }
            const adminasemployee = {
                adminid: adminid,
                emp_id: adminid,
                emp_name: req.body.adminusername,
                emp_email: req.body.adminemail,
                password: req.body.password,
                type: "admin"
            }
            departmentmodel.create(admindata).then(() => {
                employee.create(adminasemployee).then(() => {
                    res.redirect('/dept/')

                }).catch(err => {
                    if (err) console.log(err);
                })
            }).catch(err => {
                console.log(err);
            })
        }
    },
    login: function (req, res) {
        const username = req.body.username;
        const password = req.body.password;
        req.session.username = username;
        employee.findOne({ emp_name: username }).then(emp => {
            if (emp) {
                if (emp.password == password) {
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
                    if (emp.type == 'hod') {
                        req.session.type = 'hod';
                        res.redirect('/emp/hodcallmanagement')
                    }
                }
                else {
                    const alertmessages = [];
                    alertmessages.push({ msg: "please enter correct password" });
                    res.render('login', { alertmessages })
                }
            }
            else {
                const alertmessages = [];
                alertmessages.push({ msg: "username does not extist contact admin" });
                res.render('login', { alertmessages })


            }
        }).catch(err => {
            if (err) console.log(err);
        })

    }
}