const express = require('express')
const model = require('../models')
const router = express.Router()

router.use((req, res, next) => {
    if (req.session.hasLogin) {
        next()
    } else {
        res.redirect('/login')
    }
})

router.get('/', (req, res)=>{
    model.Student.findAll({ order: [['id', 'ASC']]})
    .then(student=>{
        // res.send(student[0].getFullName())
        res.render('student/student', {data:student, pageTitle: 'STUDENT PAGE', session:req.session})
    })
    .catch(err=>{
        res.send(err)
    })
})

// ADD SUBJECT TO STUDENT
router.get('/:id/addsubject/', (req, res)=>{
    model.Student.findById(req.params.id)
    .then(student=>{
        // res.send(student)
        // console.log(student);
        model.Subject.findAll()
        .then(subjects=>{
            res.render('student/addsubject', { data: student, subs: subjects, pageTitle: 'ADD SUBJECT TO STUDENT', session: req.session})
        })
    })
    .catch(err=>{
        res.send(err)
    })
})

router.post('/:id/addsubject', (req, res)=>{
    model.StudentSubject.create({
        StudentId : req.params.id,
        SubjectId : req.body.SubjectId
    })
    .then(student =>{
        res.redirect('/student')
    })
    .catch(err=>[
        res.send(err)
    ])
})

// ADD STUDENT (GET) 
router.get('/add', (req, res)=>{
    // body, params, query
    let errorMessage = ''
    if (req.query.hasOwnProperty('error')) {
        if (req.query.error === 'Validation error: Validation isEmail on email failed') {
            errorMessage = 'Harap masukkan email yang benar'
        } else if (req.query.error === 'Validation error: [object SequelizeInstance:Student]'){
            errorMessage = 'Alamat email sudah dipakai'
        }
    }
    res.render('student/add', { sendError: errorMessage, pageTitle: 'ADD STUDENT', session: req.session})
})

// ADD STUDENT (POST)
router.post('/add', (req, res) => {
    model.Student.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email
    })
        .then(() => {
            console.log('---------------------------------------ato ini');
            res.redirect('/student')
        })
        .catch(err => {
            console.log('========================================masuk sini gak');
            // res.send(err.message)
            let temp = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email
            }
            console.log(err);
            // res.redirect(`/student/add?error=${err.message}`)
        })
})

// EDIT STUDENT (GET)
router.get('/edit/:id', (req, res) => {
    let errorMessage = ''
    if (req.query.hasOwnProperty('error')) {
        if (req.query.error === 'Validation error: Validation isEmail on email failed') {
            errorMessage = 'Harap masukkan email yang benar'
        } else if (req.query.error === 'Validation error: Email already in used'){
            errorMessage = 'Alamat email sudah digunakan'
        }
    }
    model.Student.findById(req.params.id)
        .then(student => {
            res.render('student/edit', { data: student, sendError: errorMessage, pageTitle: 'EDIT STUDENT'})
        })
        .catch(err => {
            res.send(err)
        })
})

// EDIT STUDENT (POST)
router.post('/edit/:id', (req, res) => {
    
    model.Student.update({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email
    }, {
            where: {
                id: req.params.id
            }
        })
        .then(() => {
            res.redirect('/student')
        })
        .catch(err => {
            if (err.errors[0].message === `Email already in used`) {
                res.redirect(`/student/edit/${req.params.id}?error=${err.message}`)
            } else {
                res.redirect(`/student`)
            }
        })
})

router.get('/delete/:id', (req, res) => {
    model.Student.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(() => {
            res.redirect('/student')
        })
        .catch(err => {
            res.send(err)
        })
})

module.exports = router;