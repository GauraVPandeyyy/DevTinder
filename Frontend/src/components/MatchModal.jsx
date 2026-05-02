import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

const MatchModal = ({ matchedUser, currentUser, onClose }) => {
  const navigate = useNavigate();

  // Tip Implemented: Modal open hote hi Confetti fire hoga
  useEffect(() => {
    if (matchedUser) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.4 },
        colors: ['#22d3ee', '#ec4899', '#22c55e'],
        zIndex: 99999
      });
    }
  }, [matchedUser]);

  if (!matchedUser) return null;

  const handleSendMessage = () => {
    onClose(); // Modal close karo
    navigate(`/chat/${matchedUser._id}`); // Chat screen par redirect
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
      >
        <div className="relative w-full max-w-sm text-center">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Title Animation */}
          <motion.div
            initial={{ scale: 0.5, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 12 }}
          >
            <h1 className="text-5xl font-black italic text-[#22d3ee] mb-2 tracking-tighter drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
              IT'S A MATCH!
            </h1>
            <p className="text-white/80 mb-10 font-medium">
              You and {matchedUser.firstName} liked each other.
            </p>
          </motion.div>

          {/* Overlapping Photos */}
          <div className="flex justify-center items-center mb-12 relative h-40">
            <motion.div
              initial={{ x: -60, rotate: -10, opacity: 0 }}
              animate={{ x: -20, rotate: -5, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-32 h-32 rounded-2xl border-4 border-[#22d3ee] overflow-hidden shadow-2xl z-10 bg-white/5"
            >
              <img 
                src={currentUser?.photoUrl || "https://github.com/shadcn.png"} 
                className="w-full h-full object-cover" 
                alt="Me" 
              />
            </motion.div>

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute z-20 bg-black p-2 rounded-full border border-white/20"
            >
              <Heart className="w-8 h-8 text-[#ec4899] fill-[#ec4899]" />
            </motion.div>

            <motion.div
              initial={{ x: 60, rotate: 10, opacity: 0 }}
              animate={{ x: 20, rotate: 5, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-32 h-32 rounded-2xl border-4 border-[#ec4899] overflow-hidden shadow-2xl bg-white/5"
            >
              <img 
                src={matchedUser.photoUrl || "https://github.com/shadcn.png"} 
                className="w-full h-full object-cover" 
                alt="Match" 
              />
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col gap-4"
          >
            <Button 
              className="h-14 bg-[#22d3ee] text-black hover:bg-[#22d3ee]/90 text-lg font-bold rounded-full flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:scale-105 transition-all"
              onClick={handleSendMessage}
            >
              <MessageCircle className="w-6 h-6 fill-black" />
              SEND MESSAGE
            </Button>
            
            <Button 
              variant="outline"
              className="h-14 border-white/20 text-white hover:bg-white/10 text-lg font-bold rounded-full transition-all"
              onClick={onClose}
            >
              KEEP SWIPING
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MatchModal;