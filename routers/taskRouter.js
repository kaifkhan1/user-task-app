const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const Task = require('../model/task')
const auth = require('../auth')


router.get('/task',async(req,res)=>{
    
    try{
        const task= await Task.find({})
        res.send(task)
    }catch{
        res.status(500).send()
    }
})


// router.get('/task/me',auth,async(req,res)=>{
//     res.send(req.task)
// })

router.get('/tasks',auth,async(req,res)=>{

    const match = {}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    const sort = {}
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc'?-1:1
        
    }

    try{
        await req.user.populate({
            path : 'task',
            match,
            options:{
                limit :parseInt(req.query.limit),
                sort
            }
        })
        res.send(req.user.task)
    }catch(e){
        res.status(501).send()
    }
})

router.post('/task',auth,async(req,res)=>{
    const task = new Task({
        ...req.body,
        owner : req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(500).send()
    }

})

router.patch('/task/:id',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title','desc']
    const isValid = updates.every(update=>allowedUpdates.includes(update))

    if(!isValid){
       return res.status(400).send()
    }
    try{
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
        updates.forEach(update=>task[update]=req.body[update])
        await task.save()
        if(!task){
            return res.status(400).send()
        }
        res.send(task)
    }
    catch{
        return res.status(500).send()
    }
})
 
router.delete('/task/:id',auth,async(req,res)=>{
    try{
        await Task.findByIdAndDelete(req.params.id)
        res.status(201).send()
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router