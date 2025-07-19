
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Rocket, Activity, Target, Sparkles, Crown, Palette } from 'lucide-react';
import WhyCirclesTabNavigation, { TabId } from './WhyCirclesTabNavigation';
import WhyCirclesTabContent from './WhyCirclesTabContent';
import WhyCirclesVisualDemo from './WhyCirclesVisualDemo';

interface WhyCirclesContentProps {
  onStartChallenge?: () => void;
}

const WhyCirclesContent: React.FC<WhyCirclesContentProps> = ({ onStartChallenge }) => {
  const [activeTab, setActiveTab] = useState<TabId>('brain');
  const [showFunFact, setShowFunFact] = useState(false);

  return (
    <div className="space-y-8">
      {/* Intro Section */}
      <div className="text-center space-y-6 py-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <motion.svg
              width="96"
              height="96"
              viewBox="0 0 96 96"
              className="absolute inset-0"
            >
              <motion.circle
                cx="48"
                cy="48"
                r="36"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
              />
            </motion.svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Target className="h-6 w-6 text-primary/50" />
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-4xl font-light text-foreground">Why Circles?</h1>
          <p className="text-xl text-foreground max-w-2xl mx-auto leading-relaxed">
            Drawing a perfect circle freehand is one of the hardest simple tasks for the human hand.
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            It's a beautiful intersection of art, science, and human potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mx-auto">
          <div className="bg-card/60 backdrop-blur-sm p-6 rounded-lg border border-border/50">
            <Brain className="h-8 w-8 text-info mb-3 mx-auto" />
            <h3 className="font-medium text-foreground mb-2">Neurological</h3>
            <p className="text-sm text-muted-foreground">Tests motor coordination and cerebellar function</p>
          </div>
          <div className="bg-card/60 backdrop-blur-sm p-6 rounded-lg border border-border/50">
            <Palette className="h-8 w-8 text-primary mb-3 mx-auto" />
            <h3 className="font-medium text-foreground mb-2">Artistic</h3>
            <p className="text-sm text-muted-foreground">A legendary test of artistic mastery</p>
          </div>
          <div className="bg-card/60 backdrop-blur-sm p-6 rounded-lg border border-border/50">
            <Sparkles className="h-8 w-8 text-success mb-3 mx-auto" />
            <h3 className="font-medium text-foreground mb-2">Personal</h3>
            <p className="text-sm text-muted-foreground">Builds focus, precision, and mindfulness</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation and Content */}
      <div className="space-y-6">
        <WhyCirclesTabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <AnimatePresence mode="wait">
          <WhyCirclesTabContent activeTab={activeTab} />
        </AnimatePresence>

        {/* Enhanced Visual Demo */}
        <div className="flex justify-center">
          <WhyCirclesVisualDemo activeTab={activeTab} />
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-4 p-6 bg-gradient-to-r from-primary/5 to-purple-400/5 rounded-lg border border-primary/10">
        <h3 className="text-xl font-medium text-foreground">Ready to Experience the Challenge?</h3>
        <p className="text-muted-foreground mb-4">
          Join the tradition. Draw your circle. Discover what Giotto knew.
        </p>
        {onStartChallenge && (
          <Button
            onClick={onStartChallenge}
            className="px-8 py-3 rounded-full"
          >
            Start Your Calibration
          </Button>
        )}
      </div>
    </div>
  );
};

export default WhyCirclesContent;
