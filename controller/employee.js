const strongid = require('shortid');
const lead_form = require('../model/lead');
module.exports = {
    add_lead: function (req, res) {
        const lead_data = {
            c_name: req.body.c_name,
            c_id: req.body.c_id,
            c_email: req.body.c_email,
            lead_status: req.body.lead_status
        }
        lead_form.create(lead_data).then(() => {
            const c_id = strongid.generate();
            res.render('leadform', { c_id })

        }).catch(err => {
            console.log(err);
        })

    },
    get_leadform: function (req, res) {
        const c_id = strongid.generate();
        res.render('leadform', { c_id })
    },
    callmanagement: function (req, res) {
        lead_form.find().then((cust) => {

            res.render('callmanage', { cust });

        }).catch((err) => {
            console.log(err);
        })

    },
    updatelead: function (req, res) {
        const lead_data = {
            c_name: req.body.c_name,
            c_id: req.body.c_id,
            c_email: req.body.c_email,
            lead_status: req.body.lead_status
        }

        lead_form.findOneAndUpdate({ c_id: lead_data.c_id }, lead_data, { new: true }, (err, data) => {
            if (err) console.log(err);
            else res.redirect('/emp/lead/callmanagement');
        })
    },
    addreminder: function (req, res) {
        const custid = req.body.cust_id;
        console.log("add remonder  " + custid);
        const rem_data = {
            rem_date: req.body.rem_date,
            rem_time: req.body.rem_time,
            rem_desc: req.body.rem_desc
        }
        console.log(rem_data);
        lead_form.findOneAndUpdate({ c_id: custid }, {
            $push: {
                reminder: {
                    rem_date: rem_data.rem_date,
                    rem_time: rem_data.rem_time,
                    rem_desc: rem_data.rem_desc
                }
            }
        }, { new: true }, (err, data) => {
            console.log(data);
            if (err) console.log(err);
            else res.redirect('/emp/lead/callmanagement')
        })




    },
    calldesc: function (req, res) {
        const custid = req.body.c_id;
        lead_form.findOne({ c_id: custid }).then((customer) => {
            const rem = customer.reminder;
            let c_name = customer.c_name;
            let customer_id = customer.c_id
            res.render('call_desc', { rem, c_name, customer_id })

        }).catch(err => {
            if (err) console.log(err);
        })
    },
    callupdate: function (req, res) {

        const custid = req.body.c_id;
        const callid = req.body.call_id;
        const calldate = req.body.call_date
        const calltime = req.body.call_time;
        const calldesc = req.body.call_desc;
        lead_form.findOneAndUpdate({ c_id: custid, 'reminder._id': callid }, {
            $set: {
                'reminder.rem_date': calldate,
                'reminder.rem_time': calltime,
                'reminder.rem_desc': calldesc
            }
        })

        res.redirect('/emp/lead/callmanagement')


    }
}