import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, Target, Eye, Brain, Zap } from 'lucide-react';
import { useBlindDrawMode } from '@/hooks/useBlindDrawMode';
import { useOffsetMode } from '@/hooks/useOffsetMode';
import { usePerceptionGauntlet } from '@/hooks/usePerceptionGauntlet';

interface PracticeModesMenuProps {
  onStartNormal: () => void;
  onStartBlindDraw: () => void;
  onStartOffset: () => void;
  onStartGauntlet: () => void;
}

const PracticeModesMenu: React.FC<PracticeModesMenuProps> = ({
  onStartNormal,
  onStartBlindDraw,
  onStartOffset,
  onStartGauntlet
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isUnlocked: blindUnlocked } = useBlindDrawMode();
  const { isUnlocked: offsetUnlocked } = useOffsetMode();
  const { isUnlocked: gauntletUnlocked } = usePerceptionGauntlet();

  const modes = [
    {
      name: "Free Draw Practice",
      description: "Standard circle drawing with full visual feedback",
      icon: Target,
      unlocked: true,
      onClick: onStartNormal,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      name: "Blind Draw Mode",
      description: "Draw without seeing your stroke - pure memory training",
      icon: Eye,
      unlocked: blindUnlocked,
      onClick: onStartBlindDraw,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      unlockCondition: "7-day streak required"
    },
    {
      name: "Offset Mode",
      description: "Reference circle placed off-center - tests perception alignment",
      icon: Zap,
      unlocked: offsetUnlocked,
      onClick: onStartOffset,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      unlockCondition: "3 Spiral Mode completions with 80%+"
    },
    {
      name: "Perception Gauntlet",
      description: "Ultimate challenge: off-center AND hidden reference circle",
      icon: Brain,
      unlocked: gauntletUnlocked,
      onClick: onStartGauntlet,
      color: "text-red-600",
      bgColor: "bg-red-50",
      unlockCondition: "5 Blind Draw + 5 Offset completions"
    }
  ];

  return (
    <div className="space-y-2">
      <Button
        onClick={isExpanded ? onStartNormal : () => setIsExpanded(true)}
        className="w-full bg-white border border-slate-200 rounded-xl p-6 text-left shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 transform hover:scale-[1.02]"
        variant="outline"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Practice Mode</h3>
            <p className="text-sm text-slate-600">
              {isExpanded ? "Choose your challenge level" : "Tap to start or explore modes"}
            </p>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </Button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3 overflow-hidden"
          >
            {modes.map((mode, index) => {
              const Icon = mode.icon;
              
              return (
                <motion.div
                  key={mode.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className={`${mode.bgColor} border-l-4 ${
                      mode.unlocked ? 'cursor-pointer hover:shadow-md' : 'opacity-60'
                    } transition-all duration-200`}
                    style={{ borderLeftColor: mode.unlocked ? undefined : '#cbd5e1' }}
                    onClick={mode.unlocked ? mode.onClick : undefined}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${mode.unlocked ? mode.bgColor : 'bg-slate-100'}`}>
                          <Icon className={`w-4 h-4 ${mode.unlocked ? mode.color : 'text-slate-400'}`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{mode.name}</h4>
                            {!mode.unlocked && (
                              <Badge variant="secondary" className="text-xs">🔒</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{mode.description}</p>
                          {!mode.unlocked && mode.unlockCondition && (
                            <p className="text-xs text-orange-600 mt-1 font-medium">
                              {mode.unlockCondition}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center pt-2"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                Collapse Menu
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PracticeModesMenu;