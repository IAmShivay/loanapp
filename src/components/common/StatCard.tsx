'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  HelpCircle,
  Calculator,
  MessageSquare,
  Plus,
  Eye,
  AlertTriangle
} from 'lucide-react';

const iconMap = {
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  HelpCircle,
  Calculator,
  MessageSquare,
  Plus,
  Eye,
  AlertTriangle,
};

type IconName = keyof typeof iconMap;

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: IconName;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export default function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className
}: StatCardProps) {
  const Icon = icon ? iconMap[icon] : null;

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
            {trend && (
              <span className={cn(
                "flex items-center",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
            )}
            {description && <span>{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
