const express = require('express')
const model = require('../models')
const router = express.Router()

router.use((req, res, next) => {
    if (req.session.hasLogin && req.session.user.role === 'headmaster') {
        next()
    } else {
        res.redirect('/')
    }
})

router.get('/', (req, res)=>{
    let errorMessage = ''
    // console.log(req.query);
    if (req.query.hasOwnProperty('error')) {
        if (req.query.error === `Validation error: Cannot read property 'id' of null,%0AValidation error: Validation isEmail on email failed`) {
            errorMessage = 'Harap masukkan email yang benar'
        }
    }

    model.Teacher.findAll({ order: [['id', 'ASC']] })
    .then(teachers=>{
        let promise = teachers.map(teacher=>{
            return new Promise((resolve, reject)=>{
                teacher.getSubject()
                .then(subject=>{
                    if(subject){
                        teacher.dataValues["subject_name"] = subject.dataValues.subject_name
                    } else {
                        teacher.dataValues["subject_name"] = '--unassigned--'
                    }
                    resolve(teacher)
                })
                .catch(err=>{
                    reject(err)
                })
            })
        })
        Promise.all(promise)
        .then(result=>{
            // res.send(result)
            // console.log("*****************",result);
            res.render('teacher/teacher', { data: result, sendError: errorMessage, pageTitle: 'Teacher Page', session: req.session})
        })
    })
    .catch(err=>{
        res.send(err)
    })
})

router.get('/add', (req, res) => {
    // body, params, query
    let errorMessage = ''
    // res.send()
    // console.log(req.query);
    if (req.query.hasOwnProperty('error')) {
        if (req.query.error === 'Validation error: Validation isEmail on email failed') {
            errorMessage = 'Harap masukkan email yang benar'
        } else if (req.query.error === 'Validation error: Email already in used'){
                errorMessage = 'Alamat email sudah dipakai'
        }
    }
    model.Subject.findAll()
    .then(subjects =>{
        res.render('teacher/add', { data: subjects, sendError: errorMessage, pageTitle: 'Add Teacher', session: req.session})
    })
    .catch(err =>{
        res.send(err)
    })
})

router.post('/add', (req, res) => {
    model.Teacher.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        SubjectId: req.body.SubjectId
    })
        .then(() => {
            res.redirect('/teacher')
        })
        .catch(err => {
            res.redirect(`/teacher/add?error=${err.message}`)
        })
})

router.get('/edit/:id', (req, res) => {
    let errorMessage = ''
    if (req.query.hasOwnProperty('error')) {
        if (req.query.error === 'Validation error: Validation isEmail on email failed') {
            errorMessage = 'Harap masukkan email yang benar'
        } else if (req.query.error === 'Validation error: Email already in used') {
            errorMessage = 'Alamat email sudah digunakan'
        }
    }
    model.Teacher.findById(req.params.id)
        .then(teacher => {
            model.Subject.findAll()
            .then(subjects=>{
                res.render('teacher/edit', { data: teacher, subs: subjects, sendError: errorMessage, pageTitle: 'Edit Teacher' })
            })
        })
        .catch(err => {
            res.send(err)
        })
})

router.post('/edit/:id', (req, res) => {
    model.Teacher.update({
        first_name: `${req.body.first_name}`,
        last_name: `${req.body.last_name}`,
        email: `${req.body.email}`,
        SubjectId: `${req.body.SubjectId}`
    }, {
            where: {
                id: `${req.params.id}`
            }
        })
        .then(() => { 
            res.redirect('/teacher')
        })
        .catch(err => {
            if (err.errors[0].message === `Email already in used`) {
                res.redirect(`/teacher/edit/${req.params.id}?error=${err.message}`)
            } else {
                res.redirect(`/teacher`)
            }
        })
})

router.get('/delete/:id', (req, res)=>{
    model.Teacher.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(()=>{
        res.redirect('/teacher')
    })
    .catch(err=>{
        res.send(err)
    })
})

module.exports = router;