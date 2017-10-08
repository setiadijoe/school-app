const express = require('express')
const model = require('../models')
const scoring= require('../helper/scoring');
const router = express.Router()

router.get('/', (req, res)=>{
    model.Subject.findAll({ order: [['id', 'ASC']] })
    .then(subjects=>{
        let promise = subjects.map((subject, index)=>{
            return new Promise((resolve, reject)=>{
                subject.getTeachers()
                .then(teachers=>{
                    if(teachers){
                        let fullname = teachers.map(teacher=>{
                            return teacher.getFullName()
                        })
                        subject.dataValues["fullname"] = fullname
                    } else {
                        subject.dataValues["fullname"] = []
                    }
                    resolve(subject)
                    // console.log(subject);
                })
                .catch(err=>{
                    reject(err)
                })
            })
        })
        Promise.all(promise)
            .then(subjects=>{
                res.render('subject/subject', {data: subjects})
            })
        
    })
    .catch(err=>{
        res.send(err)
    })
})

router.get('/:id/enrolledstudents', (req, res)=>{
    model.Subject.findById(req.params.id, {
        include: [{
            model: model.Student
        }],
        order: [[
            model.Student, 'first_name', 'ASC'
        ]]
    })
    .then(subject=>{
        // res.send(subject.Students)
        if(subject.Students.length > 0){
            let index =0;
            subject.Students.map(student=>{
                // res.send(student)
                student.setDataValue('score', scoring(student.StudentSubject.score))
                // res.send(student)
                index++
                if (index >= subject.Students.length){
                    // res.send(subject.Students[0].getFullName())
                    res.render('subject/enrollstudent', {data: subject})
                }
            })
        } else {
            res.redirect('/subject')
        }
    })
    .catch(err=>{
        res.send(err)
    })
})

module.exports = router;