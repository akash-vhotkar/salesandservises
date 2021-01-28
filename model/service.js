const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    c_name: {
        type: String,
        required: true
    },
    c_mobile: {
        type: String,
        required: false
    },
    c_email: {
        type: String,
        required: true
    },
    pro_name: {
        type: String,
        required: false
    },
    ser_type: {
        type: String,
        required: false
    },
    ser_status: {
        type: String,
        required: false
    },
    ser_desc: {
        type: String,
        required: false
    }

})

module.exports = mongoose.model('service', schema)