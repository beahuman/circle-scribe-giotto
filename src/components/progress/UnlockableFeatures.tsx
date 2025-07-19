import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDailyCalibration } from '@/hooks/useDailyCalibration';

const UnlockableFeatures: React.FC = () => {
  const { streak } = useDailyCalibration();

  const getUnlockableFeatures = () => {
    const currentStreak = streak.current;
    const features = [
      { 
        name: "New Brush Style", 
        requirement: 3, 
        unlocked: currentStreak >= 3,
        description: "Unlock elegant brush textures"
      },
      { 
        name: "Blind Draw Mode", 
        requirement: 7, 
        unlocked: currentStreak >= 7,
        description: "Challenge yourself without visual guides"
      },
      { 
        name: "Alternate Themes", 
        requirement: 14, 
        unlocked: currentStreak >= 14,
        description: "Beautiful new color palettes"
      }
    ];
    return features;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="h-5 w-5" />
            Unlockable Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {getUnlockableFeatures().map((feature) => (
            <motion.div
              key={feature.name}
              whileHover={feature.unlocked ? { scale: 1.02 } : {}}
              className={`p-4 rounded-lg border transition-all ${
                feature.unlocked 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className={`font-medium ${feature.unlocked ? 'text-green-700' : 'text-slate-600'}`}>
                    {feature.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{feature.description}</div>
                  {!feature.unlocked && (
                    <div className="text-xs text-orange-600 mt-1">
                      {feature.requirement - streak.current} more streak days to unlock
                    </div>
                  )}
                </div>
                {feature.unlocked ? (
                  <div className="text-green-500 text-xl">✓</div>
                ) : (
                  <Lock className="h-4 w-4 text-slate-400" />
                )}
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UnlockableFeatures;