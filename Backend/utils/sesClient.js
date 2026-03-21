require("dotenv").config();
const { SESClient } = require("@aws-sdk/client-ses");

const sesClient = new SESClient({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_IAM_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_IAM_SECRET_ACCESS_KEY,
  },
});

console.log("KEY:", process.env.AWS_IAM_ACCESS_KEY_ID);
console.log("SECRET:", process.env.AWS_IAM_SECRET_ACCESS_KEY);
module.exports = sesClient