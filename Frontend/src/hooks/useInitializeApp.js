import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "@/services/api";

import { setUser } from "@/store/userSlice";

import {
  setFeed,
  setFeedLoading,
  setFeedError,
} from "@/store/feedSlice";

import {
  setConnections,
  setConnectionsLoading,
  setConnectionsError,
} from "@/store/connectionSlice";

import {
  setRequests,
  setRequestsLoading,
  setRequestsError,
} from "@/store/RequestSlice";

const useInitializeApp = () => {
  const dispatch = useDispatch();
  const hasInitialized = useRef(false);

  const user = useSelector((state) => state.user);

  useEffect(() => {
    // 🔥 Prevent duplicate execution (VERY IMPORTANT)
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initialize = async () => {
      try {
        // 🔥 PARALLEL API CALLS (performance boost)
        dispatch(setFeedLoading(true));
        dispatch(setConnectionsLoading(true));
        dispatch(setRequestsLoading(true));

        const [userRes, feedRes, connectionsRes, requestsRes] =
          await Promise.all([
            api.get("/profile/view"),
            api.get("/user/feed"),
            api.get("/user/connections"),
            api.get("/user/request/received"),
          ]);

        // ✅ Set all data centrally
        dispatch(setUser(userRes.data.user));

        dispatch(setFeed(feedRes.data.data || feedRes.data));
        dispatch(setConnections(connectionsRes.data.data));
        dispatch(setRequests(requestsRes.data.data));
      } catch (error) {
        // ❌ Set errors individually (optional improvement later)
        dispatch(setFeedError("Failed to load feed"));
        dispatch(setConnectionsError("Failed to load connections"));
        dispatch(setRequestsError("Failed to load requests"));
      } finally {
        dispatch(setFeedLoading(false));
        dispatch(setConnectionsLoading(false));
        dispatch(setRequestsLoading(false));
      }
    };

    // Only initialize if user not present
    if (!user) {
      initialize();
    }
  }, [dispatch, user]);
};

export default useInitializeApp;