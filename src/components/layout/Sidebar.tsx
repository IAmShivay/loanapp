'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
// import { Separator } from '@/components/ui/separator';
import { 
  Home, 
  Users, 
  FileText, 
  MessageSquare, 
  HelpCircle, 
  Settings, 
  BarChart3,
  Calculator,
  User,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  // Admin Navigation
  {
    name: 'Overview',
    href: '/admin',
    icon: Home,
    roles: ['admin'],
  },
  {
    name: 'User Management',
    href: '/admin/users',
    icon: Users,
    roles: ['admin'],
  },
  {
    name: 'DSA Management',
    href: '/admin/dsa',
    icon: Users,
    roles: ['admin'],
  },
  {
    name: 'Loan Applications',
    href: '/admin/applications',
    icon: FileText,
    roles: ['admin'],
  },
  {
    name: 'Support Tickets',
    href: '/admin/support',
    icon: HelpCircle,
    roles: ['admin'],
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    roles: ['admin'],
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    roles: ['admin'],
  },

  // DSA Navigation
  {
    name: 'Dashboard',
    href: '/dsa',
    icon: Home,
    roles: ['dsa'],
  },
  {
    name: 'Applications Queue',
    href: '/dsa/applications',
    icon: FileText,
    roles: ['dsa'],
  },
  {
    name: 'Chat',
    href: '/dsa/chat',
    icon: MessageSquare,
    roles: ['dsa'],
  },
  {
    name: 'Support',
    href: '/dsa/support',
    icon: HelpCircle,
    roles: ['dsa'],
  },
  {
    name: 'Profile',
    href: '/dsa/profile',
    icon: User,
    roles: ['dsa'],
  },

  // User Navigation
  {
    name: 'Dashboard',
    href: '/user',
    icon: Home,
    roles: ['user'],
  },
  {
    name: 'My Applications',
    href: '/user/applications',
    icon: FileText,
    roles: ['user'],
  },
  {
    name: 'Loan Calculator',
    href: '/user/calculator',
    icon: Calculator,
    roles: ['user'],
  },
  {
    name: 'Chat',
    href: '/user/chat',
    icon: MessageSquare,
    roles: ['user'],
  },
  {
    name: 'Support',
    href: '/user/support',
    icon: HelpCircle,
    roles: ['user'],
  },
  {
    name: 'Profile',
    href: '/user/profile',
    icon: User,
    roles: ['user'],
  },
];

export default function Sidebar({ isOpen, onClose, userRole }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const filteredNavItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href;
    const isExpanded = expandedItems.includes(item.name);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div>
        <Link
          href={item.href}
          className={cn(
            "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            isActive 
              ? "bg-primary text-primary-foreground" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.name);
            } else {
              onClose();
            }
          }}
        >
          <div className="flex items-center space-x-3">
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </div>
          {hasChildren && (
            isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
        </Link>
        
        {hasChildren && isExpanded && (
          <div className="ml-6 mt-1 space-y-1">
            {item.children?.map((child) => (
              <NavItemComponent key={child.name} item={child} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0 lg:static lg:inset-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LM</span>
              </div>
              <span className="font-semibold text-lg">Loan Manager</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {filteredNavItems.map((item) => (
              <NavItemComponent key={item.name} item={item} />
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              © 2024 Loan Management System
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
