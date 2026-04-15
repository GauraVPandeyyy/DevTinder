import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, Briefcase, Sparkles, User as UserIcon } from "lucide-react";
import api from "@/services/api";

const ChatUserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/user/${id}`);
        setUser(res.data.user || res.data.data); // Fallback in case of data wrapping
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [id]);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#09090b]">
        <Loader2 className="w-12 h-12 animate-spin text-[#22d3ee]" />
      </div>
    );
  }

  const pronoun =
    user.gender === "male"
      ? "He/Him"
      : user.gender === "female"
      ? "She/Her"
      : "They/Them";

  return (
    <div className="min-h-screen bg-[#09090b] text-white relative pb-24 md:pb-12">
      
      {/* Floating Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="fixed top-6 left-4 md:left-8 z-50 p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.5)] group"
      >
        <ArrowLeft className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" />
      </button>

      {/* Hero Image Section */}
      <div className="relative w-full h-[55vh] md:h-[65vh]">
        <img
          src={user.photoUrl || "https://github.com/shadcn.png"}
          alt={user.firstName}
          className="w-full h-full object-cover"
        />
        {/* Heavy gradient to smoothly blend the image into the background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent" />
      </div>

      {/* Content Section (Sliding up over the image) */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 -mt-24 px-5 max-w-2xl mx-auto space-y-6"
      >
        {/* Header Info */}
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-end justify-center md:justify-start gap-3 drop-shadow-lg">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              {user.firstName} {user.lastName}
            </h1>
            <span className="text-2xl md:text-3xl text-white/70 font-medium pb-[3px]">
              {user.age}
            </span>
          </div>
          
          <div className="flex items-center justify-center md:justify-start gap-2 text-[#22d3ee] font-medium text-lg">
            <Briefcase className="w-5 h-5" />
            <span>{user.jobTitle || "Software Engineer"}</span>
          </div>
        </div>

        {/* Tags / Badges */}
        <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
          {user.gender && (
            <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white/80 backdrop-blur-md">
              <UserIcon className="w-4 h-4 text-muted-foreground" />
              {pronoun}
            </div>
          )}
        </div>

        {/* About Section */}
        {user.about && (
          <div className="bg-white/[0.03] border border-white/5 p-6 md:p-8 rounded-[2rem] shadow-xl backdrop-blur-xl space-y-3">
            <h3 className="text-sm font-bold tracking-widest uppercase text-white/50">About</h3>
            <p className="text-white/90 leading-relaxed font-light text-[15px] md:text-base whitespace-pre-wrap">
              {user.about}
            </p>
          </div>
        )}

        {/* Skills Section */}
        {user.skills && user.skills.length > 0 && (
          <div className="bg-white/[0.03] border border-white/5 p-6 md:p-8 rounded-[2rem] shadow-xl backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold tracking-widest uppercase text-white/50 mb-2">Tech Stack</h3>
            <div className="flex flex-wrap gap-2.5">
              {user.skills.map((skill, i) => (
                <div 
                  key={i}
                  className="px-4 py-2 rounded-xl bg-gradient-to-br from-[#22d3ee]/10 to-[#0284c7]/10 border border-[#22d3ee]/20 text-[#22d3ee] text-sm font-semibold tracking-wide flex items-center gap-1.5 shadow-[0_0_10px_rgba(34,211,238,0.05)]"
                >
                  <Sparkles className="w-3.5 h-3.5 opacity-70" />
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ChatUserProfile;