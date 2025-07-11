import React, { useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useProgressNudge } from '@/hooks/useProgressNudge';
import ProgressPageTour from '@/components/onboarding/ProgressPageTour';
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
import BehaviorInsights from '@/components/progress/BehaviorInsights';
import LogoHeader from '@/components/common/LogoHeader';

const Progress: React.FC = () => {
  const { settings } = useSettings();
  const { nudgeState, markProgressViewed, completeTour } = useProgressNudge();

  // Mark progress as viewed when component mounts
  useEffect(() => {
    if (!nudgeState.hasViewedProgress) {
      markProgressViewed();
    }
  }, [nudgeState.hasViewedProgress, markProgressViewed]);

  return (
    <>
      {/* Progress Page Tour */}
      <ProgressPageTour
        show={nudgeState.showProgressTour}
        onComplete={completeTour}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pb-20">
        <div className="max-w-md mx-auto p-6 space-y-grid">
          {/* Logo Header */}
          <div className="flex justify-center mb-8">
            <LogoHeader size="medium" />
          </div>
          
          <ProgressHeader />
          <BehaviorInsights />
          <StreakOverview data-tour="streak-tracker" />
          <DailyTimeline />
          <BestPerformances data-tour="best-scores" />
          <BadgesSection />
          <UnlockableFeatures />
          <UpcomingBadges />
          <VisualIdentitySection tone={settings.feedbackTone || 'meditative'} data-tour="visual-identity" />
          <ShareProgress />
          <AnalyticsSection />
        </div>
      </div>
    </>
  );
};

export default Progress;