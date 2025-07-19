import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Award, 
  BarChart3,
  Crown,
  Clock,
  Zap
} from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import PremiumModal from "@/components/subscription/PremiumModal";

interface PremiumAnalyticsProps {
  userStats?: {
    averageScore: number;
    totalSessions: number;
    improvementRate: number;
    bestStreak: number;
    consistencyScore: number;
    accuracyTrend: number[];
    speedTrend: number[];
    focusTimeData: { week: string; minutes: number }[];
  };
}

const PremiumAnalytics: React.FC<PremiumAnalyticsProps> = ({ userStats }) => {
  const { isPremium } = useSubscription();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Mock data for demonstration when no real stats are provided
  const mockStats = {
    averageScore: 78.5,
    totalSessions: 156,
    improvementRate: 12.4,
    bestStreak: 15,
    consistencyScore: 85,
    accuracyTrend: [72, 75, 78, 80, 78.5],
    speedTrend: [2.1, 2.3, 2.2, 2.4, 2.5],
    focusTimeData: [
      { week: 'Week 1', minutes: 45 },
      { week: 'Week 2', minutes: 52 },
      { week: 'Week 3', minutes: 48 },
      { week: 'Week 4', minutes: 67 },
    ]
  };

  const stats = userStats || mockStats;

  if (!isPremium) {
    return (
      <>
        <Card className="border-dashed border-primary/30 bg-gradient-to-r from-primary/5 to-purple-400/5">
          <CardContent className="p-6 text-center">
            <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Premium Analytics</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Unlock detailed insights into your drawing performance, improvement trends, and personalized recommendations.
            </p>
            <Button onClick={() => setShowPremiumModal(true)}>
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>

        <PremiumModal 
          open={showPremiumModal} 
          onOpenChange={setShowPremiumModal} 
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Crown className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Premium Analytics</h2>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          Premium
        </Badge>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Avg Score</span>
            </div>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">+{stats.improvementRate}% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Sessions</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">Total completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Best Streak</span>
            </div>
            <div className="text-2xl font-bold">{stats.bestStreak}</div>
            <p className="text-xs text-muted-foreground">days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Consistency</span>
            </div>
            <div className="text-2xl font-bold">{stats.consistencyScore}%</div>
            <p className="text-xs text-muted-foreground">Practice regularity</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              Accuracy Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.accuracyTrend.map((score, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-16">Week {index + 1}</span>
                  <Progress value={score} className="flex-1" />
                  <span className="text-sm text-muted-foreground w-12">{score}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Focus Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4" />
              Weekly Focus Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.focusTimeData.map((data, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-16">{data.week}</span>
                  <Progress value={(data.minutes / 80) * 100} className="flex-1" />
                  <span className="text-sm text-muted-foreground w-12">{data.minutes}min</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personalized Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Improving Accuracy
                </p>
                <p className="text-xs text-green-600 dark:text-green-300">
                  Your accuracy has improved by {stats.improvementRate}% this month. Keep practicing consistently!
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Consistency Goal
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-300">
                  Try to practice 5 minutes daily to improve your consistency score to 90%+
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumAnalytics;