const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 2000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const users = require("./views/user");
const multer = require("multer");
const forms = multer();
require("dotenv").config();
const {
  getAllUsersData,
  getInactiveChats,
  setActive,
} = require("./controllers/server_actions");
const {
  updateChat,
  getChatData,
  convertSender,
  ML,
} = require("./controllers/chatController");
const dateantime = require("date-and-time");
require("events").EventEmitter.defaultMaxListeners = 15;
app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);

// Put these statements before you define any routes.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(forms.array());
app.use(cors({ origin: " http://localhost:3000" }));
app.use("/", users);

// mongo connection
mongoose.set("strictQuery", true);
const url = process.env.MONGOOSE_URL;
mongoose?.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose?.connection.on("connected", () => {
  console.log("connected");
});

app.get("/", (req, res) => {
  res.sendFile("../src/components/userChat.js");
  console.log("this is true");
});

//SOCKET-IO:

// socket reacting to connection/disconnection
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const date = dateantime.format(new Date(), "DD/MM/YYYY");
const time = dateantime.format(new Date(), "HH:mm");
let chat = [];
let sender = "";
let messageCheck = "";

io.on("connection", (socket) => {
  //
  socket.on("chat message", async (msg, room, senderId, admin) => {
    if (!room) return false;
    if (msg === messageCheck) return console.log("stopped");

    if (room && senderId) {
      console.log(senderId, "the id of the sender");
      if (senderId) {
        await convertSender(senderId).then((id) => {
          sender = id.name;
          console.log(true, false);
        });
      }

      const message = [
        { sender: sender, message: msg, time: time, date: date },
      ];
      updateChat(msg, room, sender, admin, time, date).then(() => {
        getChatData(room).then(async (chats) => {
          if (chats) {
            Array.prototype.push.apply(chats, message);
            chat = chats;
            console.log(true);

            io.to(room).emit("send-chats", chat);
          } else {
            chat = message;
            console.log(false);
          }
          // await SendChatData(room);
        });
      });
      socket.on("answer_bot", (question) => {
        ML(question, chat).then((array) => {
          if (array?.length > 0) {
            getChatData(array[0]).then(async (chat) => {
              let answer = chat[array[1] + 1]?.message;
              console.log("predict", answer);
              updateChat(answer, room, "BOT", admin, time, date).then(
                async () => {
                  const botReplay = [{ sender: "BOT", message: answer }];
                  socket.join(room);
                  io.to(room).emit("chat message", botReplay);
                  await SendChatData(room);
                }
              );
            });
          }
        });
      });
      // SendChatData(room);
      //Bot Functions
      let preAnswer = "";
      messageCheck = msg;
    }
  });
  let prevRoom = "";
  //join a room
  socket.on("join-room", (room) => {
    socket.leave(prevRoom);
    if (room) {
      socket.join(room);
      console.log("this is the part of  my " + room);
      SendChatData(room);
      socket.emit("message room", room);
      prevRoom = room;
    }
    socket.on("refresh", () => {
      SendChatData(room);
      SendAllUsers();
    });
    socket.on("active-action", (bar) => {
      setActive(bar);
      SendChatData(room);
      SendAllUsers();
      getInactiveChats().then((inactive) => {
        io.sockets.emit("inactive-chats", inactive);
      });
    });
  });

  //get all the usersId
  function SendAllUsers() {
    getAllUsersData()
      .then((list) => {
        getInactiveChats().then((inactive) => {
          io.sockets.emit("inactive-chats", inactive);
        });
        socket.emit("chat-list", list);
      })
      .catch((err) => {
        console.log(err + "in chats");
      });
  }
  SendAllUsers();

  function SendChatData(room) {
    getChatData(room)
      .then((chats) => {
        if (chats) {
          socket.emit("send-chats", chats);
        } else {
          socket.emit("send-chats", "");
        }
      })
      .catch((err) => {
        console.log(`error ${err} in chats`);
      });
  }
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
