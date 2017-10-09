const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')
const env = process.env.NODE_ENV || "development";

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({
    secret: 'is it secret?',
    cookie: {}
}))

const index = require('./routes/index')
const teacher = require('./routes/teacher')
const subject = require('./routes/subject')
const student = require('./routes/student')

app.use('/', index)
app.use('/teacher', teacher)
app.use('/subject', subject)
app.use('/student', student)

app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!')
})