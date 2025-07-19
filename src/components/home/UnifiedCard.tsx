
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getStandardRadius } from "@/utils/borderRadiusStandardization";

interface UnifiedCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'passive';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

const cardVariants = {
  default: "bg-card border-border hover:bg-[hsl(var(--card-hover))] active:bg-[hsl(var(--card-active))]",
  primary: "bg-[hsl(var(--card-interactive))] hover:bg-[hsl(var(--card-interactive-hover))] active:bg-[hsl(var(--card-interactive-active))] border-primary/20",
  secondary: "bg-gradient-to-r from-secondary/5 to-secondary/10 hover:from-secondary/10 hover:to-secondary/20 border-secondary/20",
  accent: "bg-gradient-to-r from-accent/5 to-accent/10 hover:from-accent/10 hover:to-accent/20 border-accent/20",
  passive: "bg-[hsl(var(--muted))] border-border/50"
};

const cardSizes = {
  sm: "p-3",
  md: "p-4", 
  lg: "p-6"
};

const UnifiedCard: React.FC<UnifiedCardProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  onClick,
  interactive = false
}) => {
  return (
    <Card 
      className={cn(
        "transition-all duration-200",
        cardVariants[variant],
        interactive && "hover:shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-transform duration-200",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardContent className={cn(cardSizes[size])}>
        {children}
      </CardContent>
    </Card>
  );
};

export default UnifiedCard;
