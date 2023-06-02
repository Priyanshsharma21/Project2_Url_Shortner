const express  = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const routes = require('./routes/urlRoute.js')




// Global middlewares
app.use(express.json())
app.use(express.urlencoded({extended : true}))


// Morgan
app.use(morgan("tiny"))


// cors
app.use(cors({ origin: 'http://localhost:5173' }))



// route middleware
app.use('/',routes)




module.exports = app