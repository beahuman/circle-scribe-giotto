
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';

const UserAvatar = () => {
  const { user, signOut } = useAuth();
  
  if (!user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer h-11 w-11 hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all touch-manipulation">
            <AvatarFallback className="bg-muted">
              <i className="ri-user-line text-lg text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 z-50">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link to="/auth">
            <DropdownMenuItem className="cursor-pointer min-h-[44px] touch-manipulation">
              <i className="ri-login-box-line text-lg mr-2 text-primary" />
              <span>Sign In</span>
            </DropdownMenuItem>
          </Link>
          <Link to="/auth?tab=signup">
            <DropdownMenuItem className="cursor-pointer min-h-[44px] touch-manipulation">
              <i className="ri-user-add-line text-lg mr-2 text-primary" />
              <span>Create Account</span>
            </DropdownMenuItem>
          </Link>
          <Link to="/auth">
            <DropdownMenuItem className="cursor-pointer min-h-[44px] touch-manipulation">
              <i className="ri-apple-fill text-lg mr-2 text-primary" />
              <span>Sign in with Apple</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer h-11 w-11 hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all touch-manipulation">
          <AvatarFallback className="text-white font-bold bg-primary">
            {user.email?.[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 z-50">
        <DropdownMenuLabel>Hi, {user.email?.split('@')[0]}!</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to="/account">
          <DropdownMenuItem className="cursor-pointer min-h-[44px] touch-manipulation">
            <i className="ri-user-line text-lg mr-2 text-primary" />
            <span>My Account</span>
          </DropdownMenuItem>
        </Link>
        <Link to="/settings">
          <DropdownMenuItem className="cursor-pointer min-h-[44px] touch-manipulation">
            <i className="ri-settings-line text-lg mr-2 text-primary" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="cursor-pointer min-h-[44px] touch-manipulation">
          <i className="ri-logout-box-line text-lg mr-2 text-primary" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
