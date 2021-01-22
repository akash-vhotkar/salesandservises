const mongoose = require('mongoose');
const empschema = mongoose.Schema({
    employeename: {
        type: String,
        required: true
    },
    employeeId: {
        type: String,
        required: true
    },
    employeeEmail: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    lead: [{
        customername: String,
        customerId: String,
        customeremail: String

    }]
})
module.exports = mongoose.model('employee', empschema);