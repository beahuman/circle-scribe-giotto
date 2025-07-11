import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdaptiveFeedback } from '@/hooks/useAdaptiveFeedback';

const BehaviorInsights: React.FC = () => {
  const { getBehaviorInsights, behaviorPattern, adaptiveSettings } = useAdaptiveFeedback();
  
  if (!adaptiveSettings.behaviorInsightsEnabled) return null;
  
  const insights = getBehaviorInsights();
  
  if (insights.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-br from-primary/5 to-purple-400/5 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-primary" />
            Behavior Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-white/50 border border-primary/10"
            >
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-slate-700 leading-relaxed">{insight}</p>
            </motion.div>
          ))}
          
          {/* Progress Indicators */}
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-primary/10">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-slate-600">Total Drawings</span>
              </div>
              <span className="text-lg font-bold text-primary">{behaviorPattern.totalDrawings}</span>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-slate-600">Tone Sessions</span>
              </div>
              <span className="text-lg font-bold text-primary">{behaviorPattern.toneCommitment.toneSessions}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BehaviorInsights;