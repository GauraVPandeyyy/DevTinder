import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
} from "framer-motion";
import { Check, X, Briefcase, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/services/api";

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
      await controls.start({
        x: 500,
        opacity: 0,
        transition: { duration: 0.3 },
      });
      onAction("like", user._id);
    } else if (info.offset.x < -threshold) {
      await controls.start({
        x: -500,
        opacity: 0,
        transition: { duration: 0.3 },
      });
      onAction("pass", user._id);
    } else {
      controls.start({
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 22 },
      });
    }
  };

  const handleButtonSwipe = async (type) => {
    const direction = type === "like" ? 500 : -500;
    await controls.start({
      x: direction,
      opacity: 0,
      rotate: type === "like" ? 10 : -10,
      transition: { duration: 0.3 },
    });
    onAction(type, user._id);
  };

  const handleSwipe = async (type) => {
    await api.post(`/swipe/${type}/${user._id}`);
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
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-10 left-8 z-20 border-[3px] border-[#22d3ee] rounded-xl px-6 py-2 -rotate-12 pointer-events-none shadow-[0_0_30px_rgba(34,211,238,0.4)]"
        >
          <p className="text-4xl font-black text-[#22d3ee] uppercase tracking-widest drop-shadow-lg">
            Match
          </p>
        </motion.div>
        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute top-10 right-8 z-20 border-[3px] border-[#ef4444] rounded-xl px-6 py-2 rotate-12 pointer-events-none shadow-[0_0_30px_rgba(239,68,68,0.4)]"
        >
          <p className="text-4xl font-black text-[#ef4444] uppercase tracking-widest drop-shadow-lg">
            Skip
          </p>
        </motion.div>

        {/* Content Wrapper - Pushed to the bottom */}
        <div className="absolute bottom-0 z-10 w-full p-6 pb-8 flex flex-col justify-end text-white">
          {/* Header */}
          <div className="flex items-end gap-3 mb-2">
            <h2 className="text-4xl font-bold tracking-tight drop-shadow-md">
              {user.firstName}
            </h2>
            <span className="text-2xl font-medium text-white/70 pb-[3px] drop-shadow-md">
              {user.age}
            </span>
          </div>

          {user.matchScore !== undefined && (
            <div className="text-sm text-green-400 font-semibold mb-2">
              Match: {user.matchScore}%
            </div>
          )}
          {/* {user.commonSkills?.length > 0 && (
            <div className="text-xs text-white/60 mb-2">
              Common: {user.commonSkills.join(", ")}
            </div>
          )} */}

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
                <div
                  key={index}
                  className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium tracking-wide flex items-center gap-1"
                >
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
          <div className="flex justify-center gap-4 mt-4">
            {/* PASS */}
            <button
              onClick={() => handleButtonSwipe("pass")}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Nope
            </button>

            {/* SKIP */}
            <button
              onClick={() => handleButtonSwipe("skip")}
              className="px-4 py-2 bg-yellow-500 text-white rounded"
            >
              Skip
            </button>

            {/* LIKE */}
            <button
              onClick={() => handleButtonSwipe("like")}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Like
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;
