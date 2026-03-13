import { useDispatch, useSelector } from "react-redux";
import { UserCard } from "./userCard";
import api from "@/services/api";
import toast from "react-hot-toast";
import { addFeed } from "@/store/feedSlice";
import { useEffect } from "react";

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

  return <div>
    {
    feed && <UserCard user={feed[0]} />
    
    }</div>;
};

export default Feed;
