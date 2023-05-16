const express = require('express')
const User = require('../model/user')
const auth = require('../auth')
const multer = require('multer')
const sharp = require('sharp')
const router = express.Router()

router.get('/user',async(req,res)=>{
    try{
        const user = await User.find({})
        if(!user){
            throw new Error('No User Found')
        }
        res.send(user)
    }catch(e){
        res.send(e)
    }
    
    
})

router.post('/user/signup',async(req,res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        const token = await user.getAuthToken()
        res.status(201).send({user,token})
    }catch(e){
        res.status(500).send()
    }
})

router.post('/user/login',async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.getAuthToken()
        res.send({user,token})
    }
    catch(e){
        res.status(500).send()
    }
})

router.post('/user/logout',auth,async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send()
    }
})

router.post('/user/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.get('/user/me',auth,async(req,res)=>{
    res.send(req.user)
})

router.patch('/user/me',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['email','password']
    const isValid = updates.every((update)=>allowedUpdates.includes(update)) 

    if(!isValid){
        res.status(400).send({error:'Not Valid Update'})
    }

    try{
        updates.forEach((update)=>req.user[update]=req.body[update])
        await req.user.save()
        res.send(req.user)
    }
    catch(e){
        res.status(500).send()
    }
})

router.delete('/user/me',auth,async(req,res)=>{
    try{
        await User.findByIdAndDelete(req.user._id)
        res.send(req.user)
    }
    catch(e){
        res.status(500).send()
    }
})

const upload = multer({
    storage : multer.memoryStorage(),
    dest : 'avatar',
    limits:{
        fileSize : 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)/)){
            return cb(new Error('Please Upload Image'))
        }

        cb(undefined,true)
    }
})

router.post('/user/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    // const encoded = req.file.buffer.toString('base64')
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/user/me/avatar',auth,async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

// Serving Up Image

router.get('/user/:id/avatar',async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/jpg')
        res.send(user.avatar)
    }catch(e){
        res.status(400).send()
    }
})

module.exports = router