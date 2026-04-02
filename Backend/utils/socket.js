const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    //handle events
    socket.on("joinChat", ({ userId, targetUserId, firstName }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(firstName + " - " + roomId);
      socket.join(roomId);
    });

    socket.on(
      "messageSend",
      async ({ firstName, userId, targetUserId, text }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);

          console.log(firstName + " - " + text);

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId : userId,
            text
          })

          await chat.save();

          io.to(roomId).emit("messageReceived", {senderId: userId, firstName, text });
        } catch (error) {
          console.error(error.message);
        }
      },
    );
  });
};

module.exports = initSocket;
