export interface ProgressNudgeState {
  showNavBadge: boolean;
  showPostScoreCTA: boolean;
  showStreakToast: boolean;
  showProgressTour: boolean;
  hasViewedProgress: boolean;
  hasCompletedFirstDaily: boolean;
  hasCompletedSecondDraw: boolean;
  hasHitThreeDayStreak: boolean;
  milestoneType?: 'new_best' | 'streak_broken' | 'score_improvement' | 'unlock_milestone' | null;
}

export type MilestoneType = 'new_best' | 'score_improvement' | 'streak_broken' | 'unlock_milestone';