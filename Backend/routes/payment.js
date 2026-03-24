const express = require("express");
const paymentInstance = require("../utils/razorpay");
const userAuth = require("../middleware/userAuth");
const { membershipTypes } = require("../utils/constants");
const Payment = require("../models/payment");
const router = express.Router();
const crypto = require("crypto");
const User = require("../models/userModel");



router.post("/create/order", userAuth, async (req, res) => {
    const { membershipType } = req.body;
    const amount = membershipTypes[membershipType] * 100; // Convert to paise
    const {firstName, lastName, email} = req.user;
  try {
    const order = await paymentInstance.orders.create({
      amount: amount,
      currency : "INR",
      receipt: "order_rcptid_11",
      notes: {
          firstName: firstName,
          lastName: lastName,
          memberType: membershipType,
        },
    });

    const payment = new Payment({
        userId : req.user._id,
        orderId : order.id,
        amount : order.amount,
        status : order.status,
        currency : order.currency,
        receipt : order.receipt,
        notes : order.notes,
    })
    const savedPayment = await payment.save();

    res
      .status(201)
      .json({ message: "Order created successfully", data: savedPayment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



router.post("/verify/payment", userAuth, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid payment" });
  }

  // ✅ Find payment
  const payment = await Payment.findOne({
    orderId: razorpay_order_id,
  });

  if (!payment) {
    return res.status(404).json({ message: "Order not found" });
  }

  // ✅ Update payment
  payment.paymentId = razorpay_payment_id;
  payment.status = "completed";
  await payment.save();

  // ✅ Update user
  await User.findByIdAndUpdate(payment.userId, {
    isPremium: true,
    membershipType: payment.notes.memberType,
  });

  res.json({ message: "Payment verified & premium activated" });
});

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["x-razorpay-signature"];

    const isValid = validateWebhookSignature(
      req.body, // raw body
      signature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isValid) {
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(req.body);

    if (event.event !== "payment.captured") {
      return res.status(200).send("Ignored");
    }

    const paymentDetails = event.payload.payment.entity;
console.log("Payment captured webhook received:", paymentDetails);
    const payment = await Payment.findOne({
      orderId: paymentDetails.order_id,
    });

    if (!payment) {
      return res.status(404).send("Not found");
    }

    if (payment.status === "completed") {
      return res.status(200).send("Already done");
    }

    payment.status = "completed";
    payment.paymentId = paymentDetails.id;
    await payment.save();

    await User.findByIdAndUpdate(payment.userId, {
      isPremium: true,
      membershipType: payment.notes.memberType,
    });

    res.status(200).send("Webhook processed");
  }
);


router.get("/premium/verify", userAuth, async (req, res) => {
  try {
    const user = req.user;

    return res.json({
      isPremium: user.isPremium,
      membershipType: user.membershipType,
    });

  } catch (err) {
    res.status(500).json({ message: "Error fetching premium status" });
  }
});
module.exports = router;
