import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, TrendingUp, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useDailyCalibration } from '@/hooks/useDailyCalibration';

interface DailyCalibrationScreenProps {
  onStartCalibration: () => void;
  onBack: () => void;
}

const DailyCalibrationScreen: React.FC<DailyCalibrationScreenProps> = ({
  onStartCalibration,
  onBack
}) => {
  const { todayCompleted, getLast5Days, getCurrentStreak } = useDailyCalibration();
  const last5Days = getLast5Days();
  const currentStreak = getCurrentStreak();

  const chartConfig = {
    accuracy: {
      label: "Accuracy",
      color: "hsl(var(--primary))",
    },
  };

  const handleStartCalibration = () => {
    // Set URL parameter to indicate daily mode
    const url = new URL(window.location.href);
    url.searchParams.set('daily', 'true');
    window.history.pushState({}, '', url.toString());
    onStartCalibration();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-start gap-6 p-6 pb-24 text-center min-h-screen bg-gradient-to-b from-primary/5 to-background"
    >
      <div className="flex items-center justify-between w-full max-w-md">
        <Button variant="ghost" onClick={onBack} size="icon">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
          Daily Calibration
        </h1>
        <div className="w-10" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <p className="text-muted-foreground">One perfect circle per day</p>
        </div>
        <p className="text-sm text-muted-foreground max-w-sm">
          Focus your mind, steady your hand, and capture your daily motor precision.
        </p>
      </div>

      {/* Streak Counter */}
      {currentStreak > 0 && (
        <Card className="p-4 bg-primary/10 border-primary/20">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="font-medium">{currentStreak} day streak!</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Consistency builds neural strength
          </p>
        </Card>
      )}

      {/* 5-Day Chart */}
      <Card className="w-full max-w-md p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">5-Day Progress</h3>
          </div>
          
          <ChartContainer config={chartConfig} className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last5Days}>
                <XAxis 
                  dataKey="dayName" 
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                />
                <YAxis 
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="var(--color-accuracy)"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "var(--color-accuracy)" }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          {/* Daily accuracy indicators */}
          <div className="flex justify-between text-xs text-muted-foreground">
            {last5Days.map((day, index) => (
              <div key={index} className="text-center">
                <div className="font-medium">{day.dayName}</div>
                <div className={`mt-1 ${day.completed ? 'text-primary' : 'text-muted-foreground/50'}`}>
                  {day.completed ? `${day.accuracy}%` : '—'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Action Button */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {todayCompleted ? (
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-center gap-2 justify-center text-green-700 mb-2">
              <Target className="h-5 w-5" />
              <span className="font-medium">Today's Calibration Complete</span>
            </div>
            <p className="text-sm text-green-600 text-center">
              Your neural pathways are strengthening. Return tomorrow for your next session.
            </p>
          </Card>
        ) : (
          <Button 
            onClick={handleStartCalibration}
            className="px-8 py-6 text-lg rounded-full"
            size="lg"
          >
            Begin Today's Calibration
          </Button>
        )}
      </div>

      <div className="text-xs text-muted-foreground max-w-sm space-y-1">
        <p>• One attempt per day builds focused precision</p>
        <p>• No retries - trust your motor memory</p>
        <p>• Consistent practice enhances neural pathways</p>
      </div>
    </motion.div>
  );
};

export default DailyCalibrationScreen;
