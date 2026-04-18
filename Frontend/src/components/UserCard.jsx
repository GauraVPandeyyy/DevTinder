import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { Check, X, Briefcase, Sparkles, ChevronDown, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

const UserCard = ({ user, onAction, onRemove }) => {
  const controls = useAnimation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth rotational physics
  const rotate = useTransform(x, [-200, 200], [-10, 10]);

  // MUTUALLY EXCLUSIVE OVERLAYS
  // These transforms compare X and Y to ensure only the dominant direction shows an overlay
  const likeOpacity = useTransform([x, y], ([latestX, latestY]) => {
    if (latestX > 20 && Math.abs(latestX) > latestY) return Math.min((latestX - 20) / 80, 1);
    return 0;
  });

  const nopeOpacity = useTransform([x, y], ([latestX, latestY]) => {
    if (latestX < -20 && Math.abs(latestX) > latestY) return Math.min((Math.abs(latestX) - 20) / 80, 1);
    return 0;
  });

  const skipOpacity = useTransform([x, y], ([latestX, latestY]) => {
    if (latestY > 20 && latestY > Math.abs(latestX)) return Math.min((latestY - 20) / 80, 1);
    return 0;
  });

  const processAction = async (type, targetX, targetY, targetRotate) => {
    try {
      // Subtle interaction feedback before API finishes
      if (type === 'like') controls.start({ scale: 1.02 });
      else controls.start({ scale: 0.98 });

      // Call API via Feed.jsx
      const response = await onAction(type, user._id);

      // 🎉 MATCH CELEBRATION!
      if (type === 'like' && response?.isMatch) {
        
        // Fire Confetti
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.4 },
          colors: ['#22d3ee', '#ec4899', '#eab308']
        });

        // Trigger Custom Beautiful Toast
        toast.custom((t) => (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-[#09090b]/90 backdrop-blur-xl shadow-[0_0_40px_rgba(34,211,238,0.3)] rounded-[2rem] pointer-events-auto flex ring-1 ring-white/10 border border-[#22d3ee]/50 overflow-hidden z-50`}
          >
            <div className="flex-1 w-0 p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-[#22d3ee] to-[#0284c7] rounded-2xl shadow-lg">
                  <HeartHandshake className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xl font-black text-white tracking-tight">
                    It's a Match! 🎉
                  </p>
                  <p className="text-sm text-[#22d3ee] font-medium mt-0.5">
                    You and {user.firstName} liked each other.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ), { duration: 4000 });

        // The Match Card Animation: Lift up, hold, then swipe out
        await controls.start({
          x: 0, y: -40, rotate: 0, scale: 1.05,
          transition: { type: "spring", stiffness: 300, damping: 20 }
        });

        // Wait 1.5 seconds so user can enjoy the moment
        await new Promise(res => setTimeout(res, 1500));

        // Smoothly swipe out right
        await controls.start({
          x: window.innerWidth + 200, opacity: 0,
          transition: { duration: 0.5, ease: "easeInOut" }
        });

      } else {
        // Standard Exit Animation (Pass, Skip, or Like without Match)
        await controls.start({
          x: targetX, y: targetY, rotate: targetRotate, opacity: 0,
          transition: { duration: 0.4, ease: "easeOut" }
        });
      }

      // Finally, remove from Feed UI stack
      onRemove(user._id);

    } catch (error) {
      // If API fails, spring the card back to the center
      controls.start({ x: 0, y: 0, scale: 1, rotate: 0, transition: { type: "spring" } });
      toast.error("Network error. Try swiping again.");
    }
  };

  const handleDragEnd = async (event, info) => {
    const threshold = 100;
    
    // Strict determination of the dominant drag direction
    const isSkip = info.offset.y > threshold && info.offset.y > Math.abs(info.offset.x);
    const isLike = info.offset.x > threshold && !isSkip;
    const isPass = info.offset.x < -threshold && !isSkip;

    if (isSkip) await processAction("skip", 0, window.innerHeight, 0);
    else if (isLike) await processAction("like", window.innerWidth, 0, 15);
    else if (isPass) await processAction("pass", -window.innerWidth, 0, -15);
    else {
      // Snap back if threshold not met
      controls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 300, damping: 22 } });
    }
  };

  const handleButtonAction = async (type) => {
    if (type === 'like') await processAction("like", window.innerWidth, 0, 15);
    else if (type === 'pass') await processAction("pass", -window.innerWidth, 0, -15);
    else if (type === 'skip') await processAction("skip", 0, window.innerHeight, 0);
  };

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none z-1"
      style={{ x, y, rotate }}
      drag // Unrestricted drag for both X and Y
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} // Elastic spring back
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      animate={controls}
    >
      <div className="relative w-full h-full overflow-hidden rounded-[2.5rem] bg-black shadow-[0_10px_40px_rgba(0,0,0,0.5)] border-[0.5px] border-white/10 group">
        
        {/* Full Bleed Profile Image */}
        <img
          src={user.photoUrl || "https://github.com/shadcn.png"}
          alt={user.firstName}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable="false"
        />

        {/* Heavy Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-transparent opacity-90 pointer-events-none" />

        {/* --- DYNAMIC MUTUALLY EXCLUSIVE SWIPE OVERLAYS --- */}
        <motion.div style={{ opacity: likeOpacity }} className="absolute top-10 left-8 z-20 border-[3px] border-[#22d3ee] rounded-xl px-6 py-2 -rotate-12 pointer-events-none shadow-[0_0_30px_rgba(34,211,238,0.4)]">
          <p className="text-4xl font-black text-[#22d3ee] uppercase tracking-widest drop-shadow-lg">Match</p>
        </motion.div>
        
        <motion.div style={{ opacity: nopeOpacity }} className="absolute top-10 right-8 z-20 border-[3px] border-[#ef4444] rounded-xl px-6 py-2 rotate-12 pointer-events-none shadow-[0_0_30px_rgba(239,68,68,0.4)]">
          <p className="text-4xl font-black text-[#ef4444] uppercase tracking-widest drop-shadow-lg">Pass</p>
        </motion.div>

        <motion.div style={{ opacity: skipOpacity }} className="absolute top-10 left-1/2 -translate-x-1/2 z-20 border-[3px] border-yellow-500 rounded-xl px-8 py-2 pointer-events-none shadow-[0_0_30px_rgba(234,179,8,0.4)] bg-black/40 backdrop-blur-sm">
          <p className="text-3xl font-black text-yellow-500 uppercase tracking-widest drop-shadow-lg">Skip</p>
        </motion.div>

        {/* Content Wrapper */}
        <div className="absolute bottom-0 z-20 w-full p-5 pb-6 flex flex-col justify-end text-white">
          
          <div className="flex items-end gap-3 mb-1">
            <h2 className="text-4xl font-bold tracking-tight drop-shadow-md truncate">
              {user.firstName}
            </h2>
            <span className="text-2xl font-medium text-white/70 pb-[3px] drop-shadow-md">{user.age}</span>
          </div>
          
          <div className="flex items-center gap-2 text-[14px] text-[#22d3ee] mb-4 font-medium drop-shadow-md">
            <Briefcase className="w-4 h-4" />
            <span className="truncate">{user.jobTitle || "Software Engineer"}</span>
          </div>

          {user.skills && user.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {user.skills.slice(0, 3).map((skill, index) => (
                <div key={index} className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium tracking-wide flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#22d3ee]" />
                  {skill}
                </div>
              ))}
              {user.skills.length > 3 && (
                <div className="px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md text-white/50 text-xs font-medium tracking-wide">
                  +{user.skills.length - 3}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-2">
            <Button 
              size="icon" 
              className="h-14 w-14 rounded-full border border-[#ef4444]/30 text-[#ef4444] bg-black/40 backdrop-blur-xl hover:bg-[#ef4444] hover:text-white transition-all shadow-lg hover:scale-105"
              onClick={() => handleButtonAction("pass")}
            >
              <X className="w-7 h-7 stroke-[2.5px]" />
            </Button>

            <Button 
              size="icon" 
              className="h-12 w-12 mt-1 rounded-full border border-yellow-500/30 text-yellow-500 bg-black/40 backdrop-blur-xl hover:bg-yellow-500 hover:text-white transition-all shadow-lg hover:scale-105"
              onClick={() => handleButtonAction("skip")}
            >
              <ChevronDown className="w-6 h-6 stroke-[2.5px]" />
            </Button>

            <Button 
              size="icon" 
              className="h-14 w-14 rounded-full border border-[#22d3ee]/30 text-[#22d3ee] bg-black/40 backdrop-blur-xl hover:bg-[#22d3ee] hover:text-black transition-all shadow-lg hover:scale-105"
              onClick={() => handleButtonAction("like")}
            >
              <Check className="w-7 h-7 stroke-[3px]" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;