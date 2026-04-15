import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import createSocketConnection from "./utils/socket";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Index = () => {
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();

    socket.emit("userConnected", { userId });

    return () => socket.disconnect();
  }, [userId]);

  return (
    <div className="relative min-h-screen bg-[#09090b] text-foreground selection:bg-[#22d3ee]/30">
      
      {/* Fixed Navigation (Sidebar on Desktop, Bottom Tabs on Mobile) */}
      <Navbar />

      {/* --- THE FIX: MAIN LAYOUT WRAPPER --- 
          1. md:ml-20 lg:ml-64 -> Pushes everything to the right so the desktop sidebar doesn't overlap.
          2. pb-[4.5rem] md:pb-0 -> Adds padding to the bottom on mobile so content isn't hidden under the tab bar.
      */}
      <div className="flex flex-col min-h-screen transition-all duration-300 md:ml-20 lg:ml-64 pb-[4.5rem] md:pb-0">
        
        {/* Main Content Area */}
        <main className="flex-1 w-full flex flex-col items-center overflow-x-hidden">
          <div className="container max-w-7xl mx-auto px-4 py-6 md:py-10 w-full">
            <Outlet />
          </div>
        </main>

        {/* Footer (Now correctly offset alongside the main content) */}
        <Footer />
        
      </div>
    </div>
  );
};

export default Index;