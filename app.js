const express = require('express');
const app = express();
const cors = require('cors')
const tasks = require('./routes/tasks');
const users = require('./routes/user');
const reviews = require('./routes/review');
const skills = require('./routes/skill');
const technologies = require('./routes/technology');
const connectDB = require('./db/connect');
const socket = require("socket.io");
require('dotenv').config();
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// middleware
app.use(cors())

// middleware

app.use(express.static('./public'));
app.use(express.json());

// routes

app.use('/api/v1/tasks', tasks);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/skills', skills);
app.use('/api/v1/technologies', technologies);

app.use(notFound);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 5000;

const server = app.listen(port, () =>
  console.log(`Server started on ${port}`)
);
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    server
  } catch (error) {
    console.log(error);
  }
};

start();
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000", 
    credentials: true,
  },
});

global.notifications = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;;
  socket.on("add-notifications", (userId) => {
    // console.log(userId)
    notifications.set(userId, socket.id);
    // console.log(notifications)
  });

  // socket.broadcast.emit('post-liked', 'this is a message');

  socket.on("added-review", (blog) => {
    // console.log(blog)
    const sendUserSocket = notifications.get(blog.admin);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("review-added",blog);
      }
  });
});
