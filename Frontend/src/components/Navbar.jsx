import { Home, Users, MessageSquare, User, LogOut, ComputerIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "@/store/userSlice";
import api from "@/services/api";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  const handleLogout = async () => {
    try {
      await api.post("/logout", {});
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  const navItems = [
    { icon: Home, label: "Feed", path: "/" },
    { icon: Users, label: "Requests", path: "/requests" },
    { icon: MessageSquare, label: "Matches", path: "/connections" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <>
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-20 lg:w-64 border-r border-white/5 bg-[#09090b]/80 backdrop-blur-xl z-[100] transition-all">
        
        {/* Brand */}
        <div className="p-6 pt-8 flex items-center justify-center lg:justify-start gap-3">
          <div className="bg-[#22d3ee]/10 p-2 rounded-xl border border-[#22d3ee]/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
            <ComputerIcon className="w-6 h-6 text-[#22d3ee]" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white hidden lg:block">
            Dev<span className="text-[#22d3ee]">Tinder</span>
          </span>
        </div>

        {/* Links */}
        <nav className="flex-1 px-4 space-y-3 mt-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-center lg:justify-start gap-4 p-3.5 rounded-2xl transition-all group ${
                  isActive 
                    ? "bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/20 shadow-[0_0_20px_rgba(34,211,238,0.1)]" 
                    : "hover:bg-white/5 text-muted-foreground hover:text-white border border-transparent"
                }`}
              >
                <item.icon className={`w-6 h-6 ${isActive ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "group-hover:scale-110 transition-transform"}`} />
                <span className={`font-semibold hidden lg:block ${isActive ? "text-[#22d3ee] drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" : ""}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Area */}
        <div className="p-4 border-t border-white/5 mb-4">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center lg:justify-start gap-4 w-full p-3.5 rounded-2xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border hover:border-red-500/20 transition-all group"
          >
            <LogOut className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold hidden lg:block">Logout</span>
          </button>
        </div>
      </aside>

      {/* --- MOBILE BOTTOM TABS --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[4.5rem] bg-[#09090b]/90 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around px-2 z-[100] pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full transition-all relative ${
                isActive ? "text-[#22d3ee]" : "text-muted-foreground hover:text-white/70"
              }`}
            >
              <item.icon className={`w-6 h-6 mb-1 ${isActive ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : ""}`} />
              <span className={`text-[10px] font-semibold ${isActive ? "text-[#22d3ee]" : ""}`}>
                {item.label}
              </span>
              
              {/* Active Dot Indicator */}
              {isActive && (
                <div className="absolute top-1 w-1.5 h-1.5 bg-[#22d3ee] rounded-full shadow-[0_0_10px_#22d3ee]" />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Navbar;