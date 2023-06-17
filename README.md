# User-Task-App

## Overview
This web application allows users to create, fetch, update, and delete tasks. Users must be logged in to create or update tasks. Tasks are stored in a MongoDB database. Authentication is handled using JWT tokens. Unit tests are written using Jest.

## Getting Started
To get started with this application, you will need to have Node.js installed. Once you have Node.js installed, you can clone the repository from GitHub:

` git clone https://github.com/kaifkhan1/task-manager.git
`
Next Install the dependencies using
` npm install `

Finally, to start the application use
` npm start ` or ` npm run dev `

## Authentication
Authentication is handled using JWT tokens. To login, you can POST to the /login endpoint with the following body:
` {
  "username": "your_username",
  "password": "your_password"
} `

If the login is successful, the server will return a JWT token. You can use this token to access the other endpoints.

### Endpoints
The following endpoints are available:

- `signup`: To Signup A User
- `/login`: Used to login a user.
- `/tasks`: Get all tasks for the current user.
- `/tasks/:id`: Get a task by id.
- `/tasks`: Create a new task.
- `/tasks/:id`: Update a task.
- `/tasks/:id`: Delete a task.
- `/logout` : To Logout Of A Device.
- `/logoutAll` : To Loguout Of All The devices.
- `/delete` : To Delete A User.

### Testing
The application includes unit tests written using Jest. To run the tests, you can run the following command:
` 
npm test

`

## Further Development

This is just a basic example of a task manager application. There are many ways that you could further develop it. Here are a few ideas:

- Add support for multiple users.
- Add support for different task types.
- Add support for task dependencies.
- Add a web UI.
- Add a mobile app.
