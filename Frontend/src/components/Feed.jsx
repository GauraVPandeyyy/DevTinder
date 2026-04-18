import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFeed, removeFeed } from "@/store/feedSlice";
import api from "@/services/api";
import UserCard from "./UserCard";
import { Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "./Footer";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((state) => state.feed);
  const [isLoading, setIsLoading] = useState(true);

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 1. Process the API logic, but DO NOT remove the card yet.
  // Return the data so UserCard knows if it's a match.
  const handleAction = async (type, targetUserId) => {
    try {
      const res = await api.post(`/swipe/${type}/${targetUserId}`);
      return res.data; // Contains { isMatch: true/false, message: "..." }
    } catch (error) {
      console.error("SWIPE CRASH ERROR:", error);
      throw error; // Let UserCard handle the error and bounce back
    }
  };

  // 2. Actually remove the card from Redux AFTER animations complete
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
          <h2 className="text-3xl font-bold tracking-tight text-white">
            You've caught up!
          </h2>
          <p className="text-muted-foreground">
            There are no new developers in your area. Update your profile or
            check back later.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="border-[#22d3ee]/50 text-[#22d3ee] hover:bg-[#22d3ee] hover:text-black"
        >
          Refresh Feed
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex w-full h-[100vh] items-center justify-center relative overflow-hidden bg-background">
        <div className="relative w-full max-w-[360px] md:max-w-sm aspect-[3/4]">
          {[...feed].reverse().map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onAction={handleAction}
              onRemove={handleRemove}
            />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Feed;
