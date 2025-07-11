import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface MonetizationItem {
  id: string;
  name: string;
  description: string;
  cost: number; // XP cost for free unlock
  price?: number; // Real money price in cents
  currency?: string; // Currency code (USD, EUR, etc.)
  isPremium: boolean; // Can only be purchased, not unlocked with XP
  isBundle: boolean;
  category: string;
  thumbnail: string;
  value: string;
  previewAnimation?: string;
}

export interface PurchaseState {
  purchasedItems: string[];
  supporterTier: boolean;
  pendingPurchases: string[];
}

// Mock purchase function - in real app this would integrate with platform IAP
const mockPurchase = async (itemId: string, price: number): Promise<boolean> => {
  // Simulate purchase delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate 90% success rate
  return Math.random() > 0.1;
};

export const useMonetization = () => {
  const { toast } = useToast();
  
  const [purchaseState, setPurchaseState] = useState<PurchaseState>(() => {
    const saved = localStorage.getItem('monetizationState');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      purchasedItems: [],
      supporterTier: false,
      pendingPurchases: []
    };
  });

  // Save purchase state to localStorage
  useEffect(() => {
    localStorage.setItem('monetizationState', JSON.stringify(purchaseState));
  }, [purchaseState]);

  const isPurchased = useCallback((itemId: string) => {
    return purchaseState.purchasedItems.includes(itemId);
  }, [purchaseState.purchasedItems]);

  const isPending = useCallback((itemId: string) => {
    return purchaseState.pendingPurchases.includes(itemId);
  }, [purchaseState.pendingPurchases]);

  const purchaseItem = useCallback(async (item: MonetizationItem) => {
    if (!item.price) return false;
    
    // Add to pending purchases
    setPurchaseState(prev => ({
      ...prev,
      pendingPurchases: [...prev.pendingPurchases, item.id]
    }));

    try {
      // Show purchase confirmation
      const confirmed = window.confirm(
        `Purchase ${item.name} for $${(item.price / 100).toFixed(2)}?`
      );
      
      if (!confirmed) {
        setPurchaseState(prev => ({
          ...prev,
          pendingPurchases: prev.pendingPurchases.filter(id => id !== item.id)
        }));
        return false;
      }

      // Attempt purchase
      const success = await mockPurchase(item.id, item.price);
      
      if (success) {
        // Add to purchased items
        setPurchaseState(prev => ({
          ...prev,
          purchasedItems: [...prev.purchasedItems, item.id],
          pendingPurchases: prev.pendingPurchases.filter(id => id !== item.id),
          supporterTier: item.id === 'supporter-tier' ? true : prev.supporterTier
        }));
        
        toast({
          title: "Purchase Successful!",
          description: `${item.name} has been added to your collection.`,
          duration: 3000
        });
        
        // Add haptic feedback
        if ('navigator' in window && 'vibrate' in navigator) {
          navigator.vibrate([50, 30, 50]);
        }
        
        return true;
      } else {
        throw new Error('Purchase failed');
      }
    } catch (error) {
      // Remove from pending and show error
      setPurchaseState(prev => ({
        ...prev,
        pendingPurchases: prev.pendingPurchases.filter(id => id !== item.id)
      }));
      
      toast({
        title: "Purchase Failed",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
        duration: 4000
      });
      
      return false;
    }
  }, [toast]);

  const restorePurchases = useCallback(async () => {
    // In real app, this would query platform IAP for purchase history
    toast({
      title: "Restore Complete",
      description: "Your purchases have been restored.",
      duration: 3000
    });
  }, [toast]);

  const purchaseSupporterTier = useCallback(async () => {
    const supporterItem: MonetizationItem = {
      id: 'supporter-tier',
      name: 'Studio Patron',
      description: 'Support neural creativity development',
      cost: 0,
      price: 499, // $4.99
      currency: 'USD',
      isPremium: true,
      isBundle: false,
      category: 'supporter',
      thumbnail: '',
      value: 'supporter',
      previewAnimation: 'golden-glow'
    };
    
    return await purchaseItem(supporterItem);
  }, [purchaseItem]);

  return {
    purchaseState,
    isPurchased,
    isPending,
    purchaseItem,
    restorePurchases,
    purchaseSupporterTier,
    hasSupporterTier: purchaseState.supporterTier
  };
};