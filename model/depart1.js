const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    adminid: {
        type: String,
        required: false

    },
    adminname: {
        type: String,
        required: false
    },
    adminemail: {
        type: String,
        required: false
    },
    hodid: {
        type: String,
        required: false
    },
    hodname: {
        type: String,
        required: false
    },
    hodemail: {
        type: String,
        required: false
    },
    dept_name: {
        type: String,
        required: false
    },
    dept_id: {
        type: String,
        required: false
    }, dept_desc: {
        type: String,
        required: false
    },
    emp_dept: [{
        emp_name: String,
        emp_id: String,
        password: String,
        emp_email: String,
        cop_name: String
    }],
    dept_image: {
        type: String,
        required: false
    }
})
module.exports = mongoose.model('dept1', schema);