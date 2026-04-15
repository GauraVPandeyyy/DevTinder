import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { Check, X, Briefcase, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const UserCard = ({ user, onAction }) => {
  const controls = useAnimation();
  const x = useMotionValue(0);

  // Smooth rotational physics
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-300, -100, 0, 100, 300], [0, 1, 1, 1, 0]);

  // Vibrant Overlays
  const likeOpacity = useTransform(x, [10, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-10, -100], [0, 1]);

  const handleDragEnd = async (event, info) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } });
      onAction("interested", user._id);
    } else if (info.offset.x < -threshold) {
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } });
      onAction("ignored", user._id);
    } else {
      controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 22 } });
    }
  };

  const handleButtonSwipe = async (type) => {
    const direction = type === "interested" ? 500 : -500;
    await controls.start({ 
      x: direction, 
      opacity: 0, 
      rotate: type === "interested" ? 10 : -10, 
      transition: { duration: 0.3 } 
    });
    onAction(type, user._id);
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 cursor-grab active:cursor-grabbing touch-none"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
    >
      {/* The Container: Purely structural. No visible background. 
        It relies entirely on the image and border for its shape.
      */}
      <div className="relative w-full h-full overflow-hidden rounded-[2.5rem] bg-black shadow-[0_10px_40px_rgba(0,0,0,0.5)] border-[0.5px] border-white/10 group">
        
        {/* Full Bleed Profile Image */}
        <img
          src={user.photoUrl || "https://github.com/shadcn.png"}
          alt={user.firstName}
          className="absolute inset-0 z-10 w-full h-full object-cover pointer-events-none"
          draggable="false"
        />

        {/* Heavy Gradient Overlay: 
          Crucial for making white text readable over bright images 
        */}
        <div className="absolute z-10 inset-0 bg-gradient-to-t from-[#030305] via-[#09090b]/60 to-transparent opacity-90 pointer-events-none" />

        {/* Swipe Overlays */}
        <motion.div style={{ opacity: likeOpacity }} className="absolute top-10 left-8 z-20 border-[3px] border-[#22d3ee] rounded-xl px-6 py-2 -rotate-12 pointer-events-none shadow-[0_0_30px_rgba(34,211,238,0.4)]">
          <p className="text-4xl font-black text-[#22d3ee] uppercase tracking-widest drop-shadow-lg">Match</p>
        </motion.div>
        <motion.div style={{ opacity: nopeOpacity }} className="absolute top-10 right-8 z-20 border-[3px] border-[#ef4444] rounded-xl px-6 py-2 rotate-12 pointer-events-none shadow-[0_0_30px_rgba(239,68,68,0.4)]">
          <p className="text-4xl font-black text-[#ef4444] uppercase tracking-widest drop-shadow-lg">Skip</p>
        </motion.div>

        {/* Content Wrapper - Pushed to the bottom */}
        <div className="absolute bottom-0 z-10 w-full p-6 pb-8 flex flex-col justify-end text-white">
          
          {/* Header */}
          <div className="flex items-end gap-3 mb-2">
            <h2 className="text-4xl font-bold tracking-tight drop-shadow-md">
              {user.firstName}
            </h2>
            <span className="text-2xl font-medium text-white/70 pb-[3px] drop-shadow-md">{user.age}</span>
          </div>
          
          {/* Job / Status */}
          <div className="flex items-center gap-2 text-[15px] text-[#22d3ee] mb-4 font-medium drop-shadow-md">
            <Briefcase className="w-4 h-4" />
            <span>{user.jobTitle || "Software Engineer"}</span>
          </div>

          {/* About */}
          {user.about && (
            <p className="text-sm text-white/80 line-clamp-2 leading-relaxed mb-5 font-light">
              {user.about}
            </p>
          )}

          {/* Pill-shaped Skills (No more blocky badges) */}
          {user.skills && user.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
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

          {/* Modern Action Buttons */}
          <div className="flex justify-center gap-6 pt-2">
            <Button 
              size="icon" 
              className="h-16 w-16 rounded-full border border-[#ef4444]/30 text-[#ef4444] bg-black/40 backdrop-blur-xl hover:bg-[#ef4444] hover:text-white hover:border-[#ef4444] transition-all shadow-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:scale-105"
              onClick={() => handleButtonSwipe("ignored")}
            >
              <X className="w-8 h-8 stroke-[2.5px]" />
            </Button>
            <Button 
              size="icon" 
              className="h-16 w-16 rounded-full border border-[#22d3ee]/30 text-[#22d3ee] bg-black/40 backdrop-blur-xl hover:bg-[#22d3ee] hover:text-black hover:border-[#22d3ee] transition-all shadow-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:scale-105"
              onClick={() => handleButtonSwipe("interested")}
            >
              <Check className="w-8 h-8 stroke-[3px]" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;