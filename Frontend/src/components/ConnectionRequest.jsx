import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Loader2, Check, X, BellOff } from "lucide-react";
import api from "@/services/api";
import { setRequests, removeRequest } from "@/store/RequestSlice";

export const ConnectionRequest = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get("/user/request/received");
        dispatch(setRequests(res.data.data));
      } catch (error) {
        console.error("Failed to fetch requests", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, [dispatch]);

  const reviewRequest = async (status, requestId, userName) => {
    try {
      await api.post(`/request/review/${status}/${requestId}`);
      dispatch(removeRequest(requestId));
      // Removed toast from here as per your original file logic, assuming it's handled globally or unneeded
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100dvh-5rem)] items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-[#22d3ee]" />
      </div>
    );
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-[calc(100dvh-5rem)] bg-background w-full px-4 py-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Pending Requests</h1>
          <p className="text-muted-foreground">People who want to connect with you.</p>
        </div>

        {!requests || requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <BellOff className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-white">All caught up</h3>
            <p className="text-muted-foreground max-w-xs">You don't have any pending requests right now.</p>
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-4"
          >
            {requests.map((request) => {
              const user = request.fromUserId;
              if (!user) return null;

              return (
                <motion.div 
                  key={request._id} 
                  variants={item}
                  layout // This animates the list when an item is removed!
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5 shadow-lg relative overflow-hidden"
                >
                  {/* Subtle background glow effect based on accent color */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#22d3ee]/5 rounded-full blur-3xl pointer-events-none" />

                  {/* Avatar */}
                  <div className="w-16 h-16 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-white/20 shrink-0">
                    <img 
                      src={user.photoUrl || "https://github.com/shadcn.png"} 
                      alt={user.firstName} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 w-full">
                    <h2 className="font-bold text-lg text-white truncate">
                      {user.firstName} {user.lastName} <span className="text-white/60 font-normal text-sm ml-1">{user.age}</span>
                    </h2>
                    <p className="text-sm font-medium text-[#22d3ee] truncate">
                      {user.jobTitle || "Developer"}
                    </p>
                    {user.about && (
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1 font-light pr-4">
                        {user.about}
                      </p>
                    )}
                  </div>

                  {/* Actions - Modern Circular Buttons */}
                  <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-white/5 sm:border-0 justify-end">
                    <button
                      onClick={() => reviewRequest("rejected", request._id, user.firstName)}
                      className="flex items-center justify-center w-12 h-12 rounded-full border border-[#ef4444]/30 bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444] hover:text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                      aria-label="Decline request"
                    >
                      <X className="w-5 h-5 stroke-[2.5px]" />
                    </button>
                    <button
                      onClick={() => reviewRequest("accepted", request._id, user.firstName)}
                      className="flex items-center justify-center w-12 h-12 rounded-full border border-[#22d3ee]/30 bg-[#22d3ee]/10 text-[#22d3ee] hover:bg-[#22d3ee] hover:text-black transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                      aria-label="Accept request"
                    >
                      <Check className="w-5 h-5 stroke-[3px]" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};