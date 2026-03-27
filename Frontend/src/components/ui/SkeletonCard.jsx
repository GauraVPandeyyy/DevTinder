import { motion } from "framer-motion";

const SkeletonCard = () => {
  return (
    <motion.div
      className="w-full max-w-sm h-[500px] rounded-3xl bg-muted/50 animate-pulse"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="h-full w-full bg-gradient-to-t from-muted via-muted/50 to-muted rounded-3xl" />
    </motion.div>
  );
};

export default SkeletonCard;