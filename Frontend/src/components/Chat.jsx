import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, Video, Info, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import createSocketConnection from "@/utils/socket";
import api from "@/services/api";

const Chat = () => {
  //useRef
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);

  const { targetUserId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const currentUser = useSelector((state) =>
    state.connections?.find((conn) => conn._id === targetUserId),
  );

  const user = useSelector((store) => store.user);
  const userId = user?._id;

  useEffect(() => {
    if (!userId) return;

    socketRef.current = createSocketConnection();

    socketRef.current.emit("joinChat", {
      userId,
      targetUserId,
      firstName: user.firstName,
    });

    // 🔥 INITIAL PRESENCE
    socketRef.current.emit("getOnlineUsers");

    socketRef.current.on("onlineUsersList", (users) => {
      setIsOnline(users.includes(targetUserId));
    });

    // 🔥 MESSAGE
    socketRef.current.on("messageReceived", ({ senderId, firstName, text }) => {
      setMessages((prev) => [...prev, { senderId, firstName, text }]);
    });

    // 🔥 ONLINE
    socketRef.current.on("userOnline", ({ userId: onlineId }) => {
      if (onlineId === targetUserId) {
        setIsOnline(true);
      }
    });

    // 🔥 OFFLINE
    socketRef.current.on("userOffline", ({ userId: offlineId, lastSeen }) => {
      if (offlineId === targetUserId) {
        setIsOnline(false);
        setLastSeen(lastSeen);
      }
    });

    // 🔥 TYPING
    socketRef.current.on("userTyping", () => {
      setIsTyping(true);
    });

    socketRef.current.on("userStoppedTyping", () => {
      setIsTyping(false);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, targetUserId]);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/chat/${targetUserId}`);
      // console.log("Fetched messages:", response.data);
      let chatMessages = response.data.messages.map((msg) => ({
        firstName: msg.senderId.firstName,
        senderId: msg.senderId._id,
        text: msg.text,
      }));
      setMessages(chatMessages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const fetchLastSeen = async () => {
    try {
      const res = await api.get(`/user/lastSeen/${targetUserId}`);
      setLastSeen(res.data.lastSeen);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLastSeen();
    fetchMessages();
  }, [targetUserId]);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    // send typing event
    socketRef.current.emit("typing", {
      userId,
      targetUserId,
    });

    // clear old timer
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // new timer
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("stopTyping", {
        userId,
        targetUserId,
      });
    }, 1000);
  };

  // useEffect(() => {
  //   if (!socketRef.current) return;

  //   socketRef.current.on("userOnline", ({ userId }) => {
  //     if (userId === targetUserId) {
  //       setIsOnline(true);
  //     }
  //   });

  //   socketRef.current.on("userOffline", ({ userId, lastSeen }) => {
  //     if (userId === targetUserId) {
  //       setIsOnline(false);
  //       setLastSeen(lastSeen);
  //     }
  //   });

  //   socketRef.current.on("userTyping", () => {
  //     setIsTyping(true);
  //   });

  //   socketRef.current.on("userStoppedTyping", () => {
  //     setIsTyping(false);
  //   });

  //   return () => {
  //     socketRef.current.off("userTyping");
  //     socketRef.current.off("userStoppedTyping");
  //   };
  // }, []);
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socketRef.current.emit("messageSend", {
      firstName: user.firstName,
      userId,
      targetUserId,
      text: newMessage,
    });

    setNewMessage("");
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <p className="text-xl font-medium text-muted-foreground">
          User not found or not connected.
        </p>
        <Button onClick={() => navigate("/connections")} variant="outline">
          Back to Connections
        </Button>
      </div>
    );
  }

  return (
    <Card className="flex flex-col w-full max-w-4xl mx-auto h-[80vh] sm:h-[85vh] overflow-hidden border-border/50 shadow-lg relative">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden mr-1"
            onClick={() => navigate("/connections")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Avatar className="w-10 h-10 border">
            <AvatarImage
              src={currentUser.photoUrl}
              alt={currentUser.firstName}
              className="object-cover"
            />
            <AvatarFallback>{currentUser.firstName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold leading-none">
              {currentUser.firstName} {currentUser.lastName}
            </span>
            <span className="text-xs text-green-500 font-medium mt-1 flex items-center gap-1">
              {isTyping ? (
                <span>Typing...</span>
              ) : isOnline ? (
                <span className="text-green-500">Online</span>
              ) : lastSeen ? (
                <span>Last seen {new Date(lastSeen).toLocaleTimeString()}</span>
              ) : (
                <span>Offline</span>
              )}
            </span>
            {/* {isTyping && (
              <p className="text-sm text-gray-400 px-2">typing...</p>
            )} */}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:text-primary"
          >
            <Phone className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:text-primary"
          >
            <Video className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hidden sm:flex"
          >
            <Info className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground bg-muted inline-block px-3 py-1 rounded-full">
            You matched with {currentUser.firstName} on{" "}
            {new Date().toLocaleDateString()}
          </p>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg, index) => {
            const isMe = msg.senderId === userId;
            // const isMe = true;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-full`}
              >
                <div
                  className={`flex items-end gap-2 max-w-[80%] ${isMe ? "flex-row-reverse" : "flex-row"}`}
                >
                  {!isMe && (
                    <Avatar className="w-6 h-6 mb-1 hidden sm:block flex-shrink-0">
                      <AvatarImage
                        src={currentUser.photoUrl}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-[10px]">
                        {currentUser.firstName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm ${
                      isMe
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm border border-border/50"
                    }`}
                  >
                    <p className="break-words leading-relaxed">{msg.text}</p>
                  </div>
                </div>
                {/*<span
                  className={`text-[10px] text-muted-foreground mt-1 px-8 ${isMe ? "text-right" : "text-left"}`}
                >
                  {msg.timestamp}
                </span>*/}
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 sm:p-4 bg-background border-t">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 bg-muted/50 p-1 pl-4 rounded-full border focus-within:ring-1 focus-within:ring-primary/50 focus-within:border-primary transition-all"
        >
          <Input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder={`Message ${currentUser.firstName}...`}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 shadow-none px-0 h-10"
            autoComplete="off"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim()}
            className={`rounded-full h-10 w-10 transition-transform ${newMessage.trim() ? "scale-100" : "scale-90 opacity-50"}`}
          >
            <Send className="w-4 h-4 ml-0.5" />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default Chat;
