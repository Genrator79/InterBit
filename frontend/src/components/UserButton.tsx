"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "../context/UserContext";
import { LogOut, User as UserIcon, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

function UserButton() {
  const { user, logout } = useContext(UserContext);
  const router = useRouter();

  const handleLogout = () => {
    logout(); // clears user and accessToken
    router.push("/login"); // redirect to login page
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full p-1 hover:bg-muted transition">
          <Avatar className="w-8 h-8">
            <AvatarFallback>
              {user?.username?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.username ?? "Guest"}</span>
            <span className="text-xs text-muted-foreground">{user?.email ?? "Not signed in"}</span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <UserIcon className="w-4 h-4 mr-2" /> Profile
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Settings className="w-4 h-4 mr-2" /> Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={handleLogout} // hook up logout here
        >
          <LogOut  onClick= { handleLogout } className="w-4 h-4 mr-2" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { UserButton };
