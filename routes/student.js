const express = require('express')
const model = require('../models')
const router = express.Router()

router.get('/', (req, res)=>{
    model.Student.findAll({ order: [['id', 'ASC']]})
    .then(student=>{
        // res.send(student[0].getFullName())
        res.render('student/student', {data:student})
    })
    .catch(err=>{
        res.send(err)
    })
})

router.get('/add', (req, res)=>{
    // body, params, query
    let errorMessage = ''
    if (req.query.hasOwnProperty('error')) {
        if (req.query.error === 'Validation error: Validation isEmail on email failed') {
            errorMessage = 'Harap masukkan email yang benar'
        } else if (req.query.error === 'Validation error: Invalid validator function: isUnique'){
            errorMessage = 'Alamat email sudah dipakai'
        }
    }
    res.render('student/add', {sendError: errorMessage})
})

router.post('/add', (req, res) => {
    model.Student.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email
    })
        .then(() => {
            res.redirect('/student')
        })
        .catch(err => {
            // res.send(err.message)
            res.redirect(`/student/add?error=${err.message}`)
        })
})

router.get('/edit/:id', (req, res) => {
    let errorMessage = ''
    if (req.query.hasOwnProperty('error')) {
        if (req.query.error === 'Validation error: Validation isEmail on email failed') {
            errorMessage = 'Harap masukkan email yang benar'
        }
    }
    model.Student.findById(req.params.id)
        .then(student => {
            // res.send(teacher)
            res.render('student/edit', { data: student, sendError: errorMessage })
        })
        .catch(err => {
            res.send(err)
        })
})

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
        .then(() => [
            res.redirect('/student')
        ])
        .catch(err => {
            res.redirect(`/student/edit/${req.params.id}?error=${err.message}`)
            // res.send(err.message)
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