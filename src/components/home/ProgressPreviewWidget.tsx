
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useModeUnlockSystem } from '@/hooks/useModeUnlockSystem';
import UnifiedCard from './UnifiedCard';

interface ProgressPreviewWidgetProps {
  todaysCompletion: { accuracy: number } | null;
}

const fadeVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const ProgressPreviewWidget: React.FC<ProgressPreviewWidgetProps> = ({ todaysCompletion }) => {
  const { getProgressNudge } = useModeUnlockSystem();

  return (
    <motion.div 
      variants={fadeVariants}
      transition={{ delay: 0.3 }}
    >
      <UnifiedCard
        variant="secondary"
        interactive
        onClick={() => window.location.href = '/progress'}
        className="hover:shadow-sm transition-all duration-200"
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-foreground">Your Progress</h4>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {todaysCompletion && (
            <div className="flex items-center gap-1">
              <span>Yesterday:</span>
              <span className="text-lg">
                {todaysCompletion.accuracy >= 90 ? '🥇' : 
                 todaysCompletion.accuracy >= 80 ? '🥈' : 
                 todaysCompletion.accuracy >= 70 ? '🥉' : '⚪'}
              </span>
            </div>
          )}
          
          {getProgressNudge() && (
            <div className="text-primary font-medium">{getProgressNudge()}</div>
          )}
        </div>
      </UnifiedCard>
    </motion.div>
  );
};

export default ProgressPreviewWidget;
