"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  className,
  animationDelay = 0
}) {
  return (
    <Card
      className={cn(
        "border-0 shadow-none bg-muted/40 hover:bg-muted/60 transition-all duration-300 group opacity-0 animate-slide-up",
        className
      )}
      style={{ animationDelay: `${animationDelay}ms`, animationFillMode: 'forwards' }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:scale-110 group-hover:text-primary" />
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-2xl font-semibold tracking-tight truncate" title={value}>{value}</div>
        {(description || trend) && (
          <div className="flex items-center gap-2 mt-1">
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium",
                  trend === "up"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-500 dark:text-red-400"
                )}
              >
                {trend === "up" ? "↑" : "↓"} {trendValue}
              </span>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function StatsCardSkeleton() {
  return (
    <Card className="relative overflow-hidden border-0 shadow-none bg-muted/40">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="h-4 w-24 bg-muted rounded animate-shimmer" />
        <div className="h-10 w-10 bg-muted rounded-lg animate-shimmer" style={{ animationDelay: '0.1s' }} />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-20 bg-muted rounded mb-2 animate-shimmer" style={{ animationDelay: '0.2s' }} />
        <div className="h-3 w-32 bg-muted rounded animate-shimmer" style={{ animationDelay: '0.3s' }} />
      </CardContent>
    </Card>
  );
}

