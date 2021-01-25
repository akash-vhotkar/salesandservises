const strongid = require('shortid');
const departments = require('../model/depart1');
const multer = require('multer');
const multer_gridfs = require('multer-gridfs');
const employees = require('../model/employee');
const multer_st = require('multer-gridfs-storage');
const crypt = require('crypto');
module.exports = {
    add_department: function (req, res) {
        departments.findOne({ dept_name: req.body.dept_name }).then(dept => {

            if (dept) {
                req.session.err = [{ msg: "department already exist" }]
                res.redirect('/dept/')

            }
            else {
                const newdepartment = {
                    dept_name: req.body.dept_name,
                    dept_desc: req.body.dept_desc,
                    dept_id: req.body.dept_id
                }
                departments.create(newdepartment).then(() => {

                    const dept_id = strongid.generate();

                    console.log("department was added");
                    res.redirect('/dept/')
                }).catch(err => {
                    console.log(err);
                })

            }

        }).catch(err => {

        })



    },
    all_departments: function (req, res) {
        if (req.session.err) {
            departments.find().then(depts => {
                const err = req.session.err;
                req.session.err = null;

                const dept_id = strongid.generate();
                res.render('department', { depts, dept_id, err })


            }).catch(err => {
                console.log(err);
            })
        }
        else {
            departments.find().then(depts => {
                const dept_id = strongid.generate();
                res.render('department', { depts, dept_id })

            }).catch(err => {
                console.log(err);
            })



        }


    },// http://localhost:1234/dept/GYfeVf-91
    get_employees: function (id, res) {
        const emp_id = strongid.generate();
        const dept_id = id;

        departments.findOne({ dept_id: id }).then(depts => {

            if (depts.emp_dept != null) {
                let emp = depts.emp_dept;

                res.render('dept_employees', { emp, emp_id, dept_id })
            }
            else {
                let emp = [];

                res.render('dept_employees', { emp, emp_id, dept_id })
            }


        }).catch(err => {
            console.log(err);
        })

    },
    add_employees: function (id, req, res) {
        const emp_id = strongid.generate();
        const emp_data = {
            emp_name: req.body.emp_name,
            emp_id: req.body.emp_id,
            emp_email: req.body.emp_email,
            cop_name: req.body.cop_name

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
                    res.render('dept_employees', { emp, emp_id, dept_id })

                }).catch(err => {
                    console.log(err);
                })






            };
        })






    },
    get_all_employees: function (req, res) {
        employees.find().then(employee => {
            const emp = employee;
            res.render('allemployees', { emp });
        })
            .catch(err => {
                console.log(err);
            })

    }




}