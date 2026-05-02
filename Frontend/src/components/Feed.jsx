import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFeed, removeFeed } from "@/store/feedSlice";
import api from "@/services/api";
import UserCard from "./UserCard";
import MatchModal from "./MatchModal";
import { Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Footer from "./Footer";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((state) => state.feed);
  const currentUser = useSelector((store) => store.user); // Redux se current user profile
  
  const [isLoading, setIsLoading] = useState(true);
  const [matchedUser, setMatchedUser] = useState(null); // Modal state
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      console.log("User installed the app");
    }
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  const fetchFeed = async () => {
    try {
      const res = await api.get("/user/feed");
      dispatch(setFeed(res.data.feed || []));
    } catch (error) {
      console.error("Error fetching feed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleAction = async (type, targetUserId) => {
    try {
      // 1. Data remove hone se pehle user ki details find karo
      const targetUserDetails = feed.find((u) => u._id === targetUserId);
      
      // 2. Background me API call karo
      const res = await api.post(`/swipe/${type}/${targetUserId}`);
      
      // 3. Agar Like kiya hai aur backend 'isMatch: true' de, toh modal open karo
      if (type === "like" && res.data?.isMatch) {
        setMatchedUser(targetUserDetails);
      }
      
      return res.data; 
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      throw error;
    }
  };

  const handleRemove = (targetUserId) => {
    dispatch(removeFeed(targetUserId));
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100dvh-5rem)] items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#22d3ee]" />
      </div>
    );
  }

  if (!feed || feed.length === 0) {
    return (
      <div className="flex flex-col h-[calc(100dvh-5rem)] items-center justify-center text-center space-y-6 max-w-md mx-auto px-4">
        <div className="bg-white/5 border border-white/10 p-8 rounded-full shadow-[0_0_30px_rgba(34,211,238,0.1)]">
          <Users className="w-16 h-16 text-[#22d3ee]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-white">You've caught up!</h2>
          <p className="text-muted-foreground">There are no new developers in your area. Update your profile or check back later.</p>
        </div>
        <div className="flex flex-col gap-3 w-full items-center">
          <Button variant="outline" onClick={() => window.location.reload()} className="border-[#22d3ee]/50 text-[#22d3ee] hover:bg-[#22d3ee] hover:text-black">Refresh Feed</Button>
          {showInstall && (
            <Button onClick={handleInstall} className="bg-[#22d3ee] text-black hover:opacity-90">Install DevMatch</Button>
          )}
        </div>
      </div>
    );
  }

  // OPTIMIZATION: Only render the top 3 cards to save DOM nodes and GPU memory
  const visibleCards = [...feed].slice(0, 3).reverse();

  return (
    <>
      <div className="flex w-full h-[calc(100dvh-5rem)] items-center justify-center relative overflow-hidden bg-background">
        <div className="relative w-full max-w-[360px] md:max-w-sm aspect-[3/4]">
          {visibleCards.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onAction={handleAction}
              onRemove={handleRemove}
            />
          ))}
        </div>
      </div>
      
      {/* Match Modal Integration */}
      <MatchModal 
        matchedUser={matchedUser} 
        currentUser={currentUser} 
        onClose={() => setMatchedUser(null)} 
      />

      <Footer />
    </>
  );
};

export default Feed;