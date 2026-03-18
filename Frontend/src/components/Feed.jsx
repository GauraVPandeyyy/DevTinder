import { useDispatch, useSelector } from "react-redux";
import { UserCard } from "./UserCard";
import api from "@/services/api";
import toast from "react-hot-toast";
import { addFeed, removeFeed } from "@/store/feedSlice";
import { useEffect } from "react";
import { Heading1 } from "lucide-react";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const fetchFeed = async () => {
    try {
      const res = await api.get("/user/feed");

      dispatch(addFeed(res?.data?.feed));
    } catch (error) {
      toast.error(error.response?.data?.message || "Feed Fetched failed");
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  if (!feed) return;

  if (feed.length <= 0) {
    return <h1 className="bg-blue-400 mt-16 py-16 text-center w-full">No new Users Found!</h1>;
  }

  return <div>{feed && <UserCard user={feed[0]} />}</div>;
};

export default Feed;
