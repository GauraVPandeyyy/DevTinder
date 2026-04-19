import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, MessageSquare, Users } from "lucide-react";
import api from "@/services/api";
import { setMatches } from "@/store/matchesSlice";
import createSocketConnection from "@/utils/socket";

const Matches = () => {
  const dispatch = useDispatch();
  const matches = useSelector((store) => store.matches);
  const [isLoading, setIsLoading] = useState(true);
  
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Set());

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get("/user/matches");
        dispatch(setMatches(res.data.data));
      } catch (error) {
        console.error("Failed to fetch matches", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMatches();
  }, [dispatch]);

  useEffect(() => {
    const socket = createSocketConnection();

    // 🟢 Online Status Listeners
    socket.emit("getOnlineUsers");
    
    socket.on("onlineUsersList", (users) => {
      setOnlineUsers(new Set(users));
    });

    socket.on("userOnline", ({ userId }) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    });

    socket.on("userOffline", ({ userId }) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
      // Also remove them from typing if they go offline
      setTypingUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    });

    // 💬 Typing Status Listeners
    socket.on("userTyping", ({ userId }) => {
      setTypingUsers((prev) => new Set(prev).add(userId));
    });
    
    socket.on("userStoppedTyping", ({ userId }) => {
      setTypingUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    });

    return () => socket.disconnect();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100dvh-5rem)] items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-[#22d3ee]" />
      </div>
    );
  }

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  return (
    <div className="min-h-[calc(100dvh-5rem)] bg-background w-full px-4 py-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Your Matches</h1>
          <p className="text-muted-foreground">Start a conversation with developers who matched with you.</p>
        </div>

        {!matches || matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
              <Users className="w-10 h-10 text-[#22d3ee]" />
            </div>
            <h3 className="text-xl font-semibold text-white">No matches yet</h3>
            <p className="text-muted-foreground max-w-xs">Keep swiping to connect with other amazing developers!</p>
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-3">
            {matches.map((conn) => {
              const { _id, firstName, lastName, photoUrl, jobTitle } = conn;
              const isOnline = onlineUsers.has(_id);
              const isTyping = typingUsers.has(_id);

              return (
                <motion.div key={_id} variants={item}>
                  <Link to={`/chat/${_id}`} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all group">
                    
                    {/* Avatar Area */}
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full overflow-hidden border border-white/10 bg-white/5 shrink-0">
                        <img src={photoUrl || "https://github.com/shadcn.png"} alt={firstName} className="w-full h-full object-cover" />
                      </div>
                      
                      {/* Show Online Dot ONLY if they are NOT typing */}
                      {isOnline && !isTyping && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                      )}
                    </div>

                    {/* User Info Area */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                         <h2 className="font-bold text-lg text-white truncate">{firstName} {lastName}</h2>
                      </div>
                      
                      {/* Conditional display: Show 'Typing...' if typing, otherwise show Job Title */}
                      {isTyping ? (
                        <p className="text-sm font-bold text-[#22d3ee] animate-pulse flex items-center gap-1">
                          Typing...
                        </p>
                      ) : (
                        <p className="text-sm font-medium text-white/60 truncate">
                          {jobTitle || "Software Engineer"}
                        </p>
                      )}
                    </div>

                    {/* Action Icon */}
                    <div className="w-10 h-10 shrink-0 rounded-full bg-[#22d3ee]/10 flex items-center justify-center group-hover:bg-[#22d3ee] group-hover:text-black text-[#22d3ee] transition-all">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Matches;