const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    emp_name: {
        type: String,
        required: true
    },
    emp_email: {
        type: String,
        required: true
    },
    emp_id: {
        type: String,
        required: true
    },
    emp_dept: {
        type: String,
        required: false
    }
})
module.exports = mongoose.model('dept1', schema);