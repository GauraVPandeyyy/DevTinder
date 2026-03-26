import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check, X, BellOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/services/api";
import { setRequests, removeRequest } from "@/store/RequestSlice"; // FIXED IMPORT

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const ConnectionRequest = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get("/user/request/received");
        dispatch(setRequests(res.data.data));
      } catch (error) {
        console.error("Failed to fetch requests", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, [dispatch]);

  const reviewRequest = async (status, requestId, userName) => {
    try {
      await api.post(`/request/review/${status}/${requestId}`);
      dispatch(removeRequest(requestId));
      
      if (status === "accepted") {
        toast.success(`You are now connected with ${userName}! 🎉`);
      } else {
        toast.success("Request declined.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <div className="bg-muted p-6 rounded-full">
          <BellOff className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">No pending requests</h2>
        <p className="text-muted-foreground">
          When someone swipes right on your profile, their request will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Connection Requests</h1>
        <p className="text-muted-foreground">
          People who want to connect with you.
        </p>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {requests.map((request) => {
            const user = request.fromUserId;
            // Safeguard just in case fromUserId is unpopulated or null
            if (!user) return null; 

            return (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95, margin: 0, padding: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden" // Prevents layout jumping during exit animation
              >
                <Card className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border">
                      <AvatarImage src={user.photoUrl} className="object-cover" />
                      <AvatarFallback>{user.firstName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <h2 className="font-bold text-xl">
                        {user.firstName} {user.lastName}
                      </h2>
                      <p className="text-sm font-medium text-primary">
                         {user.jobTitle || "Developer"}
                      </p>
                      {user.about && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                          {user.about}
                        </p>
                      )}
                    </div>

                    <div className="flex sm:flex-col gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                      <Button
                        onClick={() => reviewRequest("accepted", request._id, user.firstName)}
                        className="flex-1 sm:w-32 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => reviewRequest("rejected", request._id, user.firstName)}
                        className="flex-1 sm:w-32 hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};