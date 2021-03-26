const mongoose = require('mongoose');
const empschema = new mongoose.Schema({
    adminid: {
        type: String,
        required: true
    },
    emp_name: {
        type: String,
        required: true
    },
    emp_id: {
        type: String,
        required: true
    },
    emp_email: {
        type: String,
        required: true
    },
    emp_image: {
        type: String,
        require: false
    },
    dept_name: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    myleads: [
        String
    ]

})
module.exports = mongoose.model('employee', empschema);