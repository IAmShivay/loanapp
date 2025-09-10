'use client';

import { useState } from 'react';
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
import { Menu, Bell, LogOut, User, Settings, CheckCircle, AlertCircle, Clock } from 'lucide-react';

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
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  // TODO: Replace with actual API call
  const notifications = [
    {
      id: '1',
      type: 'application_approved',
      title: 'Application Approved',
      message: 'Your education loan application LA202412001 has been approved',
      timestamp: '2 hours ago',
      read: false,
      icon: CheckCircle,
      iconColor: 'text-green-600'
    },
    {
      id: '2',
      type: 'document_required',
      title: 'Documents Required',
      message: 'Please upload additional documents for application LA202412002',
      timestamp: '4 hours ago',
      read: false,
      icon: AlertCircle,
      iconColor: 'text-orange-600'
    },
    {
      id: '3',
      type: 'application_assigned',
      title: 'DSA Assigned',
      message: 'Your application has been assigned to Jane Smith (SBI)',
      timestamp: '1 day ago',
      read: true,
      icon: Clock,
      iconColor: 'text-blue-600'
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

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

  const markAsRead = (notificationId: string) => {
    // TODO: Implement API call to mark notification as read
    console.log('Mark notification as read:', notificationId);
  };

  const markAllAsRead = () => {
    // TODO: Implement API call to mark all notifications as read
    console.log('Mark all notifications as read');
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
            <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative hover:bg-slate-100 p-2">
                  <Bell className="h-5 w-5 text-slate-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 max-h-[32rem] overflow-hidden">
                <div className="flex items-center justify-between p-3 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-700 h-6 px-2"
                    >
                      Mark all as read
                    </Button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-500">
                    <Bell className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm">No notifications</p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => {
                      const IconComponent = notification.icon;
                      return (
                        <DropdownMenuItem
                          key={notification.id}
                          className="p-0 cursor-pointer focus:bg-slate-50"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3 w-full p-3 hover:bg-slate-50">
                            <div className={`p-1.5 rounded-full bg-opacity-20 ${notification.iconColor.replace('text-', 'bg-')}`}>
                              <IconComponent className={`h-3.5 w-3.5 ${notification.iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1">
                                <p className="font-medium text-slate-900 text-sm leading-tight pr-2">
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <div className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                                )}
                              </div>
                              <p className="text-sm text-slate-600 leading-relaxed mb-2 break-words">
                                {notification.message}
                              </p>
                              <p className="text-xs text-slate-400">
                                {notification.timestamp}
                              </p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-slate-100 transition-colors">
                  <Avatar className="h-8 w-8 ring-2 ring-slate-200">
                    <AvatarImage src={user.profilePicture || undefined} alt={user.name} />
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
                      <AvatarImage src={user.profilePicture || undefined} alt={user.name} />
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
