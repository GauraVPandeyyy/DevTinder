import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

const Index = () => {
  return (
    <>
      <Navbar />
      <div className="w-full h-screen">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Index;
