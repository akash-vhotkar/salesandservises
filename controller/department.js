const strongid = require('shortid');
const departments = require('../model/depart1');
const multer = require('multer');
const multer_gridfs = require('multer-gridfs');
const employees = require('../model/employee');
const multer_st = require('multer-gridfs-storage');
const sendgrid = require('@sendgrid/mail');
const crypt = require('crypto');
const password_generator = require('secure-random-password');
const gridapi = require('../keys').sendgridapi;

module.exports = {
    add_department: function (req, res, filename) {

        if (req.session.type) {
            if (req.session.type == 'admin') {
                departments.findOne({ dept_name: req.body.dept_name }).then(dept => {

                    if (dept) {
                        req.session.err = [{ msg: "department already exist" }]
                        res.redirect('/dept/')

                    }
                    else {

                        departments.findOne({ adminid: req.session.employee_id }).then((admindata) => {


                            const newdepartment = {
                                adminid: admindata.adminid,
                                adminname: admindata.adminname,
                                adminemail: admindata.adminemail,
                                dept_name: req.body.dept_name,
                                dept_desc: req.body.dept_desc,
                                dept_id: req.body.dept_id,
                                dept_image: filename
                            }
                            departments.create(newdepartment).then(() => {

                                const dept_id = strongid.generate();

                                console.log("department was added");
                                res.redirect('/dept/')
                            }).catch(err => {
                                console.log(err);
                            })


                        }).catch(err => {
                            if (err) console.log(err);
                        })

                    }

                }).catch(err => {

                })
            }
            if (req.session.type == 'employee') {
                res.redirect('/emp/')
            }
        }
        else {
            res.redirect('/emp/login')
        }



    },
    all_departments: function (req, res) {
        if (req.session.type) {
            if (req.session.type == 'admin') {
                const adminid = req.session.employee_id;


                if (req.session.err) {
                    departments.find({ adminid: adminid }).then(depts => {
                        const err = req.session.err;
                        req.session.err = null;
                        const dept_id = strongid.generate();
                        res.render('department', { depts, dept_id, err })


                    }).catch(err => {
                        console.log(err);
                    })
                }
                else {
                    departments.find({ adminid: adminid }).then(depts => {
                        const dept_id = strongid.generate();
                        employees.find().then(employee => {
                            const emp = employee;
                            res.render('department', { depts, dept_id, emp })

                        })
                            .catch(err => {
                                console.log(err);
                            })

                    }).catch(err => {
                        console.log(err);
                    })
                }
            }
            if (req.session.type == 'employee') {
                res.send('<h1>you dont have access to thise page</h1>')
            }
        }
        else {
            res.redirect('/emp/login')

        }


    },// http://localhost:1234/dept/GYfeVf-91
    get_employees: function (id, req, res) {
        if (req.session.type) {
            if (req.session.type == 'admin') {
                const emp_id = strongid.generate();
                const dept_id = id;
                departments.findOne({ dept_id: id }).then(depts => {

                    if (depts.emp_dept != null) {
                        let emp = depts.emp_dept;
                        const password = password_generator.randomPassword({ length: 6, characters: [password_generator.lower, password_generator.upper, password_generator.digits] })


                        res.render('dept_employees', { emp, emp_id, dept_id, password })
                    }
                    else {
                        let emp = [];

                        res.render('dept_employees', { emp, emp_id, dept_id, password })
                    }


                }).catch(err => {
                    console.log(err);
                })
            }
        }
        else {
            res.send('<h1>you dont have access to thise page</h1>')
        }



    },
    add_employees: function (filename, id, req, res) {
        if (req.session.type) {

            if (req.session.type == 'admin') {

                departments.findOne({ dept_id: id }).then(data => {
                    const dept_name = data.dept_name;
                    sendgrid.setApiKey(gridapi);
                    const password = password_generator.randomPassword({ length: 6, characters: [password_generator.lower, password_generator.upper, password_generator.digits] })
                    const emp_id = strongid.generate();
                    const emp_data = {
                        adminid: req.session.employee_id,
                        emp_image: filename,
                        password: password,
                        type: req.body.type,
                        emp_name: req.body.emp_name,
                        emp_id: strongid.generate(),
                        emp_email: req.body.emp_email,
                        dept_name: dept_name

                    }
                    departments.findOneAndUpdate({ dept_id: id }, {
                        $push: { emp_dept: emp_data }
                    }, { new: true }, (err, data) => {
                        if (err) console.log(err);
                        else {

                            employees.create(emp_data).then(() => {

                                const emp = data.emp_dept;
                                const emp_id = strongid.generate();
                                const dept_id = id;
                                const message = {
                                    to: emp_data.emp_email,
                                    from: {
                                        name: "hardcipher",
                                        email: "akashvhotkar4@gmail.com"
                                    },
                                    subject: "change password",
                                    html: `<h1>hello ${req.body.emp_name}</h1> <p>welcome in ${dept_name} department</p>  <p> username : ${emp_data.emp_name} </p>  <p>password : ${emp_data.password} </p>  <a href= "http://localhost:1234/emp/login">login and change password</a>`

                                }
                                sendgrid.send(message).then(responsed => {
                                    console.log(responsed);
                                    res.render('dept_employees', { emp, emp_id, dept_id })
                                }).catch(err => {
                                    if (err) console.log(err);
                                })








                            }).catch(err => {
                                console.log(er);
                            })







                        };
                    })

                }).catch((err) => {
                    console.log(err);
                })
            }
        }
        else {
            res.send('<h1>you dont have access to thise page</h1><a href="/emp/login" class="btn btn-primary"> login</a>')
        }




    },
    get_all_employees: function (req, res) {
        if (req.session.type) {
            if (req.session.type == 'admin') {
                employees.find().then(employee => {
                    const emp = employee;
                    res.render('allemployees', { emp });
                })
                    .catch(err => {
                        console.log(err);
                    })

            }
        }


        else {
            res.send('<h1>you dont have access to thise page</h1> <a href="/emp/login" class="btn btn-primary"> login</a>')
        }

    }


}