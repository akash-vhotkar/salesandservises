const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    dept_name: {
        type: String,
        required: true
    },
    dept_id: {
        type: String,
        required: true
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