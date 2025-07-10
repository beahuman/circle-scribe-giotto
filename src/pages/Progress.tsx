import React from 'react';
import { useSettings } from '@/hooks/useSettings';
import ProgressHeader from '@/components/progress/ProgressHeader';
import StreakOverview from '@/components/progress/StreakOverview';
import DailyTimeline from '@/components/progress/DailyTimeline';
import BestPerformances from '@/components/progress/BestPerformances';
import BadgesSection from '@/components/progress/BadgesSection';
import UnlockableFeatures from '@/components/progress/UnlockableFeatures';
import UpcomingBadges from '@/components/progress/UpcomingBadges';
import ShareProgress from '@/components/progress/ShareProgress';
import AnalyticsSection from '@/components/progress/AnalyticsSection';
import VisualIdentitySection from '@/components/VisualIdentitySection';

const Progress: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pb-20">
      <div className="max-w-md mx-auto p-6 space-y-6">
        <ProgressHeader />
        <StreakOverview />
        <DailyTimeline />
        <BestPerformances />
        <BadgesSection />
        <UnlockableFeatures />
        <UpcomingBadges />
        <VisualIdentitySection tone={settings.feedbackTone || 'meditative'} />
        <ShareProgress />
        <AnalyticsSection />
      </div>
    </div>
  );
};

export default Progress;