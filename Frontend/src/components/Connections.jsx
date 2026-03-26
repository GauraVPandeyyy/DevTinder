import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, MessageCircle, UserX } from "lucide-react";
import api from "@/services/api";
import { setConnections } from "@/store/connectionSlice"; // FIXED IMPORT

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await api.get("/user/connections");
        dispatch(setConnections(res.data.data));
      } catch (error) {
        console.error("Failed to fetch connections", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConnections();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!connections || connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <div className="bg-muted p-6 rounded-full">
          <UserX className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">No connections yet</h2>
        <p className="text-muted-foreground max-w-sm">
          Start swiping on the feed to find developers and build your network.
        </p>
        <Button asChild variant="default" className="mt-4">
          <Link to="/">Explore Feed</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Network</h1>
        <p className="text-muted-foreground">
          You have {connections.length} {connections.length === 1 ? 'connection' : 'connections'}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map((connection, index) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about, jobTitle } = connection;
          
          return (
            <motion.div
              key={_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <Avatar className="w-24 h-24 border-2 border-primary/10">
                    <AvatarImage src={photoUrl} className="object-cover" />
                    <AvatarFallback className="text-2xl">{firstName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1 w-full">
                    <h2 className="font-bold text-xl line-clamp-1">
                      {firstName} {lastName}
                    </h2>
                    <p className="text-sm font-medium text-primary">
                      {jobTitle || "Developer"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {[age, gender].filter(Boolean).join(" • ")}
                    </p>
                  </div>

                  {about && (
                    <p className="text-sm text-muted-foreground line-clamp-2 w-full">
                      {about}
                    </p>
                  )}

                  <div className="w-full pt-4 border-t mt-auto">
                    <Button asChild variant="outline" className="w-full hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Link to={`/chat/${_id}`}>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};