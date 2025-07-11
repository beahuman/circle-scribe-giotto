
import React from 'react';
import { useToneSystem } from '@/hooks/useToneSystem';
import { useAdaptiveFeedback } from '@/hooks/useAdaptiveFeedback';

interface FeedbackMessageProps {
  accuracy: number;
  isPenaltyMode?: boolean;
  hasImproved?: boolean;
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({
  accuracy,
  isPenaltyMode = false,
  hasImproved = false
}) => {
  const { getScoreMessageForTone } = useToneSystem();
  const { getAdaptiveMessage, adaptiveSettings } = useAdaptiveFeedback();
  // Enhanced snarky feedback messages based on accuracy score
  const getFeedbackMessage = (score: number, isPenalty = false, improved = false) => {
    // Neural reinforcement: Add positive reinforcement for improvement
    if (improved && score >= 50) {
      const improvementMessages = [
        "You're getting better! Those neurons are forming new connections.",
        "Nice improvement! Your brain is learning the pattern.",
        "Your motor cortex is definitely getting the hang of this!",
        "That's how muscle memory forms. Keep it up!",
        "Progress! Your cerebellum is adapting nicely."
      ];
      return improvementMessages[Math.floor(Math.random() * improvementMessages.length)];
    }
    
    // Penalty mode has special extra sarcastic messages
    if (isPenalty) {
      const penaltyMessages = [
        "Is your screen upside down? Just checking.",
        "Did your pet take over the drawing? It might explain a lot.",
        "Looks like someone needs to go back to kindergarten!",
        "Are you drawing with your eyes closed as a personal challenge?",
        "If this was a test, you'd be repeating the grade.",
        "Maybe circles just aren't your thing. Have you tried squares?",
        "I've seen better circles drawn by people without opposable thumbs.",
        "Drawing circles: still harder than rocket science, apparently."
      ];
      return penaltyMessages[Math.floor(Math.random() * penaltyMessages.length)];
    }
    
    if (score >= 95) return "Wow, did you use a compass? That's cheating! Or maybe you're secretly Giotto himself?";
    if (score >= 90) return "Almost suspiciously perfect. Did you trace it with your nose pressed against the screen?";
    if (score >= 85) return "Not bad! Giotto is still laughing, but not as hard as before.";
    if (score >= 75) return "Your art teacher called. She wants her 'participation trophy' back.";
    if (score >= 65) return "My toddler cousin drew a better circle with their eyes closed. During an earthquake.";
    if (score >= 50) return "Did you draw that with your eyes closed? Or maybe your elbow?";
    if (score >= 30) return "Are you sure that was supposed to be a circle? Looks more like a cat sat on your phone.";
    if (score >= 10) return "That's so misshapen, it could qualify as modern art. Quick, sell it for millions!";
    
    return "That's more of a potato than a circle! Did you even try?";
  };

  // Use tone system for primary messages, fallback to penalty mode for special cases
  const baseMessage = isPenaltyMode ? getFeedbackMessage(accuracy, isPenaltyMode, hasImproved) : getScoreMessageForTone(accuracy);
  const message = adaptiveSettings.enabled ? getAdaptiveMessage(baseMessage, 'score') : baseMessage;

  // Apply different styling based on score and improvement
  const getMessageStyle = () => {
    if (hasImproved && accuracy >= 50) {
      return "text-green-500 font-medium animate-fade-in";
    }
    if (accuracy >= 80) {
      return "text-primary";
    }
    if (accuracy < 30) {
      return "text-orange-500";
    }
    return "text-muted-foreground";
  };

  return (
    <p className={`max-w-xs mx-auto px-3 ${getMessageStyle()}`}>
      {message}
    </p>
  );
};

export default FeedbackMessage;
