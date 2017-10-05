const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const index = require('./routes/index')
const teacher = require('./routes/teacher')
const subject = require('./routes/subject')
const student = require('./routes/student')

app.use('/', index)
app.use('/teacher', teacher)
app.use('/subject', subject)
app.use('/student', student)

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})