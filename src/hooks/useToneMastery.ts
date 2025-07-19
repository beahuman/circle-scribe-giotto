import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ToneType } from '@/utils/toneMessages';

interface ToneMasteryData {
  [key: string]: {
    loyaltyPoints: number;
    unlockedMilestones: number[];
    volumeTwoUnlocked: boolean;
    masteryBadgeEarned: boolean;
    variantUnlocked: boolean;
  };
}

interface MasteryMilestone {
  points: number;
  reward: 'bonus_feedback' | 'volume_two' | 'variant_unlock';
  description: string;
}

const MASTERY_MILESTONES: MasteryMilestone[] = [
  { points: 5, reward: 'bonus_feedback', description: 'Bonus feedback lines unlocked' },
  { points: 10, reward: 'volume_two', description: 'Volume 2 personality unlocked' },
  { points: 20, reward: 'variant_unlock', description: 'Advanced tone variant unlocked' }
];

export const useToneMastery = () => {
  const [masteryData, setMasteryData] = useState<ToneMasteryData>(() => {
    const saved = localStorage.getItem('toneMasteryData');
    return saved ? JSON.parse(saved) : {};
  });

  const [pendingVariantUnlock, setPendingVariantUnlock] = useState<{baseTone: ToneType, variant: ToneType} | null>(null);

  const { toast } = useToast();

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('toneMasteryData', JSON.stringify(masteryData));
  }, [masteryData]);

  const addLoyaltyPoint = (tone: ToneType) => {
    setMasteryData(prev => {
      const currentData = prev[tone] || {
        loyaltyPoints: 0,
        unlockedMilestones: [],
        volumeTwoUnlocked: false,
        masteryBadgeEarned: false,
        variantUnlocked: false
      };

      const newPoints = currentData.loyaltyPoints + 1;
      const updatedData = { ...currentData, loyaltyPoints: newPoints };

      // Check for milestone unlocks
      MASTERY_MILESTONES.forEach(milestone => {
        if (newPoints >= milestone.points && !currentData.unlockedMilestones.includes(milestone.points)) {
          updatedData.unlockedMilestones = [...currentData.unlockedMilestones, milestone.points];
          
          if (milestone.reward === 'volume_two') {
            updatedData.volumeTwoUnlocked = true;
          }

          // Check for tone variant unlock at 20 points
          if (milestone.reward === 'variant_unlock' && newPoints >= 20 && !currentData.variantUnlocked) {
            updatedData.variantUnlocked = true;
            showToneVariantUnlock(tone);
          }

          // Show unlock notification
          showMasteryUnlock(tone, milestone);
        }
      });

      // Check for mastery badge (30+ points)
      if (newPoints >= 30 && !currentData.masteryBadgeEarned) {
        updatedData.masteryBadgeEarned = true;
        showMasteryBadge(tone);
      }

      return { ...prev, [tone]: updatedData };
    });
  };

  const penalizeToneSwitch = (tone: ToneType) => {
    setMasteryData(prev => {
      const currentData = prev[tone] || {
        loyaltyPoints: 0,
        unlockedMilestones: [],
        volumeTwoUnlocked: false,
        masteryBadgeEarned: false,
        variantUnlocked: false
      };

      const newPoints = Math.max(0, currentData.loyaltyPoints - 3);
      
      return {
        ...prev,
        [tone]: { ...currentData, loyaltyPoints: newPoints }
      };
    });
  };

  const showMasteryUnlock = (tone: ToneType, milestone: MasteryMilestone) => {
    const toneMessages: Record<ToneType, Record<string, string>> = {
      playful: {
        bonus_feedback: "I've got more jokes for you now!",
        volume_two: "Volume 2 playfulness activated! Let's get creative!",
        variant_unlock: "You've stayed true to this voice. Giotto opens a deeper dialogue..."
      },
      calm: {
        bonus_feedback: "More meditative insights await you.",
        volume_two: "Volume 2 serenity unlocked. Deeper peace flows through.",
        variant_unlock: "Poetic Mode unlocked. Fewer words. Deeper truths."
      },
      formal: {
        bonus_feedback: "Additional structured feedback is now available.",
        volume_two: "Volume 2 formality protocol engaged.",
        variant_unlock: "Your consistency has earned contemplative wisdom."
      },
      sarcastic: {
        bonus_feedback: "Oh great, more sarcasm. Just what you needed.",
        volume_two: "Volume 2 sarcasm: Now with extra bite.",
        variant_unlock: "Dark Humor unlocked. Reality hits different now."
      },
      romantic: {
        bonus_feedback: "More tender words flow from my heart.",
        volume_two: "Volume 2 romance: Deeper affection awakens.",
        variant_unlock: ""
      },
      poetic: {
        bonus_feedback: "New verses whisper in the silence.",
        volume_two: "Volume 2 poetry: Where metaphors dance.",
        variant_unlock: ""
      },
      philosophical: {
        bonus_feedback: "Deeper questions emerge from thought.",
        volume_two: "Volume 2 philosophy: Wisdom deepens.",
        variant_unlock: ""
      },
      darkHumor: {
        bonus_feedback: "More darkness, delivered with a smile.",
        volume_two: "Volume 2 dark humor: Embrace the void.",
        variant_unlock: ""
      },
      existential: {
        bonus_feedback: "Questions within questions unfold.",
        volume_two: "Volume 2 existentialism: Meaning in meaninglessness.",
        variant_unlock: ""
      }
    };

    const message = toneMessages[tone]?.[milestone.reward] || milestone.description;

    toast({
      title: `🎭 Tone Mastery Unlocked!`,
      description: message,
      duration: 5000,
    });
  };

  const showMasteryBadge = (tone: ToneType) => {
    toast({
      title: `🏆 Tone Mastered!`,
      description: `You've achieved true mastery of the ${tone} tone. Giotto honors your dedication.`,
      duration: 6000,
    });
  };

  const showToneVariantUnlock = (tone: ToneType) => {
    const variantMapping = {
      playful: 'romantic',
      calm: 'poetic', 
      formal: 'philosophical',
      sarcastic: 'darkHumor'
    } as const;

    const variant = variantMapping[tone as keyof typeof variantMapping];
    if (!variant) return;

    // Set pending unlock to trigger modal
    setPendingVariantUnlock({ baseTone: tone, variant });

    toast({
      title: `✨ New Tone Variant Unlocked!`,
      description: `You've stayed true to your voice. ${variant.charAt(0).toUpperCase() + variant.slice(1)} tone unlocked.`,
      duration: 6000,
    });
  };

  const getToneMasteryLevel = (tone: ToneType): number => {
    const data = masteryData[tone];
    if (!data) return 0;

    if (data.loyaltyPoints >= 20) return 3; // Variant unlocked
    if (data.loyaltyPoints >= 10) return 2; // Volume 2
    if (data.loyaltyPoints >= 5) return 1;  // Bonus feedback
    return 0;
  };

  const getToneLoyaltyProgress = (tone: ToneType) => {
    const data = masteryData[tone] || { loyaltyPoints: 0, unlockedMilestones: [], volumeTwoUnlocked: false, masteryBadgeEarned: false, variantUnlocked: false };
    const points = data.loyaltyPoints;
    
    // Find next milestone
    const nextMilestone = MASTERY_MILESTONES.find(m => points < m.points);
    
    if (!nextMilestone) {
      return {
        current: points,
        target: 30, // Mastery badge target
        percentage: points >= 30 ? 100 : (points / 30) * 100,
        nextReward: 'Tone Mastery Badge'
      };
    }

    return {
      current: points,
      target: nextMilestone.points,
      percentage: (points / nextMilestone.points) * 100,
      nextReward: nextMilestone.description
    };
  };

  const isMilestoneUnlocked = (tone: ToneType, milestone: number): boolean => {
    const data = masteryData[tone];
    return data?.unlockedMilestones.includes(milestone) || false;
  };

  const isVolumeTwoUnlocked = (tone: ToneType): boolean => {
    return masteryData[tone]?.volumeTwoUnlocked || false;
  };

  const isMasteryBadgeEarned = (tone: ToneType): boolean => {
    return masteryData[tone]?.masteryBadgeEarned || false;
  };

  const getTotalMasteryPoints = (): number => {
    return Object.values(masteryData).reduce((total, data) => total + data.loyaltyPoints, 0);
  };

  const getMostMasteredTone = (): { tone: ToneType; points: number } | null => {
    let maxTone: ToneType | null = null;
    let maxPoints = 0;

    Object.entries(masteryData).forEach(([tone, data]) => {
      if (data.loyaltyPoints > maxPoints) {
        maxPoints = data.loyaltyPoints;
        maxTone = tone as ToneType;
      }
    });

    return maxTone ? { tone: maxTone, points: maxPoints } : null;
  };

  const getUnlockedToneVariant = (baseTone: ToneType): ToneType | null => {
    const variantMapping = {
      playful: 'romantic',
      calm: 'poetic', 
      formal: 'philosophical',
      sarcastic: 'darkHumor'
    } as const;

    const variant = variantMapping[baseTone as keyof typeof variantMapping];
    if (!variant) return null;

    const masteryLevel = getToneMasteryLevel(baseTone);
    return masteryLevel >= 3 ? variant : null;
  };

  const isToneVariantUnlocked = (baseTone: ToneType): boolean => {
    return getUnlockedToneVariant(baseTone) !== null;
  };

  const clearPendingVariantUnlock = () => {
    setPendingVariantUnlock(null);
  };

  const resetToneMastery = () => {
    setMasteryData({});
    toast({
      title: "Tone Mastery Reset",
      description: "All tone mastery progress has been reset",
      duration: 3000,
    });
  };

  return {
    masteryData,
    pendingVariantUnlock,
    addLoyaltyPoint,
    penalizeToneSwitch,
    getToneMasteryLevel,
    getToneLoyaltyProgress,
    isMilestoneUnlocked,
    isVolumeTwoUnlocked,
    isMasteryBadgeEarned,
    getTotalMasteryPoints,
    getMostMasteredTone,
    getUnlockedToneVariant,
    isToneVariantUnlocked,
    clearPendingVariantUnlock,
    resetToneMastery,
    MASTERY_MILESTONES
  };
};