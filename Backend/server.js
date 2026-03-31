const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const ConnectDB = require("./config/db");

require("./utils/cronJob");
// const mongoSanitize = require("express-mongo-sanitize");

const cookiesParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionReqRoute = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const cors = require("cors");
const socket = require("socket.io")
const http = require("http");
const initSocket = require("./utils/socket");

app.use(
  cors({
    origin: "http://localhost:5173", // sirf specified origin allowed
    credentials: true, //cookies / session / auth headers bhi allow
  }),
);
// app.use(mongoSanitize());

ConnectDB();
app.use(express.json());
app.use(cookiesParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionReqRoute);
app.use("/", userRouter);
app.use("/", paymentRouter);


const server = http.createServer(app)
initSocket(server)

server.listen(process.env.PORT, () => {
  console.log("Server is listening @ PORT", process.env.PORT);
});
