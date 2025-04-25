
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogIn, UserPlus, CircleUser, Settings, LogOut } from 'lucide-react';

interface UserAvatarProps {
  isLoggedIn: boolean;
  username?: string;
  avatarColor?: string;
  onSignOut?: () => void;
}

const UserAvatar = ({ isLoggedIn, username, avatarColor = '#9b87f5', onSignOut }: UserAvatarProps) => {
  if (!isLoggedIn) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer h-9 w-9 hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all">
            <AvatarFallback className="bg-muted">
              <CircleUser className="h-5 w-5 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link to="/signin">
            <DropdownMenuItem className="cursor-pointer">
              <LogIn className="h-4 w-4 mr-2" />
              <span>Sign In</span>
            </DropdownMenuItem>
          </Link>
          <Link to="/signup">
            <DropdownMenuItem className="cursor-pointer">
              <UserPlus className="h-4 w-4 mr-2" />
              <span>Create Account</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const initials = username ? username.charAt(0).toUpperCase() : '?';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer h-9 w-9 hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all">
          <AvatarFallback style={{ backgroundColor: avatarColor }} className="text-white font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {username && <DropdownMenuLabel>Hi, {username}!</DropdownMenuLabel>}
        <DropdownMenuSeparator />
        <Link to="/account">
          <DropdownMenuItem className="cursor-pointer">
            <CircleUser className="h-4 w-4 mr-2" />
            <span>My Account</span>
          </DropdownMenuItem>
        </Link>
        <Link to="/settings">
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="h-4 w-4 mr-2" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut} className="cursor-pointer">
          <LogOut className="h-4 w-4 mr-2" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
