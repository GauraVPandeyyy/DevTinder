import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import api from "@/services/api";
import { setUser } from "@/store/userSlice";
import { Loader2 } from "lucide-react";

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!user) {
          const res = await api.get("/profile/view");
          dispatch(setUser(res.data.user));
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsInitializing(false);
      }
    };
    fetchUser();
  }, [dispatch, user]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // If initialization is done and no user is in Redux, kick them to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;