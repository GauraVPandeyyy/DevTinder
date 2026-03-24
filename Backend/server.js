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

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
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

app.listen(process.env.PORT, () => {
  console.log("Server is listening @ PORT", process.env.PORT);
});
