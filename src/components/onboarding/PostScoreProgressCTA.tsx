import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToneSystem } from '@/hooks/useToneSystem';

interface PostScoreProgressCTAProps {
  show: boolean;
  onDismiss: () => void;
  gameCount: number;
  milestoneType?: 'new_best' | 'score_improvement' | 'streak_broken' | 'unlock_milestone' | null;
}

const PostScoreProgressCTA: React.FC<PostScoreProgressCTAProps> = ({
  show,
  onDismiss,
  gameCount,
  milestoneType
}) => {
  const navigate = useNavigate();
  const { selectedTone } = useToneSystem();

  if (!show) return null;

  const getMilestoneMessageForTone = () => {
    if (!milestoneType) {
      // First-time progress nudge messages (after 2nd/3rd draw)
      const messages = {
        playful: {
          title: "Let's see what you've made so far!",
          description: "You've been drawing... but have you been *growing*?"
        },
        calm: {
          title: "Every motion leaves a mark. Let's reflect.",
          description: "Observe the journey — not just the score."
        },
        formal: {
          title: "A summary of your performance is available.",
          description: "Review your drawing history to assess trends."
        },
        sarcastic: {
          title: "Sure, you've drawn a few. Want receipts?",
          description: "Let's see if you're actually improving."
        }
      };
      return messages[selectedTone] || messages.playful;
    }

    // Milestone-specific Giotto messages
    const milestoneMessages = {
      new_best: {
        playful: {
          title: "New high score! Wanna see how far you've come? 🌟",
          description: "Giotto whispers: \"That was beautiful. Your journey deserves recognition.\""
        },
        calm: {
          title: "Progress isn't linear. But it is visible.",
          description: "A new benchmark reached. Observe your steady ascent toward precision."
        },
        formal: {
          title: "A new benchmark has been set.",
          description: "View performance metrics to analyze your skill development trajectory."
        },
        sarcastic: {
          title: "Well, well. Someone's showing off.",
          description: "Fine, let's take a look at this 'achievement' of yours."
        }
      },
      score_improvement: {
        playful: {
          title: "Getting better and better! ✨",
          description: "Each circle brings you closer to mastery. Want to see the pattern?"
        },
        calm: {
          title: "Your path bends toward precision.",
          description: "Small improvements compound. Witness your gradual refinement."
        },
        formal: {
          title: "Performance improvement detected.",
          description: "Review your enhancement metrics and trend analysis."
        },
        sarcastic: {
          title: "Oh, you're actually learning? Shocking.",
          description: "I suppose we should document this rare moment of progress."
        }
      },
      streak_broken: {
        playful: {
          title: "Streak smashed — let's take a peek. 💫",
          description: "Even Giotto had off days. See how you bounce back from setbacks."
        },
        calm: {
          title: "Patterns shift. Growth continues.",
          description: "Today's struggle becomes tomorrow's strength. Observe the bigger picture."
        },
        formal: {
          title: "Streak broken. Review your trend curve.",
          description: "Analyze performance variations to identify optimization opportunities."
        },
        sarcastic: {
          title: "Well, that went sideways. Let's check the damage.",
          description: "Hey, at least your history looks better than today's attempt."
        }
      }
    };

    return milestoneMessages[milestoneType]?.[selectedTone] || milestoneMessages[milestoneType]?.playful;
  };

  const handleGoToProgress = () => {
    navigate('/progress');
    onDismiss();
  };

  const message = getMilestoneMessageForTone();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mt-4 relative"
    >
      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/50 transition-colors"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>

      <div className="flex items-start gap-3 pr-8">
        {/* Icon with gentle animation */}
        <motion.div
          animate={{
            y: [0, -2, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mt-1"
        >
          <TrendingUp className="h-5 w-5 text-purple-600" />
        </motion.div>

        <div className="flex-1 space-y-3">
          <div>
            <h4 className="font-medium text-purple-900">{message.title}</h4>
            <p className="text-sm text-purple-700 mt-1">{message.description}</p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleGoToProgress}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              View Progress
            </Button>
            <Button
              onClick={onDismiss}
              variant="outline"
              size="sm"
              className="text-purple-600 border-purple-300 hover:bg-purple-50"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </div>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-purple-100 via-transparent to-blue-100 rounded-lg" />
      </div>
    </motion.div>
  );
};

export default PostScoreProgressCTA;