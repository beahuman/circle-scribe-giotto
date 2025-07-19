import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { DailyCompletion } from '@/hooks/useDailyChallenges';

interface ProgressGraphProps {
  completions: DailyCompletion[];
  className?: string;
}

const ProgressGraph: React.FC<ProgressGraphProps> = ({ completions, className = "" }) => {
  // Process data for the chart
  const chartData = completions
    .sort((a, b) => new Date(a.challenge_date).getTime() - new Date(b.challenge_date).getTime())
    .map((completion, index) => ({
      date: new Date(completion.challenge_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: completion.score,
      day: index + 1,
      attempts: completion.attempts
    }));

  // Calculate statistics
  const averageScore = completions.length > 0 
    ? Math.round(completions.reduce((sum, c) => sum + c.score, 0) / completions.length)
    : 0;
    
  const bestScore = completions.length > 0 
    ? Math.max(...completions.map(c => c.score))
    : 0;
    
  const improvement = chartData.length > 1
    ? chartData[chartData.length - 1].score - chartData[0].score
    : 0;

  if (completions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progress Graph
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Complete daily challenges to see your progress</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Progress Graph
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-xl">
            <div className="text-2xl font-bold text-primary">{averageScore}%</div>
            <div className="text-xs text-muted-foreground">Average Score</div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-xl">
            <div className="text-2xl font-bold text-green-500">{bestScore}%</div>
            <div className="text-xs text-muted-foreground">Best Score</div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-xl">
            <div className={`text-2xl font-bold ${improvement >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {improvement >= 0 ? '+' : ''}{improvement}%
            </div>
            <div className="text-xs text-muted-foreground">Improvement</div>
          </div>
        </div>

        {/* Score trend chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 100]}
                className="text-xs"
                tick={{ fontSize: 12 }}
                label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#scoreGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Attempts chart */}
        {chartData.some(d => d.attempts > 1) && (
          <div className="h-32">
            <h4 className="text-sm font-medium mb-2">Attempts per Challenge</h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" className="text-xs" tick={{ fontSize: 10 }} />
                <YAxis className="text-xs" tick={{ fontSize: 10 }} />
                <Line
                  type="monotone"
                  dataKey="attempts"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--muted-foreground))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressGraph;