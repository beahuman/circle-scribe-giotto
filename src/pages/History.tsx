import React from 'react';
import { Separator } from '@/components/ui/separator';
import BottomNav from '@/components/BottomNav';
import { ArrowLeft, Clock, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const History = () => {
  const navigate = useNavigate();
  
  // Mock history data - in a real app this would come from a database or local storage
  const historyData = [
    { id: 1, date: '2025-04-25', score: 89.5, difficulty: 'Medium' },
    { id: 2, date: '2025-04-24', score: 72.3, difficulty: 'Hard' },
    { id: 3, date: '2025-04-23', score: 95.7, difficulty: 'Easy' },
    { id: 4, date: '2025-04-22', score: 83.1, difficulty: 'Medium' },
    { id: 5, date: '2025-04-21', score: 68.9, difficulty: 'Hard' },
  ];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-background to-background/80 pb-24">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} size="icon" className="mr-2">
          <ArrowLeft className="h-6 w-6 text-primary" />
        </Button>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Your History</h1>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-primary" />
            <h2 className="text-lg font-medium">Statistics</h2>
          </div>
          <p className="text-sm text-muted-foreground -mt-2">Your overall performance</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-secondary/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">Average Score</p>
              <p className="text-2xl font-bold">81.9%</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">Best Score</p>
              <p className="text-2xl font-bold">95.7%</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">Total Attempts</p>
              <p className="text-2xl font-bold">5</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">Favorite Difficulty</p>
              <p className="text-2xl font-bold">Medium</p>
            </div>
          </div>
        </div>

        <Separator className="bg-[#D6BCFA]" />

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            <h2 className="text-lg font-medium">Recent Attempts</h2>
          </div>
          <p className="text-sm text-muted-foreground -mt-2">Your most recent drawing scores</p>
          <div className="space-y-4">
            {historyData.map((item, index) => (
              <React.Fragment key={item.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {format(new Date(item.date), 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="text-sm text-muted-foreground">Difficulty: {item.difficulty}</p>
                  </div>
                  <div className="bg-secondary/50 px-3 py-1 rounded-full flex items-center gap-1">
                    <Trophy size={14} className="text-primary" />
                    <span className="font-bold">{item.score}%</span>
                  </div>
                </div>
                {index < historyData.length - 1 && <Separator className="bg-[#D6BCFA] my-2" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default History;
