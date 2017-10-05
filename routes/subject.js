const express = require('express')
const model = require('../models')
const router = express.Router()

router.get('/', (req, res)=>{
    model.Subject.findAll()
    .then(subjects=>{
        res.render('subject', {data: subjects})
    })
    .catch(err=>{
        res.send(err)
    })
})

module.exports = router;