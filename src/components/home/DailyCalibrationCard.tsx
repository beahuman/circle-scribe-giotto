
import React from 'react';
import { motion } from 'framer-motion';
import UnifiedCard from './UnifiedCard';

interface DailyCalibrationCardProps {
  onStartCalibration: () => void;
  streak: { current: number; longest: number };
  todaysCompletion: { accuracy: number } | null;
}

const fadeVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const DailyCalibrationCard: React.FC<DailyCalibrationCardProps> = ({
  onStartCalibration,
  streak,
  todaysCompletion
}) => {
  return (
    <motion.div variants={fadeVariants}>
      <UnifiedCard
        variant="primary"
        interactive
        onClick={onStartCalibration}
        className="shadow-sm hover:shadow-md transition-all duration-200"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-primary">Daily Calibration</h3>
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">One shot. Once a day.</p>
        
        <div className="space-y-2">
          {streak.current > 0 && (
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                Day {streak.current} streak 🔥
              </div>
            </div>
          )}
          
          {todaysCompletion && (
            <p className="text-xs text-primary/80">
              Today: {Math.round(todaysCompletion.accuracy)}% ✓
            </p>
          )}
        </div>
      </UnifiedCard>
    </motion.div>
  );
};

export default DailyCalibrationCard;
