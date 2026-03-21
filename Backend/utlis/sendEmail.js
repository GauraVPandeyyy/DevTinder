const { SendEmailCommand } = require("@aws-sdk/client-ses");
const sesClient = require("./sesClient");

const sendEmail = async () => {
  const params = {
    Source: "gauravp@gmail.com",
    Destination: {
      ToAddresses: ["gauravp@gmail.com"],
    },
    Message: {
      Subject: {
        Data: "New Connection Request",
      },
      Body: {
        Text: {
          Data: "Someone sent you a connection request on Devtinder",
        },
      },
    },
  };

  const command = new SendEmailCommand(params);

  try {
    const response = await sesClient.send(command);
    console.log("Email sent:", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;