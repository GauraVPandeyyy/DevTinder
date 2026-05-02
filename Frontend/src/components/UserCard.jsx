import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
} from "framer-motion";
import { Check, X, Briefcase, Sparkles, ChevronDown } from "lucide-react";

const UserCard = ({ user, onAction, onRemove }) => {
  const controls = useAnimation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const likeOpacity = useTransform(x, [10, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-10, -100], [0, 1]);
  const skipOpacity = useTransform(y, [10, 100], [0, 1]);

  const handleSwipe = async (type) => {
    let targetX = 0;
    let targetY = 0;
    let targetRotate = 0;

    if (type === "like") {
      targetX = window.innerWidth + 200;
      targetRotate = 15;
    } else if (type === "pass") {
      targetX = -window.innerWidth - 200;
      targetRotate = -15;
    } else if (type === "skip") {
      targetY = window.innerHeight + 200;
    }

    try {
      // 1. Instant Animation Feedback (No API blocking)
      controls.start({
        x: targetX,
        y: targetY,
        rotate: targetRotate,
        opacity: 0,
        transition: { duration: 0.3, ease: "easeOut" }
      });

      // 2. Remove visually from stack quickly
      if (onRemove) {
        setTimeout(() => onRemove(user._id), 300);
      }

      // 3. Fire API purely in background
      // Match ki checking ab Feed.jsx sambhal lega
      await onAction(type, user._id);

    } catch (error) {
      // Revert card if API throws error
      controls.start({ x: 0, y: 0, opacity: 1, rotate: 0, transition: { type: "spring" } });
    }
  };

  const handleDragEnd = async (event, info) => {
    const threshold = 100;
    if (info.offset.y > threshold && info.offset.y > Math.abs(info.offset.x)) {
      handleSwipe("skip");
    } else if (info.offset.x > threshold) {
      handleSwipe("like");
    } else if (info.offset.x < -threshold) {
      handleSwipe("pass");
    } else {
      controls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 300, damping: 22 } });
    }
  };

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none z-10 hover:z-20"
      style={{ x, y, rotate, willChange: "transform" }}
      drag 
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
    >
      <div className="relative w-full h-full overflow-hidden rounded-[2.5rem] bg-black shadow-lg border-[0.5px] border-white/10 group">
        
        <img
          src={user.photoUrl || "https://github.com/shadcn.png"}
          alt={user.firstName}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable="false"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-transparent opacity-90 pointer-events-none" />

        <motion.div style={{ opacity: likeOpacity }} className="absolute top-10 left-8 z-30 border-[3px] border-[#22d3ee] rounded-xl px-6 py-2 -rotate-12 pointer-events-none bg-black/60">
          <p className="text-4xl font-black text-[#22d3ee] uppercase tracking-widest drop-shadow-lg">Match</p>
        </motion.div>
        
        <motion.div style={{ opacity: nopeOpacity }} className="absolute top-10 right-8 z-30 border-[3px] border-[#ef4444] rounded-xl px-6 py-2 rotate-12 pointer-events-none bg-black/60">
          <p className="text-4xl font-black text-[#ef4444] uppercase tracking-widest drop-shadow-lg">Pass</p>
        </motion.div>

        <motion.div style={{ opacity: skipOpacity }} className="absolute top-10 left-1/2 -translate-x-1/2 z-30 border-[3px] border-yellow-500 rounded-xl px-8 py-2 pointer-events-none bg-black/60">
          <p className="text-3xl font-black text-yellow-500 uppercase tracking-widest drop-shadow-lg">Skip</p>
        </motion.div>

        <div className="absolute bottom-0 z-20 w-full p-5 pb-6 flex flex-col justify-end text-white">
          <div className="flex items-end gap-3 mb-1">
            <h2 className="text-4xl font-bold tracking-tight drop-shadow-md truncate">
              {user.firstName}
            </h2>
            <span className="text-2xl font-medium text-white/70 pb-[3px] drop-shadow-md">{user.age}</span>
          </div>
           {user.matchScore !== undefined && (
            <div className="text-sm text-green-400 font-semibold mb-2">
              Match: {user.matchScore}%
            </div>
          )}
          <div className="flex items-center gap-2 text-[14px] text-[#22d3ee] mb-4 font-medium drop-shadow-md">
            <Briefcase className="w-4 h-4" />
            <span className="truncate">{user.jobTitle || "Software Engineer"}</span>
          </div>

          {user.about && (
            <p className="text-sm text-white/80 line-clamp-2 leading-relaxed mb-5 font-light">
              {user.about}
            </p>
          )}

          {user.skills && user.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {user.skills.slice(0, 3).map((skill, index) => (
                <div key={index} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-medium tracking-wide flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#22d3ee]" />
                  {skill}
                </div>
              ))}
              {user.skills.length > 3 && (
                <div className="px-3 py-1.5 rounded-full bg-white/5 text-white/50 text-xs font-medium tracking-wide">
                  +{user.skills.length - 3}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => handleSwipe("pass")}
              className="flex items-center justify-center w-14 h-14 rounded-full border border-red-500/50 bg-black/60 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg hover:scale-110"
            >
              <X className="w-8 h-8 stroke-[2px]" />
            </button>

            <button
              onClick={() => handleSwipe("skip")}
              className="flex items-center justify-center w-12 h-12 mt-1 rounded-full border border-yellow-500/50 bg-black/60 text-yellow-500 hover:bg-yellow-500 hover:text-white transition-all shadow-lg hover:scale-110"
            >
              <ChevronDown className="w-6 h-6 stroke-[2px]" />
            </button>

            <button
              onClick={() => handleSwipe("like")}
              className="flex items-center justify-center w-14 h-14 rounded-full border border-green-500/50 bg-black/60 text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-lg hover:scale-110"
            >
              <Check className="w-8 h-8 stroke-[3px]" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;