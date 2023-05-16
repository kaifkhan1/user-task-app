const mongoose = require('mongoose')
const express = require('express')
const userRouter = require('./routers/userRouter')
const taskRouter = require('./routers/taskRouter')
require('dotenv').config({path:'./config/dev.env'})
const app = express()

app.use(express.json())


mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser : true
})

app.use(userRouter)
app.use(taskRouter)


module.exports = app