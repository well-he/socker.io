const express = require("express");
const { Server } = require("socket.io");
const app = express();
const io = new Server(3000, {
  cors: {
    origin: "*",
    methods: "*",
  },
});
const userList = [
  {
    id: 1,
    name: "user1",
    age: 20,
    score: 70,
  },
  {
    id: 2,
    name: "user2",
    age: 21,
    score: 80,
  },
  {
    id: 3,
    name: "user3",
    age: 22,
    score: 90,
  },
  {
    id: 4,
    name: "user4",
    age: 23,
    score: 1000,
  },
];

io.on("connection", (socket) => {
  socket.emit("getUser", userList);

  socket.on("changeStates", (status) => {
    io.emit("changeStates", status);
  });

  socket.on("changeData", (data) => {
    io.emit("changeData", data);
  });
});
io.addListener("chat", (data) => {
  console.log(data);
});

app.listen(8000, () => {
  console.log("ok");
});
