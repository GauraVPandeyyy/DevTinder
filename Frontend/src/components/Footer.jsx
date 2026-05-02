import { Link } from "react-router-dom";
import { Mail, ComputerIcon } from "lucide-react";
import Logo from "../assets/logo.png";
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full relative bg-[#09090b] pt-12 pb-24 md:pb-12 border-t border-white/5 mt-5">
      {/* Subtle Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#22d3ee]/30 to-transparent" />

      <div className="container max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-5">
            <Link
              to="/"
              className="flex items-center gap-3 transition-opacity hover:opacity-80 w-fit"
            >
              <div className="bg-[#22d3ee]/10  rounded-xl border border-[#22d3ee]/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                <img
                  src={Logo}
                  alt="DevMatch Logo"
                  className="w-10 h-10 rounded-xl"
                />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Dev<span className="text-[#22d3ee]">Match</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed font-light">
              The premier networking platform for developers. Find your next
              coding partner, mentor, or co-founder with a simple swipe. Built
              by developers, for developers.
            </p>
          </div>

          {/* Links Section */}
          <div className="space-y-5 md:col-start-4">
            <h4 className="text-xs font-bold tracking-widest text-white/50 uppercase">
              System Operations
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:gauravp9118@gmail.com"
                  className="text-sm font-medium text-muted-foreground hover:text-[#22d3ee] transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" /> Ping Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm font-medium text-muted-foreground hover:text-[#22d3ee] transition-colors"
                >
                  Privacy Protocol
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm font-medium text-muted-foreground hover:text-[#22d3ee] transition-colors"
                >
                  Terms of Runtime
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-muted-foreground font-medium">
            © {currentYear} DevMatch. All rights reserved.
          </p>
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-medium bg-white/[0.02] px-4 py-2 rounded-full border border-white/5 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
