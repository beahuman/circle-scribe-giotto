import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Clock, Info, ArrowLeft, Plus, Gift } from 'lucide-react';
import CircleDisplay from './CircleDisplay';
import DrawingCanvas from './DrawingCanvas';
import ResultScreen from './ResultScreen';
import AdRewardButton from './ads/AdRewardButton';
import { useSubscription } from '@/hooks/useSubscription';
import { useRewardedAds } from '@/hooks/useRewardedAds';

interface DailyCalibrationScreenProps {
  calibration: {
    id: string;
    targetSize: number;
    requiredAttempts: number;
    timeLimit?: number;
  };
  onComplete: (averageScore: number) => void;
  onExit: () => void;
}

const DailyCalibrationScreen: React.FC<DailyCalibrationScreenProps> = ({ 
  calibration, 
  onComplete, 
  onExit 
}) => {
  const { isPremium } = useSubscription();
  const { canWatchAd } = useRewardedAds();
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [allScores, setAllScores] = useState<number[]>([]);
  const [hasUsedExtraAttempt, setHasUsedExtraAttempt] = useState(false);
  
  const maxAttempts = calibration.requiredAttempts + (hasUsedExtraAttempt ? 1 : 0);
  const isCompleted = currentAttempt >= calibration.requiredAttempts;
  const hasExtraAttempts = currentAttempt < maxAttempts;

  const handleDrawingStart = useCallback(() => {
    setIsDrawing(true);
  }, []);

  const handleDrawingComplete = useCallback((score: number) => {
    setLastScore(score);
    setAllScores(prev => [...prev, score]);
    setCurrentAttempt(prev => prev + 1);
    setIsDrawing(false);
    setShowResult(true);
  }, []);

  const handleResultContinue = useCallback(() => {
    setShowResult(false);
    
    if (currentAttempt >= maxAttempts) {
      const finalAverage = allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
      onComplete(finalAverage);
    }
  }, [currentAttempt, maxAttempts, allScores, onComplete]);

  const handleExtraAttemptUnlocked = useCallback(() => {
    setHasUsedExtraAttempt(true);
  }, []);

  if (showResult && lastScore !== null) {
    return (
      <ResultScreen
        score={lastScore}
        targetScore={75}
        onContinue={handleResultContinue}
        onRetry={() => {
          setShowResult(false);
          setIsDrawing(false);
        }}
        showNextButton={true}
        isDailyMode={true}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container max-w-md mx-auto p-4 min-h-screen"
    >
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <Button variant="ghost" onClick={onExit} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            
            <Badge variant="secondary">
              Attempt {Math.min(currentAttempt + 1, maxAttempts)} of {maxAttempts}
            </Badge>
          </div>
          
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Daily Calibration
          </CardTitle>
          
          <div>
            <Progress 
              value={(currentAttempt / maxAttempts) * 100} 
              className="h-2 mb-2" 
            />
            <p className="text-sm text-muted-foreground">
              Complete {calibration.requiredAttempts} attempts for daily calibration
              {hasExtraAttempts && currentAttempt >= calibration.requiredAttempts && 
                " • Extra attempt available!"
              }
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {currentAttempt < maxAttempts ? (
              <div className="space-y-4">
                <CircleDisplay 
                  targetSize={calibration.targetSize}
                  showGuides={false}
                />
                
                <DrawingCanvas
                  onDrawingStart={handleDrawingStart}
                  onDrawingComplete={handleDrawingComplete}
                  targetSize={calibration.targetSize}
                  disabled={isDrawing}
                />

                {/* Extra Attempt Offer */}
                {isCompleted && !hasUsedExtraAttempt && !isPremium && canWatchAd && (
                  <Card className="border-dashed border-blue-500/30 bg-gradient-to-r from-blue-500/5 to-blue-500/10">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Plus className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">Want one more try?</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Get an extra calibration attempt to improve your average
                      </p>
                      <div onClick={handleExtraAttemptUnlocked}>
                        <AdRewardButton 
                          type="calibration"
                          size="sm"
                          className="w-full"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto">
                  <Trophy className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Calibration Complete!</h3>
                  <p className="text-muted-foreground">
                    Average Score: {Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length)}%
                  </p>
                </div>

                <Button onClick={() => {
                  const finalAverage = allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
                  onComplete(finalAverage);
                }}>
                  Complete Calibration
                </Button>
              </div>
            )}

            {/* Instructions */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span>Draw circles as accurately as possible</span>
              </div>
              {calibration.timeLimit && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Time limit: {calibration.timeLimit}s per circle</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DailyCalibrationScreen;