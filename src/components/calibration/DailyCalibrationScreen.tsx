import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Flame, TrendingUp, Medal, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDailyCalibration } from '@/hooks/useDailyCalibration';
import CalibrationStreakDisplay from './CalibrationStreakDisplay';
import DailyCompletionAnimation from './DailyCompletionAnimation';
import CalibrationTrendGraph from './CalibrationTrendGraph';
import CalibrationMedal from './CalibrationMedal';
import CalibrationFeedbackToneSelector from './CalibrationFeedbackToneSelector';

interface DailyCalibrationScreenProps {
  onStartCalibration: () => void;
  onBack: () => void;
}

const DailyCalibrationScreen: React.FC<DailyCalibrationScreenProps> = ({
  onStartCalibration,
  onBack
}) => {
  const { 
    todaysCompletion, 
    streak, 
    weekHistory, 
    isLoading,
    canCalibrate 
  } = useDailyCalibration();
  
  const [showToneSelector, setShowToneSelector] = useState(false);
  const [lastScore, setLastScore] = React.useState<number | null>(null);

  const handleStart = () => {
    setLastScore(null); // Reset animation trigger
    onStartCalibration();
  };
  
  // Check if calibration was just completed
  React.useEffect(() => {
    if (todaysCompletion && lastScore === null) {
      setLastScore(todaysCompletion.accuracy);
    }
  }, [todaysCompletion, lastScore]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md mx-auto space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-purple-400 rounded-full flex items-center justify-center mb-4"
          >
            <Calendar className="h-8 w-8 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-light text-slate-800">Daily Calibration</h1>
          <p className="text-slate-600 font-light">
            A moment of mindful precision to center your motor control
          </p>
        </div>

        {/* Completion Status */}
        <AnimatePresence>
          {todaysCompletion ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">✨</div>
                  <h3 className="text-lg font-medium text-green-800 mb-2">
                    Today's Calibration Complete
                  </h3>
                  <p className="text-green-600 text-sm mb-4">
                    Your neural pathways have been refined for today
                  </p>
                  <CalibrationMedal score={todaysCompletion.accuracy} />
                </CardContent>
              </Card>
              
              <CalibrationStreakDisplay 
                streak={streak}
                isCompleted={true}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">🎯</div>
                  <h3 className="text-lg font-medium text-blue-800 mb-2">
                    Ready for Today's Calibration
                  </h3>
                  <p className="text-blue-600 text-sm">
                    Take a moment to center yourself and draw with intention
                  </p>
                </CardContent>
              </Card>
              
              <CalibrationStreakDisplay 
                streak={streak}
                isCompleted={false}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CalibrationTrendGraph weekHistory={weekHistory} />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          {canCalibrate && !todaysCompletion && (
            <Button
              onClick={handleStart}
              variant="premium"
              size="lg"
              className="w-full py-4 text-lg font-light"
            >
              Begin Today's Calibration
            </Button>
          )}
          
          <div className="flex gap-4">
            <Button
              onClick={() => setShowToneSelector(true)}
              variant="outline"
              className="flex-1 py-3 rounded-lg border-slate-200 hover:bg-slate-50"
            >
              <Settings2 className="h-4 w-4 mr-2" />
              Feedback Style
            </Button>
            
            <Button
              onClick={onBack}
              variant="outline"
              className="flex-1 py-3 rounded-lg border-slate-200 hover:bg-slate-50"
            >
              Back to Home
            </Button>
          </div>
        </motion.div>

        {/* Inspiration Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center p-4 bg-slate-100/50 rounded-lg"
        >
          <p className="text-description">
            "The hand follows the mind's intent, and the mind grows stronger through practice."
          </p>
        </motion.div>
      </motion.div>

      {/* Feedback Tone Selector Modal */}
      <CalibrationFeedbackToneSelector
        isOpen={showToneSelector}
        onClose={() => setShowToneSelector(false)}
      />
      
      {/* Daily Completion Animation */}
      {lastScore !== null && (
        <DailyCompletionAnimation 
          score={lastScore}
          onComplete={() => setLastScore(null)}
        />
      )}
    </div>
  );
};

export default DailyCalibrationScreen;