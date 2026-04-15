import api from "@/services/api";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";

const plans = [
  {
    id: "gold",
    title: "Gold",
    price: "₹700",
    features: ["Unlimited Swipes", "Priority Profile", "See Who Likes You"],
    highlight: true,
  },
  {
    id: "silver",
    title: "Silver",
    price: "₹300",
    features: ["More Daily Swipes", "Basic Profile Boost"],
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

  if (loading && !isPremium) {
    return (
      <div className="flex h-[calc(100dvh-5rem)] items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-[#22d3ee]" />
      </div>
    );
  }

 return (
    <div className="min-h-[calc(100dvh-5rem)] bg-background w-full px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Upgrade Your <span className="bg-gradient-to-r from-[#22d3ee] to-[#0284c7] bg-clip-text text-transparent">Compile Time</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Get more matches, see who likes your code, and stand out in the developer pool.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-center font-medium">
            {error}
          </div>
        )}

        {isPremium ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center bg-gradient-to-b from-[#22d3ee]/20 to-background border border-[#22d3ee]/50 p-8 rounded-[2rem] shadow-[0_0_40px_rgba(34,211,238,0.15)]"
          >
            <ShieldCheck className="w-20 h-20 text-[#22d3ee] mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-2">
              Active Subscription
            </h2>
            <p className="text-white/70">
              You are currently enjoying all premium benefits. Happy coding and swiping!
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-3xl mx-auto">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ y: -5 }}
                className={`relative flex flex-col p-8 rounded-[2rem] border backdrop-blur-xl transition-all ${
                  plan.highlight
                    ? "border-yellow-500/50 bg-yellow-500/[0.05] shadow-[0_0_40px_rgba(234,179,8,0.15)] z-10 md:scale-105"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                {/* Popular Badge */}
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-3 h-3" /> MOST POPULAR
                  </div>
                )}

                <div className="mb-8">
                  <h2 className={`text-2xl font-bold mb-2 ${plan.highlight ? "text-yellow-400" : "text-white"}`}>
                    {plan.title}
                  </h2>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-muted-foreground font-medium">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-white/80">
                      <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.highlight ? "text-yellow-500" : "text-[#22d3ee]"}`} />
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => premiumHandler(plan.id)}
                  disabled={loading}
                  className={`w-full h-14 text-lg font-bold rounded-xl transition-all ${
                    plan.highlight
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:shadow-[0_0_25px_rgba(234,179,8,0.4)]"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : `Select ${plan.title}`}
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Premium;
