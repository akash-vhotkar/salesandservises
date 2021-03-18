const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const depart1 = require('../model/depart1')
const shortid = require('shortid');
const multer = require('multer')
const gridfsstorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const crypto = require('crypto');
const path = require('path')
const departmentController = require('../controller/department');
// file storage


const url = "mongodb+srv://akash:akash1234@cluster0.4ayge.mongodb.net/data1?retryWrites=true&w=majority";
const conn = mongoose.createConnection(url);
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');

})


const storage = new gridfsstorage({
    url: url,
    destination: './public/uploads/',
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }
}).single('file')



router.get('/image/:filename', (req, res) => {

    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (file) {
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        }
    })

})


// post requist of department forms
// add employees
router.post('/:id/addemp', (req, res) => {
    upload(req, res, err => {
        if (err) console.log(err);
        else {
            const filename = req.file.filename;

            departmentController.add_employees(filename, req.params.id, req, res);
        }
    })

})



// add department 
router.post('/adddept', (req, res) => {
    upload(req, res, err => {
        if (err) console.log(err);
        else {
            const filename = req.file.filename;
            departmentController.add_department(req, res, filename);
        }
    })




})




// ger reuist of the department page
router.get('/', (req, res) => {
    departmentController.all_departments(req, res);


})



// get particular department employees
router.get('/getemp/:id', (req, res) => {
    departmentController.get_employees(req.params.id, req, res)


})
// get all department employees

router.get('/getallemp', (req, res) => {
    departmentController.get_all_employees(req, res);
})

// default departments
router.get('/dept1', (req, res) => {
    res.render('dept_employees');

    depart1.find({ emp_dept: 'dept1' }).then(emp => {
        res.send(emp)
    }).catch(err => {
        console.log(err);
    })

})

router.get('/dept2', (req, res) => {

    depart1.find({ emp_dept: 'dept2' }).then(emp => {
        res.send(emp)
    }).catch(err => {
        console.log(err);
    })

})
module.exports = router;
