import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  CreditCard, 
  Calendar, 
  Settings as SettingsIcon,
  TrendingUp,
  History,
  Palette,
  Shield
} from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import PremiumModal from "@/components/subscription/PremiumModal";
import PremiumAnalytics from "@/components/premium/PremiumAnalytics";
import ExtendedHistory from "@/components/premium/ExtendedHistory";
import { format } from "date-fns";

const SubscriptionManagement: React.FC = () => {
  const { 
    subscribed, 
    subscription_tier, 
    subscription_end, 
    loading, 
    createCheckoutSession, 
    openCustomerPortal, 
    isPremium 
  } = useSubscription();
  
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'history'>('overview');

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <div className="text-center">Loading subscription status...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: SettingsIcon },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'history', label: 'History', icon: History }
  ];

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Crown className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Premium Subscription</h1>
        {isPremium && (
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Active
          </Badge>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-muted/30 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Current Subscription Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isPremium ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Giotto Premium</h3>
                      <p className="text-muted-foreground">
                        {subscription_tier} Plan - $9.99/month
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Active
                    </Badge>
                  </div>
                  
                  {subscription_end && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Next billing: {format(new Date(subscription_end), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={openCustomerPortal} variant="outline" className="flex-1">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Manage Subscription
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">No Active Subscription</h3>
                    <p className="text-muted-foreground">
                      Upgrade to Premium to unlock advanced features
                    </p>
                  </div>
                  
                  <Button onClick={() => setShowPremiumModal(true)} className="w-full sm:w-auto">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Premium Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Premium Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Advanced Analytics</h4>
                    <p className="text-sm text-muted-foreground">
                      Detailed progress reports and insights
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <History className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Extended History</h4>
                    <p className="text-sm text-muted-foreground">
                      Access unlimited session history
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Crown className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Exclusive Badges</h4>
                    <p className="text-sm text-muted-foreground">
                      Premium badge designs and achievements
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Ad-Free Experience</h4>
                    <p className="text-sm text-muted-foreground">
                      Enjoy Giotto without interruptions
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'analytics' && <PremiumAnalytics />}
      {activeTab === 'history' && <ExtendedHistory />}

      <PremiumModal 
        open={showPremiumModal} 
        onOpenChange={setShowPremiumModal} 
      />
    </div>
  );
};

export default SubscriptionManagement;