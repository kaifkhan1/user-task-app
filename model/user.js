const mongoose = require('mongoose')
const bcrypt  = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const Task = require('./task')


const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        trim : true,
        lowercase : true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error('Invalid Email')
            }
        }
    },
    password : {
        type : String,
        trim : true,
        required : true,
        min : 5
    },
    avatar : {
        type : Buffer
    },
    tokens:[
        {
            token : {
                type : String,
                required : true
            }
        }
    ]
},{
    toJSON : {virtuals:true}
})

userSchema.virtual('task',{
    ref : 'Task',
    localField : '_id',
    foreignField : 'owner'
})

userSchema.methods.toJSON = function (){
    const user = this
    const userObject = user.toObject()
    
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

userSchema.methods.getAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user.id.toString()},'userApp')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
    // console.log(token);
}

userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Login Error')
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Password Mismathced')
    }
    return user
    
}

userSchema.pre('remove',async function(next){
    const user = this
    await Task.deleteMany({owner:user._id})
    next()

})

userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,5)
    }
    next()
})

const User = mongoose.model('User',userSchema)


module.exports = User