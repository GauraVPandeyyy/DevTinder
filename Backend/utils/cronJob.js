const cronJob = require("node-cron");
const connectionRequest = require("../models/connectionRequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");

// Schedule a cron job to run every day at midnight
cronJob.schedule("0 8 * * *", async () => {
  try {
    console.log("Running cron job to delete old connections...", new Date());
    const yesterday = subDays(new Date(), 1);
    const startYesterday = startOfDay(yesterday);
    const endYesterday = endOfDay(yesterday);

    const pendingRequests = await connectionRequest
      .find({
        status: "interested",
        createdAt: {
          $gt: startYesterday,
          $lt: endYesterday,
        },
      })
      .populate("toUserId fromUserId");

    const listEmails = [
      ...new Set(pendingRequests.map((req) => req.toUserId.email)),
    ];

    console.log(listEmails);

    for (const email of listEmails) {
      try {
        const res = await sendEmail();
        console.log(res);
      } catch (error) {
        throw new Error(error.message);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = cronJob;
