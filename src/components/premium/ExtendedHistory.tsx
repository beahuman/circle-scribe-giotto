import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { 
  Calendar as CalendarIcon,
  Crown,
  TrendingUp,
  Target,
  Clock,
  Filter,
  Download
} from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import PremiumModal from "@/components/subscription/PremiumModal";
import { format, subDays } from "date-fns";

interface ExtendedHistoryProps {
  gameHistory?: Array<{
    id: string;
    date: string;
    score: number;
    accuracy: number;
    duration: number;
    difficulty: string;
  }>;
}

const ExtendedHistory: React.FC<ExtendedHistoryProps> = ({ gameHistory }) => {
  const { isPremium } = useSubscription();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  // Mock extended history data
  const mockExtendedHistory = Array.from({ length: 90 }, (_, i) => ({
    id: `session-${i}`,
    date: format(subDays(new Date(), i), 'yyyy-MM-dd'),
    score: 65 + Math.random() * 30,
    accuracy: 70 + Math.random() * 25,
    duration: 120 + Math.random() * 180,
    difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)]
  }));

  const history = gameHistory || mockExtendedHistory;
  const extendedHistory = history.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate <= dateRange.to && sessionDate >= dateRange.from;
  });

  if (!isPremium) {
    return (
      <>
        <Card className="border-dashed border-primary/30 bg-gradient-to-r from-primary/5 to-purple-400/5">
          <CardContent className="p-6 text-center">
            <CalendarIcon className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Extended History</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Access your complete drawing history beyond 30 days. Track long-term progress and patterns.
            </p>
            <div className="text-xs text-muted-foreground mb-4">
              <span className="font-medium">Free:</span> Last 30 days | 
              <span className="font-medium text-primary ml-2">Premium:</span> Unlimited history
            </div>
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Extended History</h2>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Premium
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Date Range Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Select Date Range</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
            <div className="mt-4 space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setDateRange({
                  from: subDays(new Date(), 90),
                  to: new Date()
                })}
              >
                Last 90 days
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setDateRange({
                  from: subDays(new Date(), 180),
                  to: new Date()
                })}
              >
                Last 6 months
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setDateRange({
                  from: subDays(new Date(), 365),
                  to: new Date()
                })}
              >
                Last year
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* History Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Period Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{extendedHistory.length}</div>
                <div className="text-sm text-muted-foreground">Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {Math.round(extendedHistory.reduce((sum, s) => sum + s.score, 0) / extendedHistory.length)}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {Math.round(extendedHistory.reduce((sum, s) => sum + s.duration, 0) / 60)}
                </div>
                <div className="text-sm text-muted-foreground">Total Min</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {Math.round(extendedHistory.reduce((sum, s) => sum + s.accuracy, 0) / extendedHistory.length)}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed History List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Session History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {extendedHistory.slice(0, 50).map((session, index) => (
              <div 
                key={session.id} 
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {format(new Date(session.date), 'MMM dd, yyyy')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {session.difficulty} • {Math.round(session.duration / 60)}min
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    <span>{Math.round(session.score)}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>{Math.round(session.accuracy)}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{Math.round(session.duration)}s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExtendedHistory;