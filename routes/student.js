const express = require('express')
const model = require('../models')
const router = express.Router()

router.get('/', (req, res)=>{
    model.Student.findAll()
    .then(student=>{
        res.send(student)
    })
    .catch(err=>{
        res.send(err)
    })
})

module.exports = router;