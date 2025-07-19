import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ToneType } from '@/utils/toneMessages';

interface ToneLoyaltyData {
  currentTone: ToneType;
  consecutiveUses: number;
  toneSwitches: number;
  startDrawCount: number;
  unlockedAdvancedTones: ToneType[];
}

export const useToneLoyalty = () => {
  const [loyaltyData, setLoyaltyData] = useState<ToneLoyaltyData>(() => {
    const saved = localStorage.getItem('toneLoyaltyData');
    return saved ? JSON.parse(saved) : {
      currentTone: 'playful',
      consecutiveUses: 0,
      toneSwitches: 0,
      startDrawCount: 0,
      unlockedAdvancedTones: []
    };
  });

  const { toast } = useToast();

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('toneLoyaltyData', JSON.stringify(loyaltyData));
  }, [loyaltyData]);

  const recordToneUsage = (tone: ToneType, totalDraws: number) => {
    setLoyaltyData(prev => {
      const isNewLoyaltyPeriod = prev.currentTone !== tone;
      
      if (isNewLoyaltyPeriod) {
        // Reset loyalty tracking for new tone
        return {
          currentTone: tone,
          consecutiveUses: 1,
          toneSwitches: prev.toneSwitches + (prev.consecutiveUses > 0 ? 1 : 0),
          startDrawCount: totalDraws,
          unlockedAdvancedTones: prev.unlockedAdvancedTones
        };
      } else {
        // Continue with same tone
        const updatedData = {
          ...prev,
          consecutiveUses: prev.consecutiveUses + 1
        };

        // Check for loyalty unlock (20+ consecutive uses, max 3 switches allowed)
        if (updatedData.consecutiveUses >= 20 && updatedData.toneSwitches <= 3) {
          const advancedTone = getAdvancedToneForBase(tone);
          if (advancedTone && !prev.unlockedAdvancedTones.includes(advancedTone)) {
            updatedData.unlockedAdvancedTones = [...prev.unlockedAdvancedTones, advancedTone];
            
            // Show unlock celebration
            showToneLoyaltyUnlock(tone, advancedTone);
          }
        }

        return updatedData;
      }
    });
  };

  const getAdvancedToneForBase = (baseTone: ToneType): ToneType | null => {
    const toneMap: Record<ToneType, ToneType | null> = {
      playful: 'romantic',
      calm: 'poetic',
      formal: 'philosophical',
      sarcastic: 'darkHumor',
      poetic: null,
      existential: null,
      romantic: null,
      philosophical: null,
      darkHumor: null
    };
    return toneMap[baseTone];
  };

  const showToneLoyaltyUnlock = (baseTone: ToneType, advancedTone: ToneType) => {
    const unlockMessages: Record<ToneType, string> = {
      romantic: "You've walked this path long enough to hear my softer side...",
      poetic: "Poetic Mode unlocked. Fewer words. Deeper truths.",
      philosophical: "Your consistency has earned contemplative wisdom.",
      darkHumor: "Dark Humor unlocked. Reality hits different now.",
      playful: "",
      calm: "",
      formal: "",
      sarcastic: "",
      existential: ""
    };

    toast({
      title: `🎭 ${advancedTone.charAt(0).toUpperCase() + advancedTone.slice(1)} Tone Unlocked!`,
      description: unlockMessages[advancedTone] || "Advanced tone unlocked through loyalty!",
      duration: 6000,
    });
  };

  const isAdvancedToneUnlocked = (tone: ToneType): boolean => {
    return loyaltyData.unlockedAdvancedTones.includes(tone);
  };

  const getLoyaltyProgress = (currentTone: ToneType): { progress: number; required: number; isEligible: boolean } => {
    const isEligible = loyaltyData.toneSwitches <= 3 && loyaltyData.currentTone === currentTone;
    return {
      progress: Math.min(loyaltyData.consecutiveUses, 20),
      required: 20,
      isEligible
    };
  };

  const getAdvancedTonePreview = (baseTone: ToneType): ToneType | null => {
    return getAdvancedToneForBase(baseTone);
  };

  const resetLoyaltyProgress = () => {
    setLoyaltyData({
      currentTone: 'playful',
      consecutiveUses: 0,
      toneSwitches: 0,
      startDrawCount: 0,
      unlockedAdvancedTones: []
    });
    toast({
      title: "Tone Loyalty Reset",
      description: "Starting fresh with tone loyalty tracking",
      duration: 3000,
    });
  };

  return {
    loyaltyData,
    recordToneUsage,
    isAdvancedToneUnlocked,
    getLoyaltyProgress,
    getAdvancedTonePreview,
    resetLoyaltyProgress,
  };
};