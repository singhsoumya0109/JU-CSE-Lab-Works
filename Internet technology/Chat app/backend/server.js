const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const messageRoutes = require("./routes/messageRoutes");

const path = require("path");

dotenv.config();
require("dotenv").config();

connectDB();

app.use(express.json());


// app.get('/chat', (req, res) => {
//     res.send(chats);
// })

app.use('/user', userRoutes);

app.use('/chat', chatRoutes);

app.use('/messages', messageRoutes);

//------------------deploymnet-------------

// const __dirname1 = path.resolve();
// if (process.env.NODE_ENV === "production")
// {
//     app.use(express.static(path.join(__dirname1, "/frontend/build")));

//     app.get("*", (req, res) => {
//         res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
//     });
// }
// else
// {
//     app.get("/", (req, res) => {
//       res.send("Api is running successfully");
//     });
// }

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "frontend", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running successfully");
  });
}
//------------------------------------------

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000; 

const server = app.listen(PORT, console.log(`Server running at ${PORT}`));

const io = require('socket.io')(server, {
    pingTimeout:60000,
    cors: {
        origin: "*",
    },
});


io.on("connection", (socket) => {
    //console.log("Connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        //console.log(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
      socket.join(room);
        //console.log("User joined room"+room);
    });


    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");
        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });
});


