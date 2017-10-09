const express = require('express')
const router = express.Router()
const model = require('../models')
const hash = require('../helper/hash')

router.get('/', (req, res) => {
    // console.log(req.session);
    if (req.session.hasLogin) {
        // res.send(req.session)
        res.render('index', { pageTitle: 'School', session: req.session })
    } else {
        res.redirect('/login')
    }
})

router.get('/login', (req, res) => {
    res.render('login', { pageTitle: 'Login', error_login: false })
})

router.post('/login', (req, res)=>{
    model.User.findOne(
   { where:{
        username: req.body.username
    }}
    )
    .then(data=>{
        // console.log(data);
        let salt = data.salt
        let hash_pass_input = hash(req.body.password, salt)
        if (data.password === hash_pass_input){
            req.session.hasLogin = true
            req.session.user = {
                username : data.username,
                role : data.role,
                loginTime : new Date()
            }
            // res.send(req.session.user.role)
            res.redirect('/')
        } else {
            res.render('login', { pageTitle: 'Login', error_login:true})
        }
        // res.send(data)
    })
    .catch(err=>{
        // res.send(err)
        res.render('login', { pageTitle: 'Login', error_login: true })

    })
})

router.get('/logout', (req, res) => {
    req.session.destroy();  
    res.redirect('/')
})

router.get('/register', (req, res)=>{
    res.render('register', {pageTitle: 'REGISTRATION', error_reg: false})
})

router.post('/register', (req, res)=>{
    model.User.create({
        username: req.body.username,
        password: req.body.password,
        role: req.body.role
    })
    .then(()=>{
        res.render('succedreg', {pageTitle: 'Succed REG'})
    })
    .catch(err => {
        res.render('register', { pageTitle: 'REGISTER', error_reg: true })
    })
})

module.exports = router;