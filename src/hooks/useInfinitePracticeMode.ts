import { useState, useEffect } from 'react';

export const useInfinitePracticeMode = () => {
  const [isUnlocked] = useState(true); // Always unlocked
  const [practiceSessionCount, setPracticeSessionCount] = useState(() => {
    return parseInt(localStorage.getItem('infinitePracticeCount') || '0');
  });
  
  const [autoRhythmEnabled, setAutoRhythmEnabled] = useState(() => {
    return localStorage.getItem('infinitePracticeAutoRhythm') === 'true';
  });
  
  const [visualFeedbackEnabled, setVisualFeedbackEnabled] = useState(() => {
    return localStorage.getItem('infinitePracticeVisualFeedback') !== 'false';
  });
  
  const [loggingEnabled, setLoggingEnabled] = useState(() => {
    return localStorage.getItem('infinitePracticeLogging') === 'true';
  });

  const recordPracticeRound = () => {
    if (loggingEnabled) {
      const newCount = practiceSessionCount + 1;
      setPracticeSessionCount(newCount);
      localStorage.setItem('infinitePracticeCount', newCount.toString());
    }
  };

  const toggleAutoRhythm = () => {
    const newValue = !autoRhythmEnabled;
    setAutoRhythmEnabled(newValue);
    localStorage.setItem('infinitePracticeAutoRhythm', newValue.toString());
  };

  const toggleVisualFeedback = () => {
    const newValue = !visualFeedbackEnabled;
    setVisualFeedbackEnabled(newValue);
    localStorage.setItem('infinitePracticeVisualFeedback', newValue.toString());
  };

  const toggleLogging = () => {
    const newValue = !loggingEnabled;
    setLoggingEnabled(newValue);
    localStorage.setItem('infinitePracticeLogging', newValue.toString());
  };

  return {
    isUnlocked,
    practiceSessionCount,
    autoRhythmEnabled,
    visualFeedbackEnabled,
    loggingEnabled,
    recordPracticeRound,
    toggleAutoRhythm,
    toggleVisualFeedback,
    toggleLogging,
  };
};