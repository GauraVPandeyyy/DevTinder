import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { Check, X, MapPin, Briefcase, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const UserCard = ({ user, onAction }) => {
  const controls = useAnimation();
  const x = useMotionValue(0);

  // Map the X drag distance to rotation (tilt) and opacity
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-300, -100, 0, 100, 300], [0, 1, 1, 1, 0]);

  // Color overlays for visual feedback while dragging
  const likeOpacity = useTransform(x, [10, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-10, -100], [0, 1]);

  const handleDragEnd = async (event, info) => {
    const threshold = 100; // Drag distance required to trigger swipe
    if (info.offset.x > threshold) {
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } });
      onAction("interested", user._id);
    } else if (info.offset.x < -threshold) {
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } });
      onAction("ignored", user._id);
    } else {
      // Spring back to center if not dragged far enough
      controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  };

  const handleButtonSwipe = async (type) => {
    const direction = type === "interested" ? 500 : -500;
    await controls.start({ x: direction, opacity: 0, rotate: type === "interested" ? 15 : -15, transition: { duration: 0.3 } });
    onAction(type, user._id);
  };

  return (
    <motion.div
      className="absolute w-full max-w-sm cursor-grab active:cursor-grabbing "
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
    >
<div className="relative overflow-hidden rounded-3xl bg-card border border-border/50 shadow-2xl aspect-[3/4] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]">        {/* Swipe Feedback Overlays */}
        <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 z-20 border-4 border-green-500 rounded-lg px-4 py-1">
          <p className="text-3xl font-bold text-green-500 uppercase tracking-wider">Like</p>
        </motion.div>
        <motion.div style={{ opacity: nopeOpacity }} className="absolute top-8 right-8 z-20 border-4 border-red-500 rounded-lg px-4 py-1">
          <p className="text-3xl font-bold text-red-500 uppercase tracking-wider">Nope</p>
        </motion.div>

        {/* Profile Image with Gradient Fade */}
        <div className="absolute inset-0 z-0">
          <motion.img
  src={user.photoUrl || "https://github.com/shadcn.png"}
  alt={user.firstName}
  className="w-full h-full object-cover"
  draggable="false"
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.4 }}
/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </div>

        {/* User Info Content */}
        <div className="absolute bottom-0 z-10 w-full p-6 text-white">
          <h2 className="text-3xl font-bold mb-1">
            {user.firstName} {user.lastName} <span className="text-xl font-normal text-white/80">{user.age}</span>
          </h2>
          
          <div className="space-y-2 mb-4">
            {user.about && <p className="text-sm text-white/90 line-clamp-2">{user.about}</p>}
            
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Briefcase className="w-4 h-4" />
              <span>{user.jobTitle || "Software Engineer"}</span>
            </div>
          </div>

          {/* Skills Tags */}
          {user.skills && user.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {user.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none">
                  {skill}
                </Badge>
              ))}
              {user.skills.length > 3 && (
                <Badge variant="secondary" className="bg-white/10 text-white/70 border-none">
                  +{user.skills.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-white/20">
            <Button 
              size="icon" 
              variant="outline" 
              className="h-14 w-14 rounded-full border-red-500 text-red-500 bg-black/50 hover:bg-red-500 hover:text-white transition-all"
              onClick={() => handleButtonSwipe("ignored")}
            >
              <X className="w-6 h-6" />
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              className="h-14 w-14 rounded-full border-green-500 text-green-500 bg-black/50 hover:bg-green-500 hover:text-white transition-all"
              onClick={() => handleButtonSwipe("interested")}
            >
              <Check className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;