import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, Trophy, Calendar, BarChart3 } from 'lucide-react';
import { useDailyChallenges } from '@/hooks/useDailyChallenges';
import BadgeShowcase from './BadgeShowcase';
import ProgressGraph from './ProgressGraph';
import SubMetricCharts from './dashboard/SubMetricCharts';
import StreakCalendar from './dashboard/StreakCalendar';
import ProgressComparison from './dashboard/ProgressComparison';
import UnlockedModesGallery from './progress/UnlockedModesGallery';
import LogoHeader from './common/LogoHeader';

interface UserDashboardProps {
  onBack: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onBack }) => {
  const {
    weekCompletions,
    currentStreak,
    longestStreak,
    userBadges,
    isLoading
  } = useDailyChallenges();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 pb-20">
      <div className="max-w-6xl mx-auto space-y-grid">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <LogoHeader size="small" clickable={false} />
          <div className="w-20" />
        </div>
        
        <h1 className="text-header text-center bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Your Progress Dashboard
        </h1>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{weekCompletions.length}</div>
              <div className="text-xs text-muted-foreground">This Week</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold text-orange-500">{currentStreak}</div>
              <div className="text-xs text-muted-foreground">Current Streak</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <BarChart3 className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold text-green-500">{longestStreak}</div>
              <div className="text-xs text-muted-foreground">Best Streak</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold text-yellow-500">{userBadges.length}</div>
              <div className="text-xs text-muted-foreground">Badges Earned</div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="modes">Modes</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProgressGraph completions={weekCompletions} />
              <ProgressComparison completions={weekCompletions} />
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <SubMetricCharts completions={weekCompletions} />
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Achievement Gallery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BadgeShowcase />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modes" className="space-y-6">
            <UnlockedModesGallery />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <StreakCalendar 
              completions={weekCompletions}
              currentStreak={currentStreak}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;