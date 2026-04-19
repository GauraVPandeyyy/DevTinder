import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, Briefcase, Sparkles, User as UserIcon, Calendar, Info } from "lucide-react";
import api from "@/services/api";

const ChatUserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/user/${id}`);
        // Handle varying backend response structures
        setUser(res.data.user || res.data.data || res.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (isLoading || !user) {
    return (
      <div className="flex h-[calc(100dvh-5rem)] items-center justify-center bg-[#09090b]">
        <Loader2 className="w-12 h-12 animate-spin text-[#22d3ee]" />
      </div>
    );
  }

  // Formatting helpers
  const pronoun = user.gender?.toLowerCase() === "male" ? "Male" 
                : user.gender?.toLowerCase() === "female" ? "Female" 
                : user.gender || "Not specified";

  return (
    <div className="min-h-[calc(100dvh-5rem)] bg-background w-full py-6 px-4 md:py-10 flex justify-center">
      
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-lg bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6 md:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col"
      >
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#22d3ee]/5 rounded-full blur-[80px] pointer-events-none" />

        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition-all group"
          >
            <ArrowLeft className="w-5 h-5 text-white group-hover:-translate-x-1 transition-transform" />
          </button>
          <span className="text-sm font-bold tracking-widest text-[#22d3ee] uppercase">Developer Profile</span>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Profile Image */}
        <div className="relative w-36 h-36 mx-auto mb-6">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#22d3ee] to-[#0284c7] blur-xl opacity-30 rounded-full animate-pulse" />
          <img
            src={user.photoUrl || "https://github.com/shadcn.png"}
            alt={user.firstName}
            className="w-full h-full object-cover rounded-full border-4 border-[#09090b] shadow-[0_0_0_2px_rgba(34,211,238,0.5)] relative z-10"
            onError={(e) => { e.target.src = "https://github.com/shadcn.png" }}
          />
        </div>

        {/* Basic Info (Name & Job) */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md">
            {user.firstName} {user.lastName}
          </h1>
          <div className="flex items-center justify-center gap-2 text-[#22d3ee] font-medium text-base">
            <Briefcase className="w-4 h-4" />
            <span>{user.jobTitle || "Software Engineer"}</span>
          </div>
        </div>

        {/* Quick Stats Grid (Age & Gender) */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-1">
            <Calendar className="w-5 h-5 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Age</span>
            <span className="text-lg font-bold text-white">{user.age || "N/A"}</span>
          </div>
          <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-1">
            <UserIcon className="w-5 h-5 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Gender</span>
            <span className="text-lg font-bold text-white capitalize">{pronoun}</span>
          </div>
        </div>

        {/* About Section */}
        {user.about && (
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 mb-8">
            <div className="flex items-center gap-2 mb-3 text-white/50">
              <Info className="w-4 h-4" />
              <h3 className="text-xs font-bold tracking-widest uppercase">About Me</h3>
            </div>
            <p className="text-white/80 leading-relaxed font-light text-[15px] whitespace-pre-wrap">
              {user.about}
            </p>
          </div>
        )}

        {/* Skills Section */}
        {user.skills && user.skills.length > 0 && (
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4 text-white/50">
              <Sparkles className="w-4 h-4 text-[#22d3ee]" />
              <h3 className="text-xs font-bold tracking-widest uppercase text-[#22d3ee]">Tech Stack</h3>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {user.skills.map((skill, i) => (
                <span 
                  key={i} 
                  className="px-4 py-2 rounded-xl bg-gradient-to-br from-[#22d3ee]/10 to-[#0284c7]/10 border border-[#22d3ee]/20 text-[#22d3ee] text-sm font-semibold tracking-wide"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};

export default ChatUserProfile;