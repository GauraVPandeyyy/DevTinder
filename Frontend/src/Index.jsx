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
    <div className="relative flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/30">
      <Navbar />

      {/* flex-1 ensures the main content pushes the footer down */}
      <main className="flex-1 w-full flex flex-col items-center">
        <div className="container max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
