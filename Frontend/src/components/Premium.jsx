import api from "@/services/api";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const plans = [
  {
    id: "gold",
    title: "Gold",
    price: "₹700",
    features: [
      "Unlimited Swipes",
      "Priority Profile",
      "See Who Likes You",
    ],
    highlight: true,
  },
  {
    id: "silver",
    title: "Silver",
    price: "₹300",
    features: [
      "More Daily Swipes",
      "Basic Profile Boost",
    ],
  },
];

const Premium = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkPremiumStatus = async () => {
    try {
      setLoading(true);
      const res = await api.get("/premium/verify");
      setIsPremium(res.data.isPremium);
    } catch (err) {
      setError("Failed to fetch premium status. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const premiumHandler = async (type) => {
    try {
      setLoading(true);
      setError("");

      const res = await api.post("/create/order", {
        membershipType: type,
      });

      const { amount, orderId, notes } = res.data.data;

      const options = {
        key: "rzp_test_SUfpOzxh2SY7AN",
        amount,
        currency: "INR",
        name: "DevTinder",
        description: "Upgrade to premium",
        order_id: orderId,
        handler: async function (response) {
          try {
            await api.post("/verify/payment", response);
            await checkPremiumStatus();
          } catch (err) {
            setError("Payment verification failed.");
          }
        },
        prefill: {
          name: `${notes.firstName} ${notes.lastName}`,
        },
        theme: {
          color: "#6366F1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError("Something went wrong while initiating payment.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">Upgrade Your Experience</h1>
        <p className="text-gray-400">
          Get more visibility, more matches, and unlock premium features.
        </p>
      </div>

      {error && (
        <div className="text-center text-red-400 mb-6">{error}</div>
      )}

      {isPremium ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-green-600/20 border border-green-500 p-6 rounded-2xl"
        >
          <h2 className="text-2xl font-semibold text-green-400">
            🎉 You are already a Premium User
          </h2>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ scale: 1.05 }}
              className={`p-6 rounded-2xl border backdrop-blur-lg ${
                plan.highlight
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-gray-700 bg-gray-800/40"
              }`}
            >
              <h2 className="text-2xl font-bold mb-2">{plan.title}</h2>
              <p className="text-3xl font-semibold mb-4">{plan.price}</p>

              <ul className="mb-6 space-y-2 text-gray-900">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>✔ {feature}</li>
                ))}
              </ul>

              <button
                onClick={() => premiumHandler(plan.id)}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition font-medium"
              >
                Subscribe
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Premium;