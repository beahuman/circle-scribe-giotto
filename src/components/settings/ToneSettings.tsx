import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Leaf, GraduationCap, Zap, BookOpen, Cloud, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ToneType, TONE_THEMES } from '@/utils/toneMessages';
import { useToneSystem } from '@/hooks/useToneSystem';
import TonePreview from './TonePreview';

const AVAILABLE_TONES: ToneType[] = ['calm', 'playful', 'formal', 'sarcastic'];
const COMING_SOON_TONES: ToneType[] = ['existential'];

const ToneSettings: React.FC = () => {
  const {
    selectedTone,
    changeTone,
    getMostUsedTone,
    getTotalToneChanges,
    toneUsage,
    toneLoyalty,
    toneMastery
  } = useToneSystem();

  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const handleToneSelect = (toneId: ToneType) => {
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

  const mostUsedTone = getMostUsedTone();
  const totalChanges = getTotalToneChanges();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="text-center space-y-4">
          <CardTitle>Feedback Tone Selector</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose how Giotto speaks to you throughout your practice
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Available Tones - Mobile First Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AVAILABLE_TONES.map((tone) => (
              <TonePreview
                key={tone}
                tone={tone}
                isSelected={selectedTone === tone}
                onSelect={() => handleToneSelect(tone)}
              />
            ))}
          </div>

          {/* Tone Variants (Unlocked through mastery) */}
          {AVAILABLE_TONES.some(tone => toneMastery.isToneVariantUnlocked(tone)) && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center gap-2">
                ✨ Tone Variants
                <Badge variant="outline" className="text-xs">Mastery Unlocked</Badge>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {AVAILABLE_TONES
                  .filter(tone => toneMastery.isToneVariantUnlocked(tone))
                  .map((baseTone) => {
                    const variant = toneMastery.getUnlockedToneVariant(baseTone);
                    if (!variant) return null;
                    return (
                      <TonePreview
                        key={variant}
                        tone={variant}
                        isSelected={selectedTone === variant}
                        onSelect={() => handleToneSelect(variant)}
                        isVariant={true}
                      />
                    );
                  })}
              </div>
            </div>
          )}

          {/* Advanced Tones (Legacy - if any still unlocked through loyalty) */}
          {(['poetic'] as const).some(tone => 
            toneLoyalty.isAdvancedToneUnlocked(tone)
          ) && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center gap-2">
                ✨ Advanced Tones
                <Badge variant="outline" className="text-xs">Loyalty Unlocked</Badge>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(['poetic'] as const)
                  .filter(tone => toneLoyalty.isAdvancedToneUnlocked(tone))
                  .map((tone) => (
                    <TonePreview
                      key={tone}
                      tone={tone}
                      isSelected={selectedTone === tone}
                      onSelect={() => handleToneSelect(tone)}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Coming Soon Tones */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Coming Soon</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {COMING_SOON_TONES.map((tone) => (
                <div
                  key={tone}
                  className="p-3 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 opacity-60"
                >
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-medium capitalize">{tone}</div>
                    <Badge variant="outline" className="text-xs ml-auto">
                      Coming Soon
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tone Mastery Overview */}
          {totalChanges > 0 && (
            <div className="p-6 bg-muted/20 rounded-lg space-y-4">
              <h4 className="text-sm font-medium">Tone Mastery Overview</h4>
              <div className="space-y-4">
                {AVAILABLE_TONES.map((tone) => {
                  const usage = toneUsage[tone];
                  const masteryLevel = usage >= 15 ? 2 : usage >= 5 ? 1 : 0;
                  return (
                    <div key={tone} className="flex items-center justify-between text-xs">
                      <span className="capitalize font-medium">{tone}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{usage} uses</span>
                        <Badge 
                          variant={masteryLevel === 2 ? "destructive" : masteryLevel === 1 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {masteryLevel === 0 ? "Locked" : `Level ${masteryLevel}`}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-muted-foreground/20">
                <div className="grid grid-cols-2 gap-4 text-xs">
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