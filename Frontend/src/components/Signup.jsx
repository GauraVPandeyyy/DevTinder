import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, User, Eye, EyeOff, ComputerIcon } from "lucide-react";
import api from "@/services/api";
import { setUser } from "@/store/userSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signupHandler = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/signup", {
        firstName,
        lastName,
        email,
        password
      });
      dispatch(setUser(res.data.user || res.data.data));
      navigate("/profile");
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.errors && Array.isArray(errData.errors)) {
        setError(errData.errors[0].msg);
      } else {
        setError(errData?.message || "Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4 relative overflow-hidden py-12">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#22d3ee]/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#0284c7]/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#22d3ee]/10 p-4 rounded-2xl border border-[#22d3ee]/20 mb-4 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
            <ComputerIcon className="w-10 h-10 text-[#22d3ee]" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">
            Initialize <span className="text-[#22d3ee]">Profile</span>
          </h1>
          <p className="text-muted-foreground font-medium text-center">
            Join the developer network and find your match.
          </p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-[2rem] shadow-2xl backdrop-blur-xl">
          <form onSubmit={signupHandler} className="space-y-5">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/70 ml-1">First Name</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Tony"
                    className="pl-9 bg-black/40 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-[#22d3ee] rounded-xl h-12"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white/70 ml-1">Last Name</Label>
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Stark"
                  className="bg-black/40 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-[#22d3ee] rounded-xl h-12"
                  // required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/70 ml-1">Email Address</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@example.com"
                  className="pl-11 bg-black/40 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-[#22d3ee] rounded-xl h-14 text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/70 ml-1">Password</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-11 pr-11 bg-black/40 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-[#22d3ee] rounded-xl h-14 text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }} 
                className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium p-3 rounded-xl text-center"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !firstName || !email || !password}
              className="w-full h-14 mt-4 text-lg font-bold rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#0284c7] text-white shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:scale-[1.02] transition-all"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Compile Profile"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Already deployed an account?{" "}
              <Link to="/login" className="text-[#22d3ee] font-semibold hover:underline underline-offset-4 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;