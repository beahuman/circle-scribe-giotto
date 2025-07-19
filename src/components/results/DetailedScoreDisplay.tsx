import React from 'react';
import { motion } from 'framer-motion';
import { GeometricSubscores } from '@/utils/scoring/geometricScoring';

interface DetailedScoreDisplayProps {
  subscores: GeometricSubscores;
  overallScore: number;
  className?: string;
}

const DetailedScoreDisplay: React.FC<DetailedScoreDisplayProps> = ({
  subscores,
  overallScore,
  className = ""
}) => {
  const scoreItems = [
    {
      label: "Symmetry",
      score: subscores.strokeDeviation,
      description: "How well your circle follows the perfect path",
      color: "text-info",
      bgColor: "bg-info/10"
    },
    {
      label: "Smoothness", 
      score: subscores.angularSmoothness,
      description: "How fluid and consistent your drawing motion is",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      label: "Closure",
      score: subscores.completionOffset,
      description: "How well you connected the start and end points",
      color: "text-primary", 
      bgColor: "bg-primary/10"
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Overall Score */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <div className="text-6xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
          {overallScore.toFixed(1)}%
        </div>
        <p className="text-muted-foreground">Overall Giotto Score</p>
      </motion.div>

      {/* Sub-scores */}
      <div className="space-y-3">
        {scoreItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
            className={`rounded-lg p-4 ${item.bgColor} border border-border/50`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{item.label}</span>
              <span className={`text-lg font-bold ${item.color}`}>
                {item.score.toFixed(1)}%
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.score}%` }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                className={`h-2 rounded-full ${item.color.replace('text-', 'bg-')}`}
              />
            </div>
            
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DetailedScoreDisplay;