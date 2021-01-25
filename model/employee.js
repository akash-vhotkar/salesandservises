const mongoose = require('mongoose');
const empschema = new mongoose.Schema({
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
    cop_name: {
        type: String,
        required: false
    }

})
module.exports = mongoose.model('employee', empschema);