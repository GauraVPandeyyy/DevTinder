import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, MessageSquare, Users } from "lucide-react";
import api from "@/services/api";
import { setConnections } from "@/store/connectionSlice";
import createSocketConnection from "@/utils/socket";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const [isLoading, setIsLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    const socket = createSocketConnection();

    // 🟢 get initial online users
    socket.emit("getOnlineUsers");

    socket.on("onlineUsersList", (users) => {
      setOnlineUsers(new Set(users));
    });

    // 🟢 real-time online
    socket.on("userOnline", ({ userId }) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    });

    // 🔴 real-time offline
    socket.on("userOffline", ({ userId }) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await api.get("/user/connections");
        dispatch(setConnections(res.data.data));
      } catch (error) {
        console.error("Failed to fetch connections", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConnections();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100dvh-5rem)] items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-[#22d3ee]" />
      </div>
    );
  }

  // Animation variants for the staggering effect
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="min-h-[calc(100dvh-5rem)] bg-background w-full px-4 py-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Your Matches
          </h1>
          <p className="text-muted-foreground">
            Start a conversation with developers who matched with you.
          </p>
        </div>

        {!connections || connections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
              <Users className="w-10 h-10 text-[#22d3ee]" />
            </div>
            <h3 className="text-xl font-semibold text-white">No matches yet</h3>
            <p className="text-muted-foreground max-w-xs">
              Keep swiping to connect with other amazing developers!
            </p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-3"
          >
            {connections.map((conn) => {
              const { _id, firstName, lastName, photoUrl, jobTitle } = conn;
              console.log("connn-", conn);
              return (
                <motion.div key={_id} variants={item}>
                  <Link
                    to={`/chat/${_id}`}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all group"
                  >
                    {/* Glowing Avatar */}
                    <div className="relative">
                      <div
                        className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#22d3ee]/50 shadow-[0_0_15px_rgba(34,211,238,0.2)] group-hover:border-[#22d3ee] transition-colors"
                        // onClick={() => navigate(`/user/${chatUser._id}`)}
                      >
                        <img
                          src={photoUrl || "https://github.com/shadcn.png"}
                          alt={firstName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {onlineUsers.has(_id) && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full" />
                      )}{" "}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-lg text-white truncate">
                        {firstName} {lastName}
                      </h2>
                      <p className="text-sm font-medium text-[#22d3ee] truncate">
                        {jobTitle || "Software Engineer"}
                      </p>
                    </div>

                    {/* Action Icon */}
                    <div className="w-10 h-10 rounded-full bg-[#22d3ee]/10 flex items-center justify-center group-hover:bg-[#22d3ee] group-hover:text-black text-[#22d3ee] transition-all">
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

export default Connections;
