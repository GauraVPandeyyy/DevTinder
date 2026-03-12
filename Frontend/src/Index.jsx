import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import api from "@/services/api";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/userSlice";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatach = useDispatch();
  const fetchUser = async () => {
    try {
      
      const res = await api.get("/profile/view");
      console.log(res);
      dispatach(setUser(res.data.user));

    } catch (error) {
      if(error.status ==401) {
        navigate("/login")
      }
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <>
      <Navbar />
      <div className="w-full h-screen pt-10">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Index;
