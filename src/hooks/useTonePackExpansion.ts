import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ToneType } from '@/utils/toneMessages';

interface TonePackProgress {
  drawCount: number;
  toneSwitches: number;
  currentTone: ToneType | null;
  startDrawCount: number; // When this tracking period started
  isVolume2Unlocked: boolean;
  unlockedAt?: string;
}

interface TonePackData {
  [key: string]: TonePackProgress; // tone -> progress
}

export const useTonePackExpansion = () => {
  const [tonePackData, setTonePackData] = useState<TonePackData>(() => {
    const saved = localStorage.getItem('tonePackExpansion');
    return saved ? JSON.parse(saved) : {};
  });

  const [showUnlockBanner, setShowUnlockBanner] = useState<string | null>(null);
  const { toast } = useToast();

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('tonePackExpansion', JSON.stringify(tonePackData));
  }, [tonePackData]);

  const trackToneUsage = (tone: ToneType, totalDrawCount: number) => {
    setTonePackData(prev => {
      const currentData = prev[tone] || {
        drawCount: 0,
        toneSwitches: 0,
        currentTone: tone,
        startDrawCount: totalDrawCount,
        isVolume2Unlocked: false
      };

      // If already unlocked, no need to track further
      if (currentData.isVolume2Unlocked) {
        return prev;
      }

      // Check if tone switched from a different one
      const hasCurrentTone = currentData.currentTone === tone;
      let updatedData: TonePackProgress;

      if (!hasCurrentTone && currentData.currentTone !== null) {
        // Tone switch detected - increment switch counter
        updatedData = {
          ...currentData,
          currentTone: tone,
          toneSwitches: currentData.toneSwitches + 1,
          drawCount: currentData.drawCount + 1
        };
      } else {
        // Same tone or first time tracking
        updatedData = {
          ...currentData,
          currentTone: tone,
          drawCount: currentData.drawCount + 1
        };
      }

      // Check for Volume 2 unlock
      if (updatedData.drawCount >= 10 && updatedData.toneSwitches <= 2 && !updatedData.isVolume2Unlocked) {
        updatedData.isVolume2Unlocked = true;
        updatedData.unlockedAt = new Date().toISOString();
        
        // Show unlock banner
        showVolumeUnlockBanner(tone);
      }

      return { ...prev, [tone]: updatedData };
    });
  };

  const showVolumeUnlockBanner = (tone: ToneType) => {
    setShowUnlockBanner(tone);
    
    // Auto-dismiss banner after 5 seconds
    setTimeout(() => {
      setShowUnlockBanner(null);
    }, 5000);
  };

  const dismissUnlockBanner = () => {
    setShowUnlockBanner(null);
  };

  const isVolume2Unlocked = (tone: ToneType): boolean => {
    return tonePackData[tone]?.isVolume2Unlocked || false;
  };

  const getTonePackLevel = (tone: ToneType): 1 | 2 => {
    return isVolume2Unlocked(tone) ? 2 : 1;
  };

  const getUnlockProgress = (tone: ToneType): { 
    drawCount: number; 
    toneSwitches: number; 
    isEligible: boolean;
    progressPercentage: number;
  } => {
    const data = tonePackData[tone];
    if (!data || data.isVolume2Unlocked) {
      return { drawCount: 10, toneSwitches: 0, isEligible: true, progressPercentage: 100 };
    }

    const isEligible = data.toneSwitches <= 2;
    const progressPercentage = Math.min((data.drawCount / 10) * 100, 100);

    return {
      drawCount: data.drawCount,
      toneSwitches: data.toneSwitches,
      isEligible,
      progressPercentage
    };
  };

  const getWeightedRotationPreference = (tone: ToneType, sessionCount: number = 0): 'v1' | 'v2' | 'mixed' => {
    if (!isVolume2Unlocked(tone)) return 'v1';
    
    const data = tonePackData[tone];
    if (!data?.unlockedAt) return 'v1';
    
    const unlockDate = new Date(data.unlockedAt);
    const daysSinceUnlock = Math.floor((Date.now() - unlockDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // First 10 sessions: 30-50% new lines (Volume 2)
    if (sessionCount < 10 || daysSinceUnlock < 3) {
      return Math.random() < 0.4 ? 'v2' : 'v1'; // 40% V2, 60% V1
    }
    
    // After 10 sessions: even split
    return Math.random() < 0.5 ? 'v2' : 'v1';
  };

  const getAllUnlockedVolume2Tones = (): ToneType[] => {
    return Object.keys(tonePackData)
      .filter(tone => tonePackData[tone]?.isVolume2Unlocked)
      .map(tone => tone as ToneType);
  };

  const getTotalVolume2Unlocks = (): number => {
    return getAllUnlockedVolume2Tones().length;
  };

  const resetTonePackProgress = () => {
    setTonePackData({});
    toast({
      title: "Tone Pack Progress Reset",
      description: "All Volume 2 unlock progress has been reset",
      duration: 3000,
    });
  };

  const previewToneContent = (tone: ToneType): { v1Sample: string; v2Sample?: string } => {
    // This would return sample content for tone preview
    const samples = {
      playful: {
        v1: "Ready to make some perfectly imperfect circles?",
        v2: "Your finger is ready for some circular mischief!"
      },
      calm: {
        v1: "One stroke. One breath. One circle.",
        v2: "Breathe deeply. Your circle awaits your mindful touch."
      },
      formal: {
        v1: "Precision through repetition and neural optimization.",
        v2: "Commencing advanced motor pattern reinforcement."
      },
      sarcastic: {
        v1: "Back for more punishment, are we?",
        v2: "Another day, another chance to mess up basic shapes."
      }
    };

    const toneSamples = samples[tone as keyof typeof samples];
    if (!toneSamples) {
      return { v1Sample: "Sample content for preview" };
    }

    return {
      v1Sample: toneSamples.v1,
      v2Sample: isVolume2Unlocked(tone) ? toneSamples.v2 : undefined
    };
  };

  return {
    trackToneUsage,
    isVolume2Unlocked,
    getTonePackLevel,
    getUnlockProgress,
    getWeightedRotationPreference,
    getAllUnlockedVolume2Tones,
    getTotalVolume2Unlocks,
    showUnlockBanner,
    dismissUnlockBanner,
    resetTonePackProgress,
    previewToneContent,
    tonePackData
  };
};