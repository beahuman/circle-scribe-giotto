import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ToneType, TONE_THEMES, getMotivationalPhrase, getScoreMessage, getStreakMessage, getBadgeUnlockMessage, getModeUnlockMessage, isToneV2Unlocked, getToneMasteryLevel } from '@/utils/toneMessages';
import { useAdaptiveFeedback } from '@/hooks/useAdaptiveFeedback';
import { useToneLoyalty } from '@/hooks/useToneLoyalty';
import { useToneMastery } from '@/hooks/useToneMastery';
import { useTonePackExpansion } from '@/hooks/useTonePackExpansion';

export const useToneSystem = () => {
  const [selectedTone, setSelectedTone] = useState<ToneType>(() => {
    return (localStorage.getItem('feedbackTone') as ToneType) || 'playful';
  });
  
  const [toneUsage, setToneUsage] = useState<Record<ToneType, number>>(() => {
    const saved = localStorage.getItem('toneUsage');
    return saved ? JSON.parse(saved) : {
      calm: 0,
      playful: 0,
      formal: 0,
      sarcastic: 0,
      poetic: 0,
      existential: 0,
      romantic: 0,
      philosophical: 0,
      darkHumor: 0
    };
  });

  const [unlockedThemes, setUnlockedThemes] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('unlockedThemes');
    return new Set(saved ? JSON.parse(saved) : []);
  });

  const { toast } = useToast();
  const { recordDrawing } = useAdaptiveFeedback();
  const toneLoyalty = useToneLoyalty();
  const toneMastery = useToneMastery();
  const tonePackExpansion = useTonePackExpansion();

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('feedbackTone', selectedTone);
    localStorage.setItem('toneUsage', JSON.stringify(toneUsage));
    localStorage.setItem('unlockedThemes', JSON.stringify([...unlockedThemes]));
  }, [selectedTone, toneUsage, unlockedThemes]);

  const changeTone = (newTone: ToneType) => {
    setSelectedTone(newTone);
    toast({
      title: "Tone Updated",
      description: `Switched to ${newTone} tone`,
    });
  };

  const incrementToneUsage = (tone: ToneType = selectedTone, penalizePreviousTone: boolean = false) => {
    setToneUsage(prev => {
      const newUsage = { ...prev, [tone]: prev[tone] + 1 };
      
      // Track for tone loyalty system
      const totalDraws = Object.values(newUsage).reduce((sum, count) => sum + count, 0);
      toneLoyalty.recordToneUsage(tone, totalDraws);
      
      // Track for tone pack expansion system
      tonePackExpansion.trackToneUsage(tone, totalDraws);
      
      // Track for tone mastery system
      toneMastery.addLoyaltyPoint(tone);
      
      // Penalize previous tone if switched
      if (penalizePreviousTone && selectedTone !== tone) {
        toneMastery.penalizeToneSwitch(selectedTone);
      }
      
      // Check if this usage unlocks a theme
      const theme = TONE_THEMES[tone];
      if (theme && newUsage[tone] === theme.unlockRequirement && !unlockedThemes.has(theme.id)) {
        setUnlockedThemes(prev => new Set([...prev, theme.id]));
        toast({
          title: "🎨 Visual Theme Unlocked!",
          description: `${theme.name}: ${theme.description}`,
          duration: 4000,
        });
      }
      
      return newUsage;
    });
  };

  const isThemeUnlocked = (toneType: ToneType): boolean => {
    const theme = TONE_THEMES[toneType];
    if (!theme || !theme.id) return false;
    return unlockedThemes.has(theme.id);
  };

  const getThemeProgress = (toneType: ToneType): { current: number; required: number; percentage: number } => {
    const theme = TONE_THEMES[toneType];
    if (!theme) {
      return { current: 0, required: 1, percentage: 0 };
    }
    
    const current = toneUsage[toneType];
    const required = theme.unlockRequirement;
    return {
      current: Math.min(current, required),
      required,
      percentage: Math.min((current / required) * 100, 100)
    };
  };

  const getMostUsedTone = (): ToneType => {
    return Object.entries(toneUsage).reduce((max, [tone, count]) => 
      count > toneUsage[max] ? tone as ToneType : max, 'playful' as ToneType
    );
  };

  const getTotalToneChanges = (): number => {
    return Object.values(toneUsage).reduce((sum, count) => sum + count, 0);
  };

  // Message getters that automatically use current tone
  const getScoreMessageForTone = (score: number, mode?: string) => {
    incrementToneUsage(); // Track usage when getting feedback
    if (mode) {
      recordDrawing(score, mode, selectedTone);
    }
    
    // Use weighted rotation for Volume 2 content
    const sessionCount = parseInt(localStorage.getItem('sessionCount') || '0');
    const volumePreference = tonePackExpansion.getWeightedRotationPreference(selectedTone, sessionCount);
    const forceVolume = volumePreference === 'mixed' ? undefined : volumePreference;
    
    return getScoreMessage(selectedTone, score, toneUsage[selectedTone], forceVolume);
  };

  const getMotivationalPhraseForTone = () => {
    const sessionCount = parseInt(localStorage.getItem('sessionCount') || '0');
    const volumePreference = tonePackExpansion.getWeightedRotationPreference(selectedTone, sessionCount);
    const forceVolume = volumePreference === 'mixed' ? undefined : volumePreference;
    
    return getMotivationalPhrase(selectedTone, toneUsage[selectedTone], forceVolume);
  };

  const getToneMasteryLevelForTone = (tone: ToneType = selectedTone) => {
    return getToneMasteryLevel(toneUsage[tone]);
  };

  const isToneV2UnlockedForTone = (tone: ToneType = selectedTone) => {
    // Check both old system (usage-based) and new system (pack expansion)
    return isToneV2Unlocked(toneUsage[tone]) || tonePackExpansion.isVolume2Unlocked(tone);
  };

  const getPreviewMessage = (tone: ToneType) => {
    const usage = toneUsage[tone];
    return getScoreMessage(tone, 85, usage); // Sample score for preview
  };

  const getStreakMessageForTone = (streakLength: number) => {
    return getStreakMessage(selectedTone, streakLength);
  };

  const getBadgeUnlockMessageForTone = () => {
    return getBadgeUnlockMessage(selectedTone);
  };

  const getModeUnlockMessageForTone = (mode: 'blindDraw') => {
    return getModeUnlockMessage(selectedTone, mode);
  };

  const getActiveThemeStyles = () => {
    const theme = TONE_THEMES[selectedTone];
    if (!theme || !isThemeUnlocked(selectedTone)) {
      return {
        background: 'bg-gradient-to-br from-background to-muted',
        accent: 'text-primary',
        effects: []
      };
    }
    return {
      background: `bg-gradient-to-br ${theme.visualStyle.background}`,
      accent: theme.visualStyle.accent,
      effects: theme.visualStyle.effects || []
    };
  };

  return {
    selectedTone,
    toneUsage,
    unlockedThemes,
    changeTone,
    incrementToneUsage,
    isThemeUnlocked,
    getThemeProgress,
    getMostUsedTone,
    getTotalToneChanges,
    getScoreMessageForTone,
    getMotivationalPhraseForTone,
    getStreakMessageForTone,
    getBadgeUnlockMessageForTone,
    getModeUnlockMessageForTone,
    getActiveThemeStyles,
    getToneMasteryLevelForTone,
    isToneV2UnlockedForTone,
    getPreviewMessage,
    // Tone loyalty features
    toneLoyalty,
    // Tone mastery features
    toneMastery,
    // Tone pack expansion features
    tonePackExpansion,
  };
};