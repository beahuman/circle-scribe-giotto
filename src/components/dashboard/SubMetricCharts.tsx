import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { DailyCompletion } from '@/hooks/useDailyChallenges';

interface SubMetricChartsProps {
  completions: DailyCompletion[];
}

const SubMetricCharts: React.FC<SubMetricChartsProps> = ({ completions }) => {
  // Mock sub-metric data based on completions
  const chartData = completions
    .sort((a, b) => new Date(a.challenge_date).getTime() - new Date(b.challenge_date).getTime())
    .map((completion, index) => {
      // Generate mock sub-metrics based on total score
      const baseScore = completion.score;
      return {
        date: new Date(completion.challenge_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        symmetry: Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * 10)),
        smoothness: Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * 8)),
        closure: Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * 12)),
        overall: baseScore
      };
    });

  if (completions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Sub-Metric Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Complete daily challenges to see detailed metrics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Sub-Metric Performance Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              <Legend />
              <Line
                type="monotone"
                dataKey="symmetry"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Symmetry"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="smoothness"
                stroke="#10B981"
                strokeWidth={2}
                name="Smoothness"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="closure"
                stroke="#8B5CF6"
                strokeWidth={2}
                name="Closure"
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="overall"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                name="Overall"
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Metric explanations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="text-center p-3 bg-blue-500/10 rounded-lg">
            <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-2"></div>
            <div className="text-sm font-medium">Symmetry</div>
            <div className="text-xs text-muted-foreground">How well your circle follows the perfect path</div>
          </div>
          
          <div className="text-center p-3 bg-green-500/10 rounded-lg">
            <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
            <div className="text-sm font-medium">Smoothness</div>
            <div className="text-xs text-muted-foreground">Consistency of your drawing motion</div>
          </div>
          
          <div className="text-center p-3 bg-purple-500/10 rounded-lg">
            <div className="w-4 h-4 bg-purple-500 rounded-full mx-auto mb-2"></div>
            <div className="text-sm font-medium">Closure</div>
            <div className="text-xs text-muted-foreground">How well start and end points connect</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubMetricCharts;