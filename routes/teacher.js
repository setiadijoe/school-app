const express = require('express')
const model = require('../models')
const router = express.Router()

router.get('/', (req, res)=>{
    let errorMessage = ''
    if (req.query.hasOwnProperty('error')) {
        if (req.query.error === 'Validation error: Validation isEmail on email failed') {
            errorMessage = 'Harap masukkan email yang benar'
        }
    }

    model.Teacher.findAll({
        order: [['id', 'ASC']]
    })
    .then(teachers=>{
        res.render('teacher/teacher', {data:teachers, sendError: errorMessage})
    })
    .catch(err=>{
        res.send(err)
    })
})

router.post('/', (req, res)=>{
    // console.log(req.body);
    model.Teacher.create({
        first_name: req.body.first_name, 
        last_name: req.body.last_name,
        email: req.body.email
    })
    .then(()=>{
        res.redirect('/teacher')
    })
    .catch(err=>{
        res.redirect(`/teacher?error=${err.message}`)
    }) 
})

router.get('/edit/:id', (req, res)=>{
    let errorMessage = ''
    if (req.query.hasOwnProperty('error')) {
        if (req.query.error === 'Validation error: Validation isEmail on email failed') {
            errorMessage = 'Harap masukkan email yang benar'
        }
    }
    model.Teacher.findById(req.params.id)
    .then(teacher=>{
        // res.send(teacher)
        res.render('teacher/edit', {data: teacher, sendError:errorMessage})
    })
    .catch(err=>{
        res.send(err)
    })
})

router.post('/edit/:id', (req, res)=>{
    model.Teacher.update({
        first_name : req.body.first_name,
        last_name : req.body.last_name,
        email: req.body.email
    },{
            where: {
                id: req.params.id
            }
    })
    .then(()=>[
        res.redirect('/teacher')
    ])
    .catch(err=>{
        res.redirect(`/teacher/edit/${req.params.id}?error=${err.message}`)
        // res.send(err.message)
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