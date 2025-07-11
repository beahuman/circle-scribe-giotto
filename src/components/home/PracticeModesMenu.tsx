import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, Target, Eye, Brain, Zap, Infinity } from 'lucide-react';
import { useModeUnlockSystem } from '@/hooks/useModeUnlockSystem';
import ModeUnlockModal from '@/components/modal/ModeUnlockModal';

interface PracticeModesMenuProps {
  onStartNormal: () => void;
  onStartBlindDraw: () => void;
  onStartOffset: () => void;
  onStartGauntlet: () => void;
  onStartInfinitePractice: () => void;
}

const PracticeModesMenu: React.FC<PracticeModesMenuProps> = ({
  onStartNormal,
  onStartBlindDraw,
  onStartOffset,
  onStartGauntlet,
  onStartInfinitePractice
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { 
    isUnlocked, 
    isNewlyUnlocked,
    pendingUnlock,
    getUnlockMessage,
    handleUnlockModalClose,
    handleTryNewMode,
    showAllModes,
    getAvailableModes
  } = useModeUnlockSystem();

  const modeHandlers = {
    'practice': onStartNormal,
    'infinite': onStartInfinitePractice,
    'blind-draw': onStartBlindDraw,
    'offset-mode': onStartOffset,
    'perception-gauntlet': onStartGauntlet
  };

  const modeIcons = {
    'practice': Target,
    'infinite': Infinity,
    'blind-draw': Eye,
    'spiral-mode': Zap,
    'offset-mode': Zap,
    'perception-gauntlet': Brain
  };

  const modeColors = {
    'practice': { color: "text-blue-600", bgColor: "bg-blue-50" },
    'infinite': { color: "text-green-600", bgColor: "bg-green-50" },
    'blind-draw': { color: "text-purple-600", bgColor: "bg-purple-50" },
    'spiral-mode': { color: "text-indigo-600", bgColor: "bg-indigo-50" },
    'offset-mode': { color: "text-orange-600", bgColor: "bg-orange-50" },
    'perception-gauntlet': { color: "text-red-600", bgColor: "bg-red-50" }
  };

  const availableModes = getAvailableModes().filter(mode => mode.available || showAllModes);

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
            {availableModes.map((mode, index) => {
              const Icon = modeIcons[mode.id as keyof typeof modeIcons] || Target;
              const colors = modeColors[mode.id as keyof typeof modeColors] || modeColors.practice;
              const handler = modeHandlers[mode.id as keyof typeof modeHandlers];
              const isSpecial = mode.id === 'infinite';
              const isNew = isNewlyUnlocked(mode.id);
              
              return (
                <motion.div
                  key={mode.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className={`${colors.bgColor} border-l-4 ${
                      mode.available ? 'cursor-pointer hover:shadow-md' : 'opacity-60'
                    } ${isSpecial ? 'ring-1 ring-green-200' : ''} ${
                      isNew ? 'ring-2 ring-primary/30 shadow-lg' : ''
                    } transition-all duration-200`}
                    style={{ borderLeftColor: mode.available ? undefined : '#cbd5e1' }}
                    onClick={mode.available && handler ? handler : undefined}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${mode.available ? colors.bgColor : 'bg-slate-100'}`}>
                          <Icon className={`w-4 h-4 ${mode.available ? colors.color : 'text-slate-400'}`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{mode.name}</h4>
                            {!mode.available && showAllModes && (
                              <Badge variant="secondary" className="text-xs">🔒</Badge>
                            )}
                            {isSpecial && (
                              <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">✨ Zen</Badge>
                            )}
                            {isNew && (
                              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                                ✨ New!
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {mode.id === 'practice' ? 'Standard circle drawing with full visual feedback' :
                             mode.id === 'infinite' ? 'Draw freely without scores or time limits - pure flow state' :
                             mode.id === 'blind-draw' ? 'Draw without seeing your stroke - pure memory training' :
                             mode.id === 'spiral-mode' ? 'Follow the winding path of the spiral' :
                             mode.id === 'offset-mode' ? 'Reference circle placed off-center - tests perception alignment' :
                             mode.id === 'perception-gauntlet' ? 'Ultimate challenge: off-center AND hidden reference circle' :
                             'Advanced gameplay mode'}
                          </p>
                          {!mode.available && showAllModes && (mode as any).unlockCondition && (
                            <p className="text-xs text-orange-600 mt-1 font-medium">
                              {(mode as any).unlockCondition}
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

      {/* Mode Unlock Modal */}
      <ModeUnlockModal
        isOpen={!!pendingUnlock}
        trigger={pendingUnlock}
        onTryNow={handleTryNewMode}
        onMaybeLater={handleUnlockModalClose}
      />
    </div>
  );
};

export default PracticeModesMenu;