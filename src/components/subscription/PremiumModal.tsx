import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Crown, 
  TrendingUp, 
  Calendar, 
  Palette, 
  Shield, 
  Brain, 
  Settings 
} from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

interface PremiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ open, onOpenChange }) => {
  const { createCheckoutSession, loading } = useSubscription();

  const features = [
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Advanced Analytics",
      description: "Detailed progress reports with trend analysis and performance insights"
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Extended History",
      description: "Access your complete drawing history beyond 30 days"
    },
    {
      icon: <Crown className="h-5 w-5" />,
      title: "Exclusive Badges",
      description: "Premium badge designs and achievement tiers"
    },
    {
      icon: <Palette className="h-5 w-5" />,
      title: "Premium Themes",
      description: "Exclusive minimalist themes and customization options"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Ad-Free Experience",
      description: "Enjoy Giotto without any advertisements or interruptions"
    },
    {
      icon: <Brain className="h-5 w-5" />,
      title: "Neuroscience Content",
      description: "Premium tips and insights based on motor learning research"
    },
    {
      icon: <Settings className="h-5 w-5" />,
      title: "Custom Settings",
      description: "Advanced difficulty settings and specialized practice modes"
    }
  ];

  const handleSubscribe = () => {
    createCheckoutSession();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Crown className="h-6 w-6 text-primary" />
            <DialogTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              Giotto Premium
            </DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Unlock advanced features and elevate your circle drawing practice
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pricing Card */}
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-400/5">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl font-bold">$9.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <Badge variant="secondary" className="mb-4">
                Cancel anytime
              </Badge>
              <p className="text-sm text-muted-foreground">
                Start your 30-day free trial today
              </p>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary flex-shrink-0">
                  {feature.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                </div>
                <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full h-12 text-base font-medium"
            >
              {loading ? "Processing..." : "Start Free Trial"}
            </Button>
            
            <p className="text-center text-xs text-muted-foreground">
              Secure payment powered by Stripe. Cancel anytime in your account settings.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumModal;