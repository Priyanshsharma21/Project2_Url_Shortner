const express  = require('express')
const morgan = require('morgan')
const app = express()
const routes = require('./routes/urlRoute.js')

// Global middlewares
app.use(express.json())
app.use(express.urlencoded({extended : true}))

// Morgan
app.use(morgan("tiny"))

//route middleware
app.use('/',routes)


module.exports = app