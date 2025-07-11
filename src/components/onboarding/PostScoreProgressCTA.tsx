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
}

const PostScoreProgressCTA: React.FC<PostScoreProgressCTAProps> = ({
  show,
  onDismiss,
  gameCount
}) => {
  const navigate = useNavigate();
  const { selectedTone } = useToneSystem();

  if (!show) return null;

  const getMessageForTone = () => {
    const messages = {
      playful: {
        title: "Want to see how you're improving? 🎯",
        description: "Your circles are getting tracked! Check out your progress."
      },
      calm: {
        title: "Your growth is being measured",
        description: "View your developing motor control and consistency patterns."
      },
      formal: {
        title: "Performance analytics available",
        description: "Access your spatial-motor skill development metrics."
      },
      sarcastic: {
        title: "Wow, you've drawn circles twice!",
        description: "I guess that's worth celebrating. Want to see your 'progress'?"
      }
    };
    
    return messages[selectedTone] || messages.playful;
  };

  const handleGoToProgress = () => {
    navigate('/progress');
    onDismiss();
  };

  const message = getMessageForTone();

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