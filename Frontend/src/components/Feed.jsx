import { useEffect, useRef, useState } from "react";
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
  console.log("feed", feed);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeed = async () => {
    try {
      const res = await api.get("/user/feed");
      // Ensure we handle standard API responses correctly
      console.log("fetch feed", res.data);
      dispatch(setFeed(res.data.feed || [])); // Default to empty array if feed is missing
    } catch (error) {
      console.error("Error fetching feed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchFeed();
  }, []);


  const handleAction = async (status, targetUserId) => {
    try {
      console.log("interested", status);
      await api.post(`/request/send/${status}/${targetUserId}`);

      dispatch(removeFeed(targetUserId));

      if (status === "interested") {
        toast.success("Interest sent! 🚀", { icon: "🔥" });
      }
    } catch (error) {
      // 🚨 REAL ERROR YAHAN PRINT HOGA
      console.error("SWIPE CRASH ERROR:", error);

      // Agar backend se error aayi hai, ya phir JS error aayi hai, usko show karega
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong processing swipe";
      toast.error(errorMsg);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // Handle Empty State (No more users)
  if (!feed || feed.length === 0) {
    return (
      <div className="flex flex-col h-[70vh] items-center justify-center text-center space-y-4 max-w-md mx-auto">
        <div className="bg-muted p-6 rounded-full">
          <Users className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">You've caught up!</h2>
        <p className="text-muted-foreground">
          There are no new developers in your area. Update your profile or check
          back later.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Feed
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full h-[75vh] items-center justify-center relative overflow-hidden">
      {/* We map through the feed but only render the top few cards for performance.
        We reverse the array so the first item in the array is on top of the DOM stack.
      */}
      {feed.map((user, index) => (
        <UserCard key={user._id} user={user} onAction={handleAction} />
      ))}
    </div>
  );
};

export default Feed;
