import React from 'react';
import { motion } from 'framer-motion';
import { useModeUnlockSystem } from '@/hooks/useModeUnlockSystem';

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
      <button
        onClick={() => window.location.href = '/progress'}
        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-left hover:bg-slate-100 transition-colors duration-200"
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-slate-700">Your Progress</h4>
          <div className="text-slate-400">→</div>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-600">
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
            <div className="text-green-600">{getProgressNudge()}</div>
          )}
        </div>
      </button>
    </motion.div>
  );
};

export default ProgressPreviewWidget;