import React from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, Medal } from 'lucide-react';

interface CalibrationMedalProps {
  score: number;
}

const CalibrationMedal: React.FC<CalibrationMedalProps> = ({ score }) => {
  const getMedalData = (score: number) => {
    if (score >= 90) {
      return {
        type: 'gold',
        icon: Trophy,
        color: 'from-yellow-400 to-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        message: 'Exceptional Precision',
        description: 'Masters level motor control'
      };
    } else if (score >= 75) {
      return {
        type: 'silver',
        icon: Medal,
        color: 'from-slate-400 to-slate-600',
        bgColor: 'bg-slate-50',
        borderColor: 'border-slate-200',
        message: 'High Precision',
        description: 'Advanced motor coordination'
      };
    } else if (score >= 60) {
      return {
        type: 'bronze',
        icon: Award,
        color: 'from-amber-600 to-amber-800',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        message: 'Good Precision',
        description: 'Solid neural foundation'
      };
    }
    
    return {
      type: 'none',
      icon: Award,
      color: 'from-slate-300 to-slate-500',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      message: 'Practice Complete',
      description: 'Every attempt strengthens your pathways'
    };
  };

  const medalData = getMedalData(score);
  const IconComponent = medalData.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className={`inline-flex items-center gap-4 px-4 py-3 rounded-lg ${medalData.bgColor} ${medalData.borderColor} border`}
    >
      <div className={`p-2 rounded-lg bg-gradient-to-r ${medalData.color} shadow-sm`}>
        <IconComponent className="h-5 w-5 text-white" />
      </div>
      
      <div className="text-left">
        <div className="font-medium text-slate-800 text-sm">
          {medalData.message}
        </div>
        <div className="text-xs text-slate-600">
          {medalData.description}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          Score: {score.toFixed(1)}%
        </div>
      </div>
    </motion.div>
  );
};

export default CalibrationMedal;