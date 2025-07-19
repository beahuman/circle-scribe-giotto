import { useMemo } from 'react';

export const useGameModes = () => {
  const searchParams = new URLSearchParams(window.location.search);
  
  return useMemo(() => ({
    isDailyMode: searchParams.get('daily') === 'true',
    isDailyChallengeMode: searchParams.get('mode') === 'daily-challenge',
    isBlindDrawMode: searchParams.get('mode') === 'blind-draw',
    isOffsetMode: searchParams.get('mode') === 'offset',
    isPerceptionGauntletMode: searchParams.get('mode') === 'perception-gauntlet',
    isInfinitePracticeMode: searchParams.get('mode') === 'infinite-practice'
  }), [searchParams]);
};