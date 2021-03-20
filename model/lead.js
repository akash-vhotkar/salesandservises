const mongoose = require('mongoose');
const shema = new mongoose.Schema({
    emp_id: {
        type: String,
        required: true

    },
    c_name: {
        type: String,
        required: false
    },
    c_no: {
        type: String,
        required: false
    },
    c_id: {
        type: String,
        required: false
    },
    c_email: {
        type: String,
        required: false

    }, lead_type: {
        type: String,
        required: false
    }, lead_desc: {
        type: String,
        required: true
    },
    lead_status_string: {
        type: String,
        required: false
    },
    lead_closed_by_emp: {
        type: String,
        required: false
    },

    lead_status: {
        type: Boolean,
        required: true
    }, forworded_to_dept: {
        type: String,
        required: false
    }, forworded_to_emp_name: {
        type: String,
        required: false
    },
    close_desc: {
        type: String,
        required: false
    },
    forworded_to_emp_id: {
        type: String,
        required: false
    },
    reminder: [{
        rem_date: String,
        rem_time: String,
        rem_desc: String
    }],
    call: [{
        call_id: Number,
        call_date: String,
        call_time: String,
        call_desc: String,
        call_motive: String

    }]


})

module.exports = mongoose.model('leads', shema);