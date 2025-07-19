
import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Brush, MessageSquare, TrendingUp, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useVisualFavorites } from '@/hooks/useVisualFavorites';
import { useToneSystem } from '@/hooks/useToneSystem';
import { useBrushSystem } from '@/hooks/useBrushSystem';

const StyleInsightsPanel: React.FC = () => {
  const { getStyleInsights } = useVisualFavorites();
  const { getMostUsedTone, toneUsage } = useToneSystem();
  const { getSelectedBrush } = useBrushSystem();
  
  const insights = getStyleInsights();
  const mostUsedTone = getMostUsedTone();
  const selectedBrush = getSelectedBrush();

  const getTrendDirection = () => {
    // Mock trend data - in real app this would come from usage analytics
    const trends = [
      'More formal this week',
      'Exploring new brushes',
      'Consistent tone choice',
      'Varied practice modes'
    ];
    return trends[Math.floor(Math.random() * trends.length)];
  };

  const getUsageStreak = () => {
    // Mock streak data
    return Math.floor(Math.random() * 5) + 1;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-primary/5 to-purple-400/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Eye className="h-5 w-5 text-primary" />
            Your Style Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Most Used Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Most Used Brush */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
              <div className="flex-shrink-0">
                <Brush className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-muted-foreground">Favorite Brush</div>
                <div className="font-semibold truncate">{insights.mostUsedBrush}</div>
              </div>
              <div className="w-6 h-2 bg-primary rounded opacity-60" />
            </div>

            {/* Most Used Theme */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
              <div className="flex-shrink-0">
                <Palette className="h-4 w-4 text-purple-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-muted-foreground">Favorite Theme</div>
                <div className="font-semibold truncate">{insights.mostUsedTheme}</div>
              </div>
              <div className="w-4 h-4 bg-gradient-to-br from-primary to-purple-400 rounded" />
            </div>

            {/* Most Used Tone */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
              <div className="flex-shrink-0">
                <MessageSquare className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-muted-foreground">Preferred Tone</div>
                <div className="font-semibold truncate">{mostUsedTone}</div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {getUsageStreak()}d
              </Badge>
            </div>

            {/* Active Streak */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
              <div className="flex-shrink-0">
                <TrendingUp className="h-4 w-4 text-orange-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-muted-foreground">Current Trend</div>
                <div className="font-semibold text-sm">{getTrendDirection()}</div>
              </div>
              <div className="text-xs text-muted-foreground">↑</div>
            </div>
          </div>

          {/* Style Streak Insight */}
          <div className="p-4 rounded-lg bg-background/30 border border-primary/20">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Visual Consistency
                </div>
                <p className="text-sm leading-relaxed">
                  {insights.longestStreak}
                </p>
              </div>
            </div>
          </div>

          {/* Common Combo */}
          <div className="text-center p-3 rounded-lg bg-gradient-to-r from-primary/10 to-purple-400/10">
            <div className="text-xs text-muted-foreground mb-1">Your Signature Style</div>
            <div className="text-sm font-medium">
              {insights.commonCombo}
            </div>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StyleInsightsPanel;
