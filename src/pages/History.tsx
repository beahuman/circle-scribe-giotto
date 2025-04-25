
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ChevronRight, Award, TrendingUp, Calendar, Star } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

// Mock data for the history page
const mockAttempts = [
  { id: 1, date: new Date(2025, 3, 23), score: 72 },
  { id: 2, date: new Date(2025, 3, 23), score: 45 },
  { id: 3, date: new Date(2025, 3, 23), score: 87 },
  { id: 4, date: new Date(2025, 3, 24), score: 62 },
  { id: 5, date: new Date(2025, 3, 24), score: 91 },
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
    <div className="min-h-screen p-6 bg-gradient-to-b from-background to-background/80 flex flex-col">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
          Circle History
        </h1>
      </div>

      <div className="flex-1 space-y-6 max-w-md mx-auto w-full">
        <Card className="overflow-hidden border-2 border-primary/20 shadow-lg shadow-primary/10">
          <CardHeader className="pb-2 text-center bg-gradient-to-r from-primary/10 to-purple-400/10">
            <CardTitle className="flex items-center justify-center gap-2">
              <Award size={28} className="text-primary animate-pulse-slow" />
              <span>Personal Best</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">{bestScore}%</div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border border-primary/20 shadow-md">
          <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-purple-400/10">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              Progress
            </CardTitle>
            <CardDescription>Your circle-drawing journey</CardDescription>
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
                  <Tooltip contentStyle={{ borderRadius: '8px' }} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border border-primary/20 shadow-md">
          <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-purple-400/10">
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              Recent Attempts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {mockAttempts.map(attempt => (
                <li key={attempt.id} className="flex items-center justify-between py-3 px-2 border-b last:border-0 hover:bg-primary/5 rounded-md transition-colors">
                  <div>
                    <p className="text-sm font-medium">{format(attempt.date, 'EEEE, MMMM d, yyyy')}</p>
                    <p className={`text-sm ${attempt.score >= 80 ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                      Score: {attempt.score}%
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border border-primary/20 shadow-md">
          <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-purple-400/10">
            <CardTitle className="flex items-center gap-2">
              <Star size={20} className="text-primary" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-3">
              {achievements.map(achievement => (
                <li key={achievement.id} className="flex items-center gap-3 py-2 px-2 rounded-md border-b last:border-0 hover:bg-primary/5 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    achievement.earned ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {achievement.earned ? 
                      <Star className="h-5 w-5" fill="currentColor" /> : 
                      <Star className="h-5 w-5" />
                    }
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
