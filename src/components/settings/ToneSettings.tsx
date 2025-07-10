import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Leaf, GraduationCap, Zap, BookOpen, Cloud, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ToneType, TONE_THEMES } from '@/utils/toneMessages';
import { useToneSystem } from '@/hooks/useToneSystem';

const TONE_CONFIG = [
  {
    id: 'meditative' as ToneType,
    icon: Leaf,
    title: 'Meditative',
    subtitle: 'Calm & Grounded',
    description: 'Peaceful, mindful feedback focused on growth and practice',
    example: "You moved with awareness.",
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    id: 'playful' as ToneType,
    icon: Heart,
    title: 'Playful',
    subtitle: 'Cheeky & Enthusiastic',
    description: 'Fun, upbeat feedback with emojis and positive energy',
    example: "That circle had serious style! 🎯",
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200'
  },
  {
    id: 'formal' as ToneType,
    icon: GraduationCap,
    title: 'Formal',
    subtitle: 'Clinical & Precise',
    description: 'Scientific, analytical feedback with technical terminology',
    example: "Symmetry score: Exceptional. Deviation: Minimal.",
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'sarcastic' as ToneType,
    icon: Zap,
    title: 'Sarcastic',
    subtitle: 'Brutally Honest',
    description: 'Witty, challenging feedback with a humorous edge',
    example: "Did you cheat? That was suspiciously perfect.",
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  {
    id: 'poetic' as ToneType,
    icon: BookOpen,
    title: 'Poetic',
    subtitle: 'Philosophical & Metaphorical',
    description: 'Artistic, thoughtful feedback with deeper meaning',
    example: "A near-circle, like a memory almost remembered.",
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    comingSoon: true
  },
  {
    id: 'existential' as ToneType,
    icon: Cloud,
    title: 'Existential',
    subtitle: 'Absurd & Introspective',
    description: 'Questioning reality with dry, philosophical humor',
    example: "Does perfection exist, or are we spiraling toward entropy?",
    color: 'from-gray-500 to-slate-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    comingSoon: true
  },
  {
    id: 'romantic' as ToneType,
    icon: Sparkles,
    title: 'Romantic',
    subtitle: 'Over-the-Top Adoration',
    description: 'Passionate, dramatic feedback with flowery language',
    example: "Your curve gave Cupid a cramp.",
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    comingSoon: true
  }
];

const ToneSettings: React.FC = () => {
  const {
    selectedTone,
    changeTone,
    isThemeUnlocked,
    getThemeProgress,
    getMostUsedTone,
    getTotalToneChanges
  } = useToneSystem();

  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const handleToneSelect = (toneId: ToneType, hasComingSoon?: boolean) => {
    if (hasComingSoon) return;
    
    if (toneId === 'sarcastic' && selectedTone !== 'sarcastic') {
      setShowDisclaimer(true);
    } else {
      changeTone(toneId);
    }
  };

  const confirmSarcasticTone = () => {
    changeTone('sarcastic');
    setShowDisclaimer(false);
  };

  const availableTones = TONE_CONFIG.filter(tone => !tone.comingSoon);
  const comingSoonTones = TONE_CONFIG.filter(tone => tone.comingSoon);
  const mostUsedTone = getMostUsedTone();
  const totalChanges = getTotalToneChanges();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Feedback Tone Selector</CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Choose how Giotto speaks to you throughout your practice
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Available Tones */}
          <div className="space-y-3">
            {availableTones.map((tone, index) => {
              const IconComponent = tone.icon;
              const isSelected = selectedTone === tone.id;
              const themeProgress = getThemeProgress(tone.id);
              const themeUnlocked = isThemeUnlocked(tone.id);
              
              return (
                <motion.button
                  key={tone.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleToneSelect(tone.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected 
                      ? `${tone.borderColor} ${tone.bgColor} shadow-md` 
                      : 'border-border bg-background hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${tone.color} text-white flex-shrink-0`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-sm">{tone.title}</h3>
                          <p className="text-xs text-muted-foreground">{tone.subtitle}</p>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-primary rounded-full"
                          />
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        {tone.description}
                      </p>
                      
                      <div className="mt-2 p-2 bg-muted/30 rounded text-xs italic">
                        "{tone.example}"
                      </div>

                      {/* Theme Progress */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Visual Theme Progress</span>
                          <div className="flex items-center gap-1">
                            {themeUnlocked && (
                              <Badge variant="secondary" className="text-xs">
                                {TONE_THEMES[tone.id].name} ✨
                              </Badge>
                            )}
                            <span className="text-muted-foreground">
                              {themeProgress.current}/{themeProgress.required}
                            </span>
                          </div>
                        </div>
                        <Progress value={themeProgress.percentage} className="h-1" />
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Coming Soon Tones */}
          {comingSoonTones.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Coming Soon</h4>
              <div className="space-y-2">
                {comingSoonTones.map((tone) => {
                  const IconComponent = tone.icon;
                  
                  return (
                    <div
                      key={tone.id}
                      className="w-full text-left p-3 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 opacity-60"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded bg-gradient-to-r ${tone.color} text-white opacity-60`}>
                          <IconComponent className="h-3 w-3" />
                        </div>
                        <div>
                          <h4 className="font-medium text-xs">{tone.title}</h4>
                          <p className="text-xs text-muted-foreground">{tone.subtitle}</p>
                        </div>
                        <Badge variant="outline" className="text-xs ml-auto">
                          Coming Soon
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stats */}
          {totalChanges > 0 && (
            <div className="mt-6 p-3 bg-muted/20 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Your Tone Stats</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Most Used:</span>
                  <span className="ml-1 font-medium capitalize">{mostUsedTone}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Sessions:</span>
                  <span className="ml-1 font-medium">{totalChanges}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sarcastic Disclaimer Modal */}
      {showDisclaimer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background p-6 rounded-lg max-w-sm w-full border border-orange-200"
          >
            <div className="text-center space-y-4">
              <Zap className="h-8 w-8 text-orange-500 mx-auto" />
              <h3 className="font-semibold">Entering the Roast Zone</h3>
              <p className="text-sm text-muted-foreground">
                This tone is brutally honest and may cause ego bruises. 
                Are you sure you can handle the heat?
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDisclaimer(false)}
                  className="flex-1"
                >
                  No, Keep Me Safe
                </Button>
                <Button
                  onClick={confirmSarcasticTone}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  Bring It On
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ToneSettings;