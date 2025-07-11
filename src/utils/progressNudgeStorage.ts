import { ProgressNudgeState } from '@/types/progressNudge';

export const createDefaultNudgeState = (): ProgressNudgeState => ({
  showNavBadge: false,
  showPostScoreCTA: false,
  showStreakToast: false,
  showProgressTour: false,
  hasViewedProgress: false,
  hasCompletedFirstDaily: false,
  hasCompletedSecondDraw: false,
  hasHitThreeDayStreak: false,
});

export const loadNudgeState = (): ProgressNudgeState => {
  const saved = localStorage.getItem('progressNudgeState');
  return saved ? JSON.parse(saved) : createDefaultNudgeState();
};

export const saveNudgeState = (state: ProgressNudgeState): void => {
  localStorage.setItem('progressNudgeState', JSON.stringify(state));
};

export const clearNudgeState = (): void => {
  localStorage.removeItem('progressNudgeState');
};