const express = require("express");
const paymentInstance = require("../utils/razorpay");
const userAuth = require("../middleware/userAuth");
const { membershipTypes } = require("../utils/constants");
const Payment = require("../models/payment");
const router = express.Router();
const crypto = require("crypto");
const User = require("../models/userModel");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");

router.post("/create/order", userAuth, async (req, res) => {
  const { membershipType } = req.body;
  const amount = membershipTypes[membershipType] * 100; // Convert to paise
  const { firstName, lastName, email } = req.user;
  try {
    const order = await paymentInstance.orders.create({
      amount: amount,
      currency: "INR",
      receipt: "order_rcptid_11",
      notes: {
        firstName: firstName,
        lastName: lastName,
        memberType: membershipType,
      },
    });

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      amount: order.amount,
      status: order.status,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });
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
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

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

router.post("/webhook", async (req, res) => {
  try {
   // console.log("Webhook Called");
    const webhookSignature = req.get("X-Razorpay-Signature");
    //console.log("Webhook Signature", webhookSignature);

    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      console.log("INvalid Webhook Signature");
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }
  //  console.log("Valid Webhook Signature");

    // Udpate my payment Status in DB
    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();
   // console.log("Payment saved");

    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
   // console.log("User saved");

    await user.save();

    // Update the user as premium

    if (req.body.event == "payment.captured") {
            return res.status(200).send("Ignored");
    }
    // if (req.body.event == "payment.failed") {
    // }

    

    // return success response to razorpay

    return res.status(200).json({ msg: "Webhook received successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

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
