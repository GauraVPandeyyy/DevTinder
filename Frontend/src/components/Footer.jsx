import { Link } from "react-router-dom";
import { Sparkles, Github, Twitter, Linkedin, Mail, ComputerIcon } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 w-fit">
              <div className="bg-primary/10 p-1.5 rounded-lg">
                <ComputerIcon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Dev<span className="text-primary">Tinder</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              The premier networking platform for developers. Find your next coding partner, mentor, or co-founder with a simple swipe. Built with ❤️ by developers, for developers.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="https://github.com/GauraVPandeyyy/" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="https://x.com/gaurav_pandeyyy" className="text-muted-foreground hover:text-[#1DA1F2] transition-colors">
                <Twitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://www.linkedin.com/in/gaurav-pandey-0987162a0/" className="text-muted-foreground hover:text-[#0A66C2] transition-colors">
                <Linkedin className="w-5 h-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide uppercase text-foreground">
              Platform
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Explore Feed</Link>
              </li>
              <li>
                <Link to="/premium" className="text-sm text-muted-foreground hover:text-primary transition-colors">Premium Plans</Link>
              </li>
              <li>
                <Link to="/connections" className="text-sm text-muted-foreground hover:text-primary transition-colors">Your Network</Link>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Success Stories</a>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide uppercase text-foreground">
              Support
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            © {currentYear} DevTinder Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Status: <span className="text-green-500 font-medium">All systems operational</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;