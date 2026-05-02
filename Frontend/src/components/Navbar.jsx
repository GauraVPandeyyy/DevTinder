import {
  Home,
  Users,
  MessageSquare,
  User,
  LogOut,
  ComputerIcon,
  Sparkles,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "@/store/userSlice";
import api from "@/services/api";
import Logo from "../assets/logo2.png";
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
    { icon: MessageSquare, label: "Matches", path: "/matches" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <>
      {/* --- MOBILE TOP HEADER (New: Logout & Premium visibility) --- */}
      <div className="md:hidden h-16" />{" "}
      {/* Spacer so content doesn't hide under fixed header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#09090b]/90 backdrop-blur-2xl border-b border-white/5 z-[100] flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          {/* <ComputerIcon className="w-6 h-6 text-[#22d3ee]" /> */}
          <img
            src={Logo}
            alt="DevMatch Logo"
            className="w-10 h-10 rounded-xl"
          />

          <span className="font-bold text-lg text-white">
            Dev<span className="text-[#22d3ee]">Match</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/premium"
            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
          >
            <Sparkles className="w-3 h-3" /> Premium
          </Link>
          <button
            onClick={handleLogout}
            className="text-muted-foreground hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-20 lg:w-64 border-r border-white/5 bg-[#09090b]/80 backdrop-blur-xl z-[100] transition-all">
        <div className="p-6 pt-8 flex items-center justify-center lg:justify-start gap-3">
          <div className="bg-[#22d3ee]/10  rounded-xl border border-[#22d3ee]/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
            <img
              src={Logo}
              alt="DevMatch Logo"
              className="w-10 h-10 rounded-xl"
            />
          </div>
          <span className="text-2xl font-black tracking-tight text-white hidden lg:block">
            Dev<span className="text-[#22d3ee]">Match</span>
          </span>
        </div>

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
                <item.icon
                  className={`w-6 h-6 ${isActive ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "group-hover:scale-110 transition-transform"}`}
                />
                <span
                  className={`font-semibold hidden lg:block ${isActive ? "text-[#22d3ee]" : ""}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Desktop Premium Banner */}
          <Link
            to="/premium"
            className="hidden lg:flex flex-col gap-2 mx-2 mt-8 p-4 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-yellow-700/10 border border-yellow-500/30 group hover:border-yellow-500/60 transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-yellow-500">Go Premium</span>
            </div>
            
          </Link>
        </nav>

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
              className={`flex flex-col items-center justify-center w-full h-full transition-all relative ${isActive ? "text-[#22d3ee]" : "text-muted-foreground hover:text-white/70"}`}
            >
              <item.icon
                className={`w-6 h-6 mb-1 ${isActive ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : ""}`}
              />
              <span
                className={`text-[10px] font-semibold ${isActive ? "text-[#22d3ee]" : ""}`}
              >
                {item.label}
              </span>
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
