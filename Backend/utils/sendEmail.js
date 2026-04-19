const { SendEmailCommand } = require("@aws-sdk/client-ses");
const sesClient = require("./sesClient");

const sendEmail = async () => {
  const params = {
    Source: "noreply@devtinder.openlancer.in",
    Destination: {
      ToAddresses: ["gauravp9118@gmail.com"],
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
 // console.log("Email sent:", response);
  return response; // ✅ ADD THIS
} catch (error) {
  console.error("Error sending email:", error);
  throw error; // ✅ IMPORTANT
}
};

module.exports = sendEmail;