import React from 'react';
import { motion } from 'framer-motion';

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
      <button
        onClick={onStartCalibration}
        className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 text-left shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 transform hover:scale-[1.02]"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-blue-800">Daily Calibration</h3>
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          </div>
        </div>
        <p className="text-sm text-blue-700 mb-2">One shot. Once a day.</p>
        {streak.current > 0 && (
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
              Day {streak.current} streak 🔥
            </div>
          </div>
        )}
        {todaysCompletion && (
          <p className="text-xs text-blue-600 mt-1">
            Today: {Math.round(todaysCompletion.accuracy)}% ✓
          </p>
        )}
      </button>
    </motion.div>
  );
};

export default DailyCalibrationCard;