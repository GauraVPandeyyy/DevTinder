const socket = require("socket.io");
const crypto = require("crypto");

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
    socket.on("joinChat", ({userId , targetUserId, firstName}) => {
        const roomId = getSecretRoomId(userId, targetUserId)
        console.log(firstName +" - "+ roomId);
        socket.join(roomId)
    });

    socket.on("messageSend", ({firstName , userId , targetUserId , text})=>{
        const roomId = getSecretRoomId(userId, targetUserId)

        console.log(firstName + " - " + text)

        io.to(roomId).emit("messageRecieved" , {firstName , text})
    })

  });
};

module.exports = initSocket;
