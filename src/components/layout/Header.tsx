'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Menu, Bell, LogOut, User, Settings } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  user: {
    name: string;
    email: string;
    role: string;
    profilePicture?: string;
    firstName: string;
    lastName: string;
  };
}

export default function Header({ onMenuClick, user }: HeaderProps) {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'dsa':
        return 'default';
      case 'user':
        return 'secondary';
      default:
        return 'outline';
    }
  };



  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm flex-shrink-0">
      <div className="px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Menu button for mobile and page title */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden hover:bg-slate-100 p-2"
            >
              <Menu className="h-5 w-5 text-slate-600" />
            </Button>

            {/* Page title */}
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
                {user.role === 'admin' && 'Admin Dashboard'}
                {user.role === 'dsa' && 'DSA Dashboard'}
                {user.role === 'user' && 'User Dashboard'}
              </h1>
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-slate-500 font-medium">Online</span>
              </div>
            </div>
          </div>

          {/* Right side - Search, Notifications and user menu */}
          <div className="flex items-center space-x-3">
            {/* Search - hidden on mobile */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-64 pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
                />
              </div>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative hover:bg-slate-100 p-2">
              <Bell className="h-5 w-5 text-slate-600" />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                3
              </span>
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-slate-100 transition-colors">
                  <Avatar className="h-8 w-8 ring-2 ring-slate-200">
                    <AvatarImage src={user.profilePicture} alt={user.name} />
                    <AvatarFallback className="bg-blue-600 text-white font-semibold text-sm">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 p-0" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profilePicture} alt={user.name} />
                      <AvatarFallback className="bg-blue-600 text-white font-semibold">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                      <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs w-fit">
                        {user.role.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      </div>
    </header>
  );
}
