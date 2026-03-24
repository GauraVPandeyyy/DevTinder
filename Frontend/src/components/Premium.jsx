import api from "@/services/api";
import React from "react";

const Premium = () => {
  const premiumHandler = async (type) => {
    // Handle premium subscription logic here
    const res = await api.post("/create/order", { membershipType: type });
    console.log("Subscribed to premium!", res.data);
    // console.log(res.data);
    const { _id, amount, orderId, notes } = res.data.data;
    const options = {
      key: "rzp_test_SUfpOzxh2SY7AN", // Replace with your Razorpay key_id
      amount: amount, // Amount is in currency subunits.
      currency: "INR",
      name: "DevTinder",
      description: "Subscribe to premium features",
      order_id: orderId, // This is the order_id created in the backend
      handler: async function (response) {
        console.log("Payment success:", response);

        await api.post("/verify/payment", response);
      },
      prefill: {
        name: `${notes.firstName} ${notes.lastName}`,
        membershipType: notes.memberType,
      },
      theme: {
        color: "#F37254",
      },
    };

    const rzp = window.Razorpay(options);
    rzp.open();
  };
//   {razorpay_payment_id: 'pay_SV3xukMg7IjAbZ', razorpay_order_id: 'order_SV3xfeZ1WgdTFU', razorpay_signature: 'e2b5b52574078613b255ccd450cc57f1c119fba4647613a1ed34007d702a709c'
  return (
    <div className="flex justify-between bg-gray-50 gap-10">
      <div className="border-2">
        <h1>Premium</h1>
        <p>Welcome to the premium section!</p>
        <li>
          <ul>
            <li>Premium Feature 1</li>
            <li>Premium Feature 2</li>
            <li>Premium Feature 3</li>
          </ul>
        </li>
        <button
          className="bg-blue-500 text-white"
          onClick={(e) => premiumHandler("gold")}
        >
          Subscribe
        </button>
      </div>
      <div>
        <h1>Premium</h1>
        <p>Welcome to the premium section!</p>
        <li>
          <ul>
            <li>Premium Feature 1</li>
            <li>Premium Feature 2</li>
            <li>Premium Feature 3</li>
          </ul>
        </li>
        <button
          className="bg-blue-500 text-white"
          onClick={(e) => premiumHandler("silver")}
        >
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default Premium;
