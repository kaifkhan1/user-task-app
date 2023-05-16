const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const userId = new mongoose.Types.ObjectId()

const user = {
    _id : userId,
    email : "test@gmail.com",
    password : "12345678test",
    tokens:[{
        token:jwt.sign({_id:userId},process.env.JWT_SECRET)
    }]
}

const task = {
    _id : new mongoose.Types.ObjectId(),
    title : "Title Test",
    desc : "Test Desc",
    completed : true
}

module.exports = {
    userId,
    user,
    task
}