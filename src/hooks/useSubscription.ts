import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionState {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  loading: boolean;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
    loading: true,
  });

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setSubscriptionState({
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
        loading: false,
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        setSubscriptionState(prev => ({ ...prev, loading: false }));
        return;
      }

      setSubscriptionState({
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier || null,
        subscription_end: data.subscription_end || null,
        loading: false,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscriptionState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  const createCheckoutSession = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe to premium",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) {
        console.error('Error creating checkout session:', error);
        toast({
          title: "Error",
          description: "Failed to create checkout session. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openCustomerPortal = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to manage your subscription",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        console.error('Error opening customer portal:', error);
        toast({
          title: "Error",
          description: "Failed to open subscription management. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open subscription management. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  return {
    ...subscriptionState,
    checkSubscription,
    createCheckoutSession,
    openCustomerPortal,
    isPremium: subscriptionState.subscribed && subscriptionState.subscription_tier === 'Premium',
  };
};