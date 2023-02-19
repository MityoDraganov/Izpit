
const express = require('express')


const mongoose = require('mongoose')
const handlebars = require('express-handlebars')
const cookieParser = require('cookie-parser')

const router = require('./routes')

const app = express()

app.engine('hbs', handlebars.engine({
    extname: 'hbs',
}))
app.set('view engine', 'hbs')

app.use(express.urlencoded({extended: false}))
app.use(express.static('static'))
app.use(cookieParser())
app.use(router)


// TODO: change PROJECTNAME to project's name
mongoose.set('strictQuery', false)
mongoose.connect('mongodb://localhost:27017/petstagram')


app.listen(3000, ()=> console.log('server is running on port 3000...'))

