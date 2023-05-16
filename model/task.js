
const mongoose = require('mongoose')


const taskSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    desc:{
        type : String,
        required : true
    },
    completed:{
        type : Boolean,
        required : true
    },
    owner:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    }
},{
    toJSON : {virtuals:true},
    timestamps:true
})

// taskSchema.methods.authentication = async function(){
//     const user = this
//     const token =  jwt.sign({_id:user.id.toString()},'thisistask')
//     user.tokens = user.tokens.concat({token})
//     await user.save()
//     return token
// }

// taskSchema.statics.findByCredentials = async(title,pass)=>{
//     const task = await Task.findOne({ title })
//     if(!task){
//          throw new Error('LogIn Error')
//     }
//     const isMatch = await bcrypt.compare(pass,task.pass)
//     if(!isMatch){
//         throw new Error('Password not Matched')
//     }
//     return task
// }

// taskSchema.pre('save',async function(next){
//     const user = this
//     if(user.isModified('pass')){
//         user.pass = await bcrypt.hash(user.pass,5)
//     }
//     next()
// })

const Task = mongoose.model('Task',taskSchema)


module.exports = Task