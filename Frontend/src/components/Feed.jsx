import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFeed, removeFeed } from "@/store/feedSlice";
import api from "@/services/api";
import UserCard from "./UserCard";
import { Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((state) => state.feed);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeed = async () => {
    try {
      const res = await api.get("/user/feed");
      // Ensure we handle standard API responses correctly
      dispatch(setFeed(res.data.feed || [])); // Default to empty array if feed is missing
    } catch (error) {
      console.error("Error fetching feed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAction = async (type, targetUserId) => {
    try {
      const res = await api.post(`/swipe/${type}/${targetUserId}`);

      dispatch(removeFeed(targetUserId));
      // if (feed.length < 2) {
      //   dispatch(fetchFeed());
      // }

      if (res.data.isMatch) {
        toast.success("🎉 It's a Match!");
        
      }
    } catch (error) {
      console.error("SWIPE ERROR:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100dvh-5rem)] items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  // Handle Empty State (No more users)
  if (!feed || feed.length === 0) {
    return (
      <div className="flex flex-col h-[calc(100dvh-5rem)] items-center justify-center text-center space-y-6 max-w-md mx-auto px-4">
        <div className="bg-white/5 border border-white/10 p-8 rounded-full shadow-[0_0_30px_rgba(34,211,238,0.1)]">
          <Users className="w-16 h-16 text-primary" />
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
          className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
        >
          Refresh Feed
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full h-[calc(100dvh-5rem)] items-center justify-center relative overflow-hidden bg-background">
      {/* We use a strict container so absolute positioning doesn't break the layout */}
      <div className="relative w-full max-w-[360px] md:max-w-sm aspect-[3/4]">
        {/* We create a shallow copy and reverse it so the 0th index is visually on top of the stack */}
        {[...feed].reverse().map((user) => (
          <UserCard key={user._id} user={user} onAction={handleAction} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
