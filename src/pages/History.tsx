
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ChevronRight, Award, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the history page
const mockAttempts = [
  { id: 1, date: '2025-04-23', score: 72, time: '12:30 PM' },
  { id: 2, date: '2025-04-23', score: 45, time: '2:15 PM' },
  { id: 3, date: '2025-04-23', score: 87, time: '5:45 PM' },
  { id: 4, date: '2025-04-24', score: 62, time: '9:10 AM' },
  { id: 5, date: '2025-04-24', score: 91, time: '3:20 PM' },
];

const achievements = [
  { id: 1, name: 'First Circle', description: 'Complete your first circle drawing', earned: true },
  { id: 2, name: 'Perfect Circle', description: 'Score above 90% accuracy', earned: true },
  { id: 3, name: 'Circle Master', description: 'Score above 95% accuracy 5 times', earned: false },
  { id: 4, name: 'Circle Marathon', description: 'Draw 50 circles in total', earned: false },
];

// Chart data formatted for recharts
const chartData = [
  { name: 'Apr 20', score: 45 },
  { name: 'Apr 21', score: 58 },
  { name: 'Apr 22', score: 67 },
  { name: 'Apr 23', score: 72 },
  { name: 'Apr 24', score: 91 },
];

const History = () => {
  const navigate = useNavigate();
  const bestScore = Math.max(...mockAttempts.map(attempt => attempt.score));

  return (
    <div className="min-h-screen p-6 flex flex-col">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">History & Stats</h1>
      </div>

      <div className="flex-1 space-y-6 max-w-md mx-auto w-full">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Award size={18} />
              Personal Best
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <div className="text-5xl font-bold">{bestScore}%</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={18} />
              Progress
            </CardTitle>
            <CardDescription>Your circle-drawing improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" fontSize={12} tickMargin={10} />
                  <YAxis domain={[0, 100]} fontSize={12} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recent Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {mockAttempts.map(attempt => (
                <li key={attempt.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{attempt.date} • {attempt.time}</p>
                    <p className={`text-sm ${attempt.score >= 80 ? 'text-primary' : 'text-muted-foreground'}`}>
                      Score: {attempt.score}%
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {achievements.map(achievement => (
                <li key={achievement.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    achievement.earned ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {achievement.earned ? '✓' : '?'}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${!achievement.earned && 'text-muted-foreground'}`}>
                      {achievement.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default History;
