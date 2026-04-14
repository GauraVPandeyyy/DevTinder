const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
const User = require("../models/userModel");

const onlineUsers = new Map();

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

      // ===== ONLINE LOGIC START =====

      // if (!onlineUsers.has(userId)) {
      //   onlineUsers.set(userId, new Set());
      // }

      // onlineUsers.get(userId).add(socket.id);

      // console.log("ONLINE USERS:", onlineUsers);

      //  socket.to(roomId).emit("userOnline", { userId });

      // ===== ONLINE LOGIC END =====
    });

    socket.on("userConnected", ({ userId }) => {
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }

      onlineUsers.get(userId).add(socket.id);

      io.emit("userOnline", { userId });
    });

    socket.on("getOnlineUsers", () => {
      socket.emit("onlineUsersList", Array.from(onlineUsers.keys()));
    });

    socket.on("disconnect", async () => {
      console.log("Socket disconnected:", socket.id);

      for (let [userId, socketSet] of onlineUsers.entries()) {
        if (socketSet.has(socket.id)) {
          socketSet.delete(socket.id);

          // if no active sockets left
          if (socketSet.size === 0) {
            onlineUsers.delete(userId);

            const lastSeen = new Date();

            io.emit("userOffline", {
              userId,
              lastSeen,
            });

            await User.findByIdAndUpdate(userId, {
              lastSeen,
            });
          }

          break;
        }
      }
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
            senderId: userId,
            text,
          });

          await chat.save();

          io.to(roomId).emit("messageReceived", {
            senderId: userId,
            firstName,
            text,
          });
        } catch (error) {
          console.error(error.message);
        }
      },
    );

    socket.on("typing", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);

      console.log("Starts typing...");

      // send to OTHER user only
      socket.to(roomId).emit("userTyping");
    });

    socket.on("stopTyping", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);

      console.log("stopped typing");

      socket.to(roomId).emit("userStoppedTyping");
    });
  });
};

module.exports = initSocket;
