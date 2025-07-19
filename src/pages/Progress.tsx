
import React, { useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useProgressNudge } from '@/hooks/useProgressNudge';
import ProgressPageTour from '@/components/onboarding/ProgressPageTour';
import ProgressHeader from '@/components/progress/ProgressHeader';
import CircularStreakTracker from '@/components/progress/CircularStreakTracker';
import DailyTimeline from '@/components/progress/DailyTimeline';
import BestPerformances from '@/components/progress/BestPerformances';
import EnhancedBadgesSection from '@/components/progress/EnhancedBadgesSection';
import UnlockableFeatures from '@/components/progress/UnlockableFeatures';
import UpcomingBadges from '@/components/progress/UpcomingBadges';
import ShareProgress from '@/components/progress/ShareProgress';
import AnalyticsSection from '@/components/progress/AnalyticsSection';
import VisualIdentitySection from '@/components/VisualIdentitySection';
import BehaviorInsights from '@/components/progress/BehaviorInsights';
import ToneMasterySection from '@/components/progress/ToneMasterySection';
import StyleInsightsPanel from '@/components/progress/StyleInsightsPanel';
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
      
      <div className="min-h-screen bg-background pb-20 md:pb-24">
        <div className="max-w-sm mx-auto px-4 py-6 xs:max-w-md md:max-w-4xl md:px-6 md:py-8 lg:max-w-6xl lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Unified Logo Header with consistent positioning */}
          <div className="flex justify-center mb-8 lg:col-span-2" style={{ marginTop: 'var(--logo-margin-top)' }}>
            <LogoHeader size="medium" />
          </div>
          
          {/* Progress Content - Enhanced Grid Layout */}
          <div className="space-y-8 lg:space-y-0 lg:contents">
            <div className="lg:col-span-2">
              <ProgressHeader />
            </div>
            
            <div className="lg:col-span-1">
              <CircularStreakTracker data-tour="streak-tracker" />
            </div>
            
            <div className="lg:col-span-1">
              <StyleInsightsPanel />
            </div>
            
            <div className="lg:col-span-1">
              <BehaviorInsights />
            </div>
            
            <div className="lg:col-span-1">
              <ToneMasterySection />
            </div>
            
            <div className="lg:col-span-2">
              <BestPerformances data-tour="best-scores" />
            </div>
            
            <div className="lg:col-span-1">
              <EnhancedBadgesSection />
            </div>
            
            <div className="lg:col-span-1">
              <UnlockableFeatures />
            </div>
            
            <div className="lg:col-span-2">
              <VisualIdentitySection tone={settings.feedbackTone || 'meditative'} data-tour="visual-identity" />
            </div>
            
            <div className="lg:col-span-1">
              <UpcomingBadges />
            </div>
            
            <div className="lg:col-span-1">
              <DailyTimeline />
            </div>
            
            <div className="lg:col-span-2">
              <ShareProgress />
            </div>
            
            <div className="lg:col-span-2 lg:hidden">
              <AnalyticsSection />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Progress;
