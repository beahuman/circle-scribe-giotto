import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calendar } from 'lucide-react';
import { DailyCompletion } from '@/hooks/useDailyChallenges';

interface ProgressComparisonProps {
  completions: DailyCompletion[];
}

const ProgressComparison: React.FC<ProgressComparisonProps> = ({ completions }) => {
  // Calculate weekly and monthly averages
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const thisWeek = completions.filter(c => new Date(c.challenge_date) >= weekAgo);
  const lastWeek = completions.filter(c => {
    const date = new Date(c.challenge_date);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    return date >= twoWeeksAgo && date < weekAgo;
  });

  const thisMonth = completions.filter(c => new Date(c.challenge_date) >= monthAgo);
  const lastMonth = completions.filter(c => {
    const date = new Date(c.challenge_date);
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    return date >= twoMonthsAgo && date < monthAgo;
  });

  const getAverage = (data: DailyCompletion[]) => 
    data.length > 0 ? Math.round(data.reduce((sum, c) => sum + c.score, 0) / data.length) : 0;

  const comparisonData = [
    {
      period: 'This Week',
      score: getAverage(thisWeek),
      count: thisWeek.length
    },
    {
      period: 'Last Week', 
      score: getAverage(lastWeek),
      count: lastWeek.length
    },
    {
      period: 'This Month',
      score: getAverage(thisMonth),
      count: thisMonth.length
    },
    {
      period: 'Last Month',
      score: getAverage(lastMonth),
      count: lastMonth.length
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Progress Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="period" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 100]}
                className="text-xs"
                tick={{ fontSize: 12 }}
                label={{ value: 'Avg Score (%)', angle: -90, position: 'insideLeft' }}
              />
              <Bar
                dataKey="score"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Calendar className="h-5 w-5 mx-auto mb-2 text-primary" />
            <div className="text-lg font-bold">{thisWeek.length}</div>
            <div className="text-xs text-muted-foreground">Challenges This Week</div>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <TrendingUp className="h-5 w-5 mx-auto mb-2 text-green-500" />
            <div className="text-lg font-bold">
              {getAverage(thisWeek) - getAverage(lastWeek) >= 0 ? '+' : ''}
              {getAverage(thisWeek) - getAverage(lastWeek)}%
            </div>
            <div className="text-xs text-muted-foreground">Weekly Change</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressComparison;