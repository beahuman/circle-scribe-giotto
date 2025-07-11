import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDailyCalibration } from '@/hooks/useDailyCalibration';
import { useLocalProgress } from '@/hooks/useLocalProgress';
import { useSettings } from '@/hooks/useSettings';

const ShareProgress: React.FC = () => {
  const { settings } = useSettings();
  const { streak } = useDailyCalibration();
  const { stats } = useLocalProgress();

  const generateShareableCard = () => {
    const tone = settings.feedbackTone || 'meditative';
    let caption = "";
    
    switch (tone) {
      case 'playful':
        caption = `Day ${streak.current} – ${stats.lastAttempt}% – Circle power increasing! 🎯`;
        break;
      case 'sarcastic':
        caption = `Day ${streak.current} – ${stats.lastAttempt}% – My hand's smarter than your app. 😏`;
        break;
      case 'formal':
        caption = `Performance Log: Day ${streak.current}, Score ${stats.lastAttempt}%, Neural pathways optimizing.`;
        break;
      default:
        caption = `Day ${streak.current} streak. ${stats.lastAttempt}% precision. Come draw with me. 🧘‍♂️`;
    }
    
    return caption;
  };

  const handleShare = async () => {
    const shareText = generateShareableCard();
    const shareUrl = window.location.origin;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Giotto Progress",
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        // Add toast notification here if needed
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <Card className="bg-gradient-to-r from-primary/5 to-purple-400/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold text-slate-800 mb-2">Share Your Progress</h3>
          <p className="text-sm text-slate-600 mb-4">
            Show others your circle mastery journey
          </p>
          <Button 
            onClick={handleShare}
            className="w-full bg-gradient-to-r from-primary to-purple-400 hover:from-primary/90 hover:to-purple-400/90"
          >
            Share Progress Card
          </Button>
          <div className="mt-3 p-3 bg-white/50 rounded-lg text-caption">
            Preview: "{generateShareableCard()}"
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ShareProgress;