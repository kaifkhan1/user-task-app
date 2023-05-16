const request = require('supertest')
const app = require('../app')
const User = require('../model/user')
const {userId,user,task} = require('./fixtures/db')


test('Signup a new User' ,async()=>{
    await request(app).post('/user/signup').send(user).expect(201)
})

test('Logging A New User',async()=>{
    await request(app).post('/user/login').send(user).expect(200)
})

test('Logging In A Non-Existent User',async()=>{
    await request(app).post('/user/login').send({
        email : user.email,
        password:"1010101"
    }).expect(500)
})

test('Should get the profile',async()=>{
    await request(app).
    get('/user/me').
    set('Authorization',`Bearer ${user.tokens[0].token}` )
    .send()
    .expect(200)
})

test('Should not get unauthenticated user', async()=>{
    await request(app).get('/user/me').send().expect(404)
})

// Task Tests

test('Should Get Authenticated User Task',async()=>{
    await request(app).get('/tasks').
    set('Authorization',`Bearer ${user.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should Get Authenticated User Task',async()=>{
    await request(app).get('/tasks')
    .send()
    .expect(404)
})

test('Should Not Update User',async()=>{
    await request(app).patch('/user/me').set('Authorization',`Bearer ${user.tokens[0].token}`)
    .send({
        location : "Update Title"
    }).expect(400)
})


test('Should Get Task',async()=>{
    await request(app).get('/task').expect(200)
})

test('Should Post Task Authenticated' , async()=>{
    await request(app).post('/task')
    .set('Authorization' , `Bearer ${user.tokens[0].token}`)
    .send(task).expect(201)
})

test('Should Not Post Task Authenticated' , async()=>{
    await request(app).post('/task')
    .send({
        title  : "Test title",
        desc : "Test Desc",
        completed : true 
    }).expect(404)
})

test('Updating Task',async()=>{
    await request(app).patch(`/task/${task._id}`)
    .set('Authorization',`Bearer ${user.tokens[0].token}`)
    .send({
        title : "Task Title Update Test"
    }).expect(200)
})




// afterAll(async()=>{
//     await User.deleteMany({_id:user._id})
// })

//Delete User Test Cases

test('Should Delete Task',async()=>{
    await request(app).delete(`/task/${task._id}`)
    .set('Authorization',`Bearer ${user.tokens[0].token}`)
    .send()
    .expect(201)
})

test('Should Delete User',async()=>{
    await request(app).delete('/user/me')
    .set('Authorization',`Bearer ${user.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not Delete User',async()=>{
    await request(app).delete('/user/me')
    .send()
    .expect(404)
})


