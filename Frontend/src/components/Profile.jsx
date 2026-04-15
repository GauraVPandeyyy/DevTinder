import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import EditProfile from "./EditProfile";

const Profile = () => {
  const user = useSelector((store) => store.user);

  if (!user) return null;

  return (
    <div className="min-h-[calc(100dvh-5rem)] bg-background w-full pb-20 md:pb-8 pt-4 md:pt-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-4xl mx-auto space-y-8"
      >
        <div className="text-center md:text-left md:px-4">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">Your Profile</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage how you appear to other developers on DevTinder.
          </p>
        </div>
        
        <EditProfile user={user} />
      </motion.div>
    </div>
  );
};

export default Profile;