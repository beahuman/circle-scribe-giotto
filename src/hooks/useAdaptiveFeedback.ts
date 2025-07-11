import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ToneType } from '@/utils/toneMessages';

export interface BehaviorPattern {
  scoreImprovement: {
    consecutiveImprovements: number;
    lastScores: number[];
    hasRecentDrop: boolean;
  };
  streakConsistency: {
    currentStreak: number;
    longestStreak: number;
    consistentDays: number;
  };
  modeUsage: {
    mostUsedMode: string;
    advancedModeCount: number;
    modeExperience: Record<string, number>;
  };
  toneCommitment: {
    currentTone: ToneType;
    toneSessions: number;
    deepVariantsUnlocked: boolean;
  };
  totalDrawings: number;
  milestoneProgress: string[];
}

export interface AdaptiveSettings {
  enabled: boolean;
  deepVariantsEnabled: boolean;
  behaviorInsightsEnabled: boolean;
}

export const useAdaptiveFeedback = () => {
  const [behaviorPattern, setBehaviorPattern] = useState<BehaviorPattern>(() => {
    const saved = localStorage.getItem('adaptiveBehaviorPattern');
    return saved ? JSON.parse(saved) : {
      scoreImprovement: {
        consecutiveImprovements: 0,
        lastScores: [],
        hasRecentDrop: false,
      },
      streakConsistency: {
        currentStreak: 0,
        longestStreak: 0,
        consistentDays: 0,
      },
      modeUsage: {
        mostUsedMode: 'practice',
        advancedModeCount: 0,
        modeExperience: { practice: 0 },
      },
      toneCommitment: {
        currentTone: 'playful' as ToneType,
        toneSessions: 0,
        deepVariantsUnlocked: false,
      },
      totalDrawings: 0,
      milestoneProgress: [],
    };
  });

  const [adaptiveSettings, setAdaptiveSettings] = useState<AdaptiveSettings>(() => {
    const saved = localStorage.getItem('adaptiveSettings');
    return saved ? JSON.parse(saved) : {
      enabled: true,
      deepVariantsEnabled: true,
      behaviorInsightsEnabled: true,
    };
  });

  const { toast } = useToast();

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('adaptiveBehaviorPattern', JSON.stringify(behaviorPattern));
  }, [behaviorPattern]);

  useEffect(() => {
    localStorage.setItem('adaptiveSettings', JSON.stringify(adaptiveSettings));
  }, [adaptiveSettings]);

  const recordDrawing = (score: number, mode: string = 'practice', tone: ToneType) => {
    setBehaviorPattern(prev => {
      const newPattern = { ...prev };
      
      // Update score improvement tracking
      const lastScores = [...prev.scoreImprovement.lastScores, score].slice(-5);
      const consecutiveImprovements = calculateConsecutiveImprovements(lastScores);
      const hasRecentDrop = lastScores.length >= 2 && 
        lastScores[lastScores.length - 1] < lastScores[lastScores.length - 2] - 20;

      newPattern.scoreImprovement = {
        consecutiveImprovements,
        lastScores,
        hasRecentDrop,
      };

      // Update mode usage
      newPattern.modeUsage.modeExperience[mode] = (prev.modeUsage.modeExperience[mode] || 0) + 1;
      if (['blindDraw', 'spiral', 'offset', 'perceptionGauntlet'].includes(mode)) {
        newPattern.modeUsage.advancedModeCount += 1;
      }

      // Update tone commitment
      if (prev.toneCommitment.currentTone === tone) {
        newPattern.toneCommitment.toneSessions += 1;
      } else {
        newPattern.toneCommitment = {
          currentTone: tone,
          toneSessions: 1,
          deepVariantsUnlocked: false,
        };
      }

      // Check for deep variant unlock
      if (newPattern.toneCommitment.toneSessions >= 10 && !newPattern.toneCommitment.deepVariantsUnlocked) {
        newPattern.toneCommitment.deepVariantsUnlocked = true;
        if (adaptiveSettings.deepVariantsEnabled) {
          toast({
            title: "Tone Mastery Unlocked",
            description: `Deeper ${tone} phrases are now available.`,
            duration: 4000,
          });
        }
      }

      newPattern.totalDrawings += 1;

      return newPattern;
    });
  };

  const calculateConsecutiveImprovements = (scores: number[]): number => {
    if (scores.length < 2) return 0;
    
    let consecutive = 0;
    for (let i = scores.length - 1; i > 0; i--) {
      if (scores[i] > scores[i - 1]) {
        consecutive++;
      } else {
        break;
      }
    }
    return consecutive;
  };

  const getAdaptiveMessage = (baseMessage: string, context: 'score' | 'motivation' | 'streak'): string => {
    if (!adaptiveSettings.enabled) return baseMessage;

    const { scoreImprovement, streakConsistency, toneCommitment, totalDrawings } = behaviorPattern;

    // Score improvement context
    if (context === 'score' && scoreImprovement.consecutiveImprovements >= 3) {
      const improvementMessages = {
        meditative: "Your awareness deepens with each stroke.",
        playful: "You're on fire! Three in a row of getting better!",
        formal: "Sustained improvement pattern detected.",
        sarcastic: "Look who's actually getting better. Shocking.",
      };
      return improvementMessages[toneCommitment.currentTone] || baseMessage;
    }

    // Recovery from drop
    if (context === 'score' && scoreImprovement.hasRecentDrop) {
      const recoveryMessages = {
        meditative: "Each stumble teaches. Each breath steadies.",
        playful: "Rough one? That's what practice is for!",
        formal: "Performance fluctuation is within normal parameters.",
        sarcastic: "Well, that was... something. Try again?",
      };
      return recoveryMessages[toneCommitment.currentTone] || baseMessage;
    }

    // Deep tone variants
    if (toneCommitment.deepVariantsUnlocked && adaptiveSettings.deepVariantsEnabled) {
      const deepVariants = getDeepToneVariants(toneCommitment.currentTone, context);
      if (deepVariants.length > 0) {
        return deepVariants[Math.floor(Math.random() * deepVariants.length)];
      }
    }

    // Milestone-based messages
    if (totalDrawings > 0 && totalDrawings % 25 === 0) {
      const milestoneMessages = {
        meditative: `${totalDrawings} circles drawn. Your path reveals itself.`,
        playful: `${totalDrawings} circles! You're basically a pro now.`,
        formal: `Drawing session ${totalDrawings} completed. Neural adaptation confirmed.`,
        sarcastic: `${totalDrawings} attempts. Still not perfect, but who's counting?`,
      };
      return milestoneMessages[toneCommitment.currentTone] || baseMessage;
    }

    return baseMessage;
  };

  const getDeepToneVariants = (tone: ToneType, context: string): string[] => {
    const deepVariants = {
      meditative: {
        score: [
          "Precision emerges from presence.",
          "The circle reflects the state of mind.",
          "In stillness, accuracy finds its home.",
        ],
        motivation: [
          "Today's practice shapes tomorrow's mastery.",
          "Each stroke is a meditation on control.",
        ],
        streak: [
          "Consistency becomes the teacher.",
          "Daily practice, daily transformation.",
        ],
      },
      sarcastic: {
        score: [
          "This one wasn't a circle. It was a cry for help.",
          "Congratulations, you've invented a new shape.",
          "That's what happens when geometry meets reality.",
        ],
        motivation: [
          "Ready to disappoint yourself again?",
          "Let's see what creative disasters await today.",
        ],
        streak: [
          "Look who's being all consistent. Show off.",
          "A streak? In this economy?",
        ],
      },
      playful: {
        score: [
          "That circle had serious style points!",
          "Your thumb is developing quite the personality!",
          "Now that's what I call circular perfection!",
        ],
        motivation: [
          "Time to show that circle who's boss!",
          "Ready to make some magic happen?",
        ],
        streak: [
          "Streak master! You're unstoppable!",
          "Consistency level: Epic!",
        ],
      },
      formal: {
        score: [
          "Geometric precision parameters exceeded.",
          "Motor control optimization in progress.",
          "Spatial accuracy metrics within target range.",
        ],
        motivation: [
          "Initiating precision calibration protocol.",
          "Neural pathway optimization commencing.",
        ],
        streak: [
          "Consistency metrics: Optimal performance.",
          "Routine adherence: Exemplary.",
        ],
      },
    };

    return deepVariants[tone]?.[context] || [];
  };

  const getBehaviorInsights = () => {
    if (!adaptiveSettings.behaviorInsightsEnabled) return [];

    const insights = [];
    const { scoreImprovement, modeUsage, toneCommitment, totalDrawings } = behaviorPattern;

    // Score improvement insight
    if (scoreImprovement.lastScores.length >= 3) {
      const improvement = scoreImprovement.lastScores[scoreImprovement.lastScores.length - 1] - 
                         scoreImprovement.lastScores[0];
      if (improvement > 10) {
        insights.push(`You've improved your average score by ${Math.round(improvement)}% recently.`);
      }
    }

    // Mode expertise insight
    const mostUsedMode = Object.entries(modeUsage.modeExperience)
      .sort(([,a], [,b]) => b - a)[0];
    if (mostUsedMode && mostUsedMode[1] > 5) {
      insights.push(`You show high proficiency in ${mostUsedMode[0]} mode.`);
    }

    // Tone commitment insight
    if (toneCommitment.toneSessions > 15) {
      insights.push(`Tone: ${toneCommitment.currentTone} (committed for ${toneCommitment.toneSessions} rounds)`);
    }

    // Advanced mode insight
    if (modeUsage.advancedModeCount > 10) {
      insights.push("Your drawing behavior shows high control under visual pressure.");
    }

    return insights;
  };

  const resetAdaptiveFeedback = () => {
    setBehaviorPattern({
      scoreImprovement: {
        consecutiveImprovements: 0,
        lastScores: [],
        hasRecentDrop: false,
      },
      streakConsistency: {
        currentStreak: 0,
        longestStreak: 0,
        consistentDays: 0,
      },
      modeUsage: {
        mostUsedMode: 'practice',
        advancedModeCount: 0,
        modeExperience: { practice: 0 },
      },
      toneCommitment: {
        currentTone: 'playful' as ToneType,
        toneSessions: 0,
        deepVariantsUnlocked: false,
      },
      totalDrawings: 0,
      milestoneProgress: [],
    });
    
    toast({
      title: "Adaptive Feedback Reset",
      description: "All behavior patterns and insights have been cleared.",
      duration: 3000,
    });
  };

  return {
    behaviorPattern,
    adaptiveSettings,
    setAdaptiveSettings,
    recordDrawing,
    getAdaptiveMessage,
    getBehaviorInsights,
    resetAdaptiveFeedback,
  };
};