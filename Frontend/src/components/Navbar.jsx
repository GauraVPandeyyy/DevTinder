import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BadgeCheckIcon,
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
} from "lucide-react";
import { useSelector } from "react-redux";
export default function Navbar() {
  const user = useSelector(state => state.user)
  return (
    <nav>
      <div className="flex justify-between p-2 fixed top-0 w-full">
        {/* Logo */}
        <h1 className="text-xl font-bold text-pink-600">DevTinder</h1>

        {/* Navigation */}
        <div className="flex gap-4 items-center">
          <Button variant="ghost">Feed</Button>
          <Button variant="ghost">Matches</Button>
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage
                      src={user.photoUrl}
                      alt="user profile"
                    />
                    <AvatarFallback>LR</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheckIcon />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BellIcon />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOutIcon />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}
