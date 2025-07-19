
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Brush, Sparkles, Volume2, Package } from "lucide-react";
import { usePlayerProgress } from "@/hooks/usePlayerProgress";
import { useCosmetics } from "@/hooks/useCosmetics";
import { useMonetization } from "@/hooks/useMonetization";
import { useStoreItems } from "@/hooks/useStoreItems";
import { MonetizedStoreItem } from "@/components/store/MonetizedStoreItem";
import { SupporterTierCard } from "@/components/store/SupporterTierCard";
import { StoreHeader } from "@/components/store/StoreHeader";
import LogoHeader from "@/components/common/LogoHeader";

const Store: React.FC = () => {
  const [activeTab, setActiveTab] = useState("background");
  
  const { level, xp, xpInCurrentLevel, xpForNextLevel, spendXp } = usePlayerProgress();
  const { unlockedItems, equippedItems, unlockItem, equipItem } = useCosmetics();
  const { 
    purchaseState, 
    isPurchased, 
    isPending, 
    purchaseItem, 
    restorePurchases,
    purchaseSupporterTier,
    hasSupporterTier 
  } = useMonetization();
  
  const { storeItems, getItemsByCategory } = useStoreItems();
  
  // Handle unlock with XP
  const handleUnlockWithXP = (itemId: string, cost: number) => {
    if (xp >= cost) {
      const success = spendXp(cost);
      if (success) {
        unlockItem(itemId);
        // Add haptic feedback for unlock
        if ('navigator' in window && 'vibrate' in navigator) {
          navigator.vibrate([30, 20, 50]);
        }
      }
    }
  };
  
  // Handle purchase with real money
  const handlePurchase = async (item: any) => {
    await purchaseItem(item);
  };
  
  // Handle equip item
  const handleEquip = (itemId: string) => {
    equipItem(itemId);
  };
  
  // Check if item is available (unlocked or purchased)
  const isItemAvailable = (itemId: string) => {
    return unlockedItems.includes(itemId) || isPurchased(itemId);
  };
  
  const renderCategoryItems = (category: string) => {
    const items = getItemsByCategory(category);
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map(item => (
          <MonetizedStoreItem
            key={item.id}
            item={item}
            isUnlocked={unlockedItems.includes(item.id)}
            isPurchased={isPurchased(item.id)}
            isPending={isPending(item.id)}
            isEquipped={equippedItems[item.category] === item.id}
            canAffordXP={xp >= item.cost}
            playerXp={xp}
            onUnlockWithXP={() => handleUnlockWithXP(item.id, item.cost)}
            onPurchase={() => handlePurchase(item)}
            onEquip={() => handleEquip(item.id)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 pb-20 space-y-grid">
      {/* Logo Header */}
      <div className="flex justify-center mb-8">
        <LogoHeader size="medium" />
      </div>
      
      <StoreHeader
        level={level}
        xp={xp}
        xpInCurrentLevel={xpInCurrentLevel}
        xpForNextLevel={xpForNextLevel}
        onRestorePurchases={restorePurchases}
      />
      
      <SupporterTierCard
        hasSupporterTier={hasSupporterTier}
        onPurchase={purchaseSupporterTier}
        isPending={isPending('supporter-tier')}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="background" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Themes</span>
          </TabsTrigger>
          <TabsTrigger value="trail" className="flex items-center gap-2">
            <Brush className="h-4 w-4" />
            <span className="hidden sm:inline">Brushes</span>
          </TabsTrigger>
          <TabsTrigger value="tone" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Tones</span>
          </TabsTrigger>
          <TabsTrigger value="ambient" className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <span className="hidden sm:inline">Audio</span>
          </TabsTrigger>
          <TabsTrigger value="bundle" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Bundles</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="background" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Background Themes</h2>
            </div>
            {renderCategoryItems('background')}
          </div>
        </TabsContent>
        
        <TabsContent value="trail" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Brush className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Drawing Brushes</h2>
            </div>
            {renderCategoryItems('trail')}
          </div>
        </TabsContent>
        
        <TabsContent value="tone" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Tone Variants</h2>
            </div>
            {renderCategoryItems('tone')}
          </div>
        </TabsContent>
        
        <TabsContent value="ambient" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Volume2 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Ambient Soundscapes</h2>
            </div>
            {renderCategoryItems('ambient')}
          </div>
        </TabsContent>
        
        <TabsContent value="bundle" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Premium Bundles</h2>
            </div>
            {renderCategoryItems('bundle')}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Component cleaned up - functionality moved to MonetizedStoreItem

export default Store;
