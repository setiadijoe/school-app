const express = require('express')
const model = require('../models')
const scoring= require('../helper/scoring');
const router = express.Router()

router.use((req, res, next)=>{
    if(req.session.hasLogin && req.session.user.role !== 'teacher'){
        next()
    } else {
        res.redirect('/')
    }
})

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
                res.render('subject/subject', { data: subjects, pageTitle: 'Subject Page', session: req.session})
            })
        
    })
    .catch(err=>{
        res.send(err)
    })
})

router.get('/add', (req, res) => {
    // body, params, query
    res.render('subject/add', { pageTitle: 'ADD STUDENT', session: req.session})
})

// ADD STUDENT (POST)
router.post('/add', (req, res) => {
    model.Subject.create({
        subject_name: req.body.subject_name
    })
        .then(() => {
            res.redirect('/subject')
        })
        .catch(err => {
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
                    // console.log(subject.Students[0].StudentSubject.StudentId);
                    // res.send(subject.Students)
                    res.render('subject/enrollstudent', { data: subject, pageTitle: 'Subject Enrolled'})
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

router.get('/:id/givescore', (req, res)=>{
    model.StudentSubject.findById(req.params.id,
    {include: [
        {model : model.Student},
        {model : model.Subject}
    ]}
)
    .then(scoring=>{
        // console.log(scoring);
        // res.send(scoring)
        res.render('subject/givescore', { data: scoring, pageTitle: 'Adding Score'})
    })
})

router.post('/:id/givescore', (req, res)=>{
    model.StudentSubject.update({
        score : req.body.score
    },{
        where: {id: req.params.id}
    })
    .then(()=>{
        // console.log(req.params.id);
        res.redirect(`/subject`)
    })
    .catch(err=>{
        res.send(err)
    })
})

module.exports = router;