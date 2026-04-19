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
  const scrollContainerRef = useRef(null);
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
  const [chatUser, setChatUser] = useState(null);
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
      const chat = response.data;
      //console.log(chat);

      //  set chat user
      const otherUser = chat.participants.find((p) => p._id !== userId);
      setChatUser(otherUser);

      // messages
      let chatMessages = chat.messages.map((msg) => ({
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
    fetchMessages();
    fetchLastSeen();
  }, [targetUserId]);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      // This strictly targets the inner chat box so the page doesn't jump
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
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

  if (!chatUser) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <p className="text-xl font-medium text-muted-foreground">
          Loading chat...
        </p>
        {/* <Button onClick={() => navigate("/connections")} variant="outline">
          Back to Connections
        </Button> */}
      </div>
    );
  }

return (
    <div className="flex flex-col h-[calc(100dvh-9rem)] md:h-[calc(100dvh-2rem)] w-full max-w-3xl mx-auto bg-background relative md:border-x md:border-white/10 shadow-2xl overflow-hidden md:mt-4 md:rounded-t-[2.5rem]">
      
      {/* STICKY HEADER */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/10 text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="relative cursor-pointer" onClick={() => navigate(`/user/${targetUserId}`)}>
            <Avatar className="w-10 h-10 border border-white/20">
              <AvatarImage src={chatUser?.photoUrl} className="object-cover" />
              <AvatarFallback className="text-black bg-[#22d3ee] font-bold">{chatUser?.firstName?.charAt(0)}</AvatarFallback>
            </Avatar>
            {isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />}
          </div>
          <div className="flex flex-col cursor-pointer" onClick={() => navigate(`/user/${targetUserId}`)}>
            <h2 className="text-base font-bold text-white leading-tight">{chatUser?.firstName} {chatUser?.lastName}</h2>
            <span className="text-xs font-medium text-[#22d3ee]">
              {isTyping ? "typing..." : isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* MESSAGE AREA */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar flex flex-col">
        
        {/* --- NEW: First Time Chat State --- */}
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-70">
             <div className="w-20 h-20 bg-[#22d3ee]/10 rounded-full flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                <Send className="w-10 h-10 text-[#22d3ee] ml-1" />
             </div>
             <h3 className="text-2xl font-bold text-white tracking-tight">Say hi!</h3>
             <p className="text-muted-foreground text-sm max-w-xs">
               This is the beginning of your conversation with {chatUser?.firstName}. Send a message to get things started.
             </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, index) => {
            const isMe = msg.senderId === userId || msg.senderId?._id === userId;
            return (
              <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`flex max-w-[75%] md:max-w-[65%] gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                      isMe ? "bg-gradient-to-br from-[#22d3ee] to-[#0284c7] text-white rounded-tr-sm shadow-[0_4px_15px_rgba(34,211,238,0.2)]" 
                           : "bg-white/10 text-white/90 border border-white/5 rounded-tl-sm backdrop-blur-sm"
                    }`}>
                    <p>{msg.text}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* --- NEW: Proper Bouncing Typing Indicator --- */}
        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
            <div className="bg-white/10 backdrop-blur-sm border border-white/5 px-4 py-3.5 rounded-2xl rounded-tl-sm flex items-center gap-1.5 w-fit">
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-[#22d3ee] rounded-full" />
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#22d3ee] rounded-full" />
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#22d3ee] rounded-full" />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* INPUT AREA */}
      <div className="p-3 bg-background/90 backdrop-blur-md border-t border-white/5 z-20">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-white/5 p-1.5 pl-4 rounded-full border border-white/10 focus-within:border-[#22d3ee]/50 focus-within:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all">
          <Input type="text" value={newMessage} onChange={handleTyping} placeholder={`Message ${chatUser?.firstName || ""}...`} className="flex-1 border-0 bg-transparent focus-visible:ring-0 shadow-none px-0 h-10 text-white placeholder:text-muted-foreground" autoComplete="off" />
          <Button type="submit" size="icon" disabled={!newMessage.trim()} className={`rounded-full h-10 w-10 shrink-0 transition-all duration-300 ${newMessage.trim() ? "bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)] scale-100" : "bg-white/10 text-muted-foreground scale-90"}`}>
            <Send className="w-4 h-4 ml-0.5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
