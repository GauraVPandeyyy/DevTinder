import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "@/store/userSlice";
import api from "@/services/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  Users, 
  BellRing, 
  Sparkles, 
  LogOut ,
  ComputerIcon
} from "lucide-react";

export default function Navbar({ className }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  const logOutHandler = async () => {
    try {
      await api.post("/logout");
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Brand Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="bg-primary/10 p-2 rounded-xl">
            <ComputerIcon className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Dev<span className="text-primary">Tinder</span>
          </span>
        </Link>

        {/* Right Side Navigation */}
        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <>
              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-1 mr-4">
                <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                  <Link to="/connections">
                    <Users className="w-4 h-4 mr-2" />
                    Connections
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                  <Link to="/requests">
                    <BellRing className="w-4 h-4 mr-2" />
                    Requests
                  </Link>
                </Button>
              </nav>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-transparent hover:border-primary/20 transition-all">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.photoUrl} alt={user.firstName} className="object-cover" />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.firstName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email || "Developer"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="md:hidden">
                      <Link to="/connections" className="cursor-pointer">
                        <Users className="mr-2 h-4 w-4" />
                        <span>Connections</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="md:hidden">
                      <Link to="/requests" className="cursor-pointer">
                        <BellRing className="mr-2 h-4 w-4" />
                        <span>Requests</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/premium" className="cursor-pointer text-amber-500 focus:text-amber-600">
                        <Sparkles className="mr-2 h-4 w-4" />
                        <span>Premium</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logOutHandler} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}