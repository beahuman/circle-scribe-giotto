import { useState, useEffect } from 'react';
import { useBrushSystem } from './useBrushSystem';
import { useToneSystem } from './useToneSystem';

export interface VisualFavorite {
  id: string;
  type: 'theme' | 'brush';
  itemId: string;
  name: string;
  addedAt: number;
}

export interface StyleInsights {
  mostUsedBrush: string;
  mostUsedTheme: string;
  longestStreak: string;
  commonCombo: string;
}

export const useVisualFavorites = () => {
  const [favorites, setFavorites] = useState<VisualFavorite[]>(() => {
    const saved = localStorage.getItem('visualFavorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [quickSwapEnabled, setQuickSwapEnabled] = useState(() => {
    return localStorage.getItem('quickSwapEnabled') === 'true';
  });

  const [usageHistory, setUsageHistory] = useState<Array<{
    date: string;
    brush: string;
    theme: string;
  }>>(() => {
    const saved = localStorage.getItem('visualUsageHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const { selectedBrush, getSelectedBrush } = useBrushSystem();
  const { selectedTone, getMostUsedTone, toneUsage } = useToneSystem();

  // Save to localStorage when favorites change
  useEffect(() => {
    localStorage.setItem('visualFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save quick swap setting
  useEffect(() => {
    localStorage.setItem('quickSwapEnabled', quickSwapEnabled.toString());
  }, [quickSwapEnabled]);

  // Save usage history
  useEffect(() => {
    localStorage.setItem('visualUsageHistory', JSON.stringify(usageHistory));
  }, [usageHistory]);

  // Track current usage
  const trackUsage = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = usageHistory.find(entry => entry.date === today);
    
    if (!todayEntry) {
      setUsageHistory(prev => [
        ...prev.slice(-29), // Keep last 30 days
        {
          date: today,
          brush: selectedBrush,
          theme: selectedTone
        }
      ]);
    } else if (todayEntry.brush !== selectedBrush || todayEntry.theme !== selectedTone) {
      setUsageHistory(prev => prev.map(entry => 
        entry.date === today 
          ? { ...entry, brush: selectedBrush, theme: selectedTone }
          : entry
      ));
    }
  };

  const addFavorite = (type: 'theme' | 'brush', itemId: string, name: string) => {
    if (favorites.length >= 3) {
      // Remove oldest favorite
      setFavorites(prev => prev.slice(1));
    }
    
    const newFavorite: VisualFavorite = {
      id: `${type}-${itemId}-${Date.now()}`,
      type,
      itemId,
      name,
      addedAt: Date.now()
    };
    
    setFavorites(prev => [...prev, newFavorite]);
  };

  const removeFavorite = (type: 'theme' | 'brush', itemId: string) => {
    setFavorites(prev => prev.filter(fav => !(fav.type === type && fav.itemId === itemId)));
  };

  const isFavorite = (type: 'theme' | 'brush', itemId: string): boolean => {
    return favorites.some(fav => fav.type === type && fav.itemId === itemId);
  };

  const toggleQuickSwap = () => {
    setQuickSwapEnabled(prev => !prev);
  };

  const getStyleInsights = (): StyleInsights => {
    const brushCounts: Record<string, number> = {};
    const themeCounts: Record<string, number> = {};
    
    usageHistory.forEach(entry => {
      brushCounts[entry.brush] = (brushCounts[entry.brush] || 0) + 1;
      themeCounts[entry.theme] = (themeCounts[entry.theme] || 0) + 1;
    });

    const mostUsedBrush = Object.entries(brushCounts).reduce((max, [brush, count]) => 
      count > brushCounts[max[0]] ? [brush, count] : max, ['Default', 0]
    )[0];

    const mostUsedTheme = getMostUsedTone();

    // Calculate longest streak with same visual combo
    let longestStreak = 0;
    let currentStreak = 0;
    let lastCombo = '';

    usageHistory.forEach(entry => {
      const combo = `${entry.brush}-${entry.theme}`;
      if (combo === lastCombo) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
        lastCombo = combo;
      }
    });

    return {
      mostUsedBrush: mostUsedBrush || 'Default',
      mostUsedTheme: mostUsedTheme || 'Playful',
      longestStreak: longestStreak > 1 
        ? `You used the same style for ${longestStreak} days in a row.`
        : 'You like to switch up your style frequently.',
      commonCombo: `Most common combo: ${mostUsedTheme} tone + ${mostUsedBrush} brush.`
    };
  };

  // Auto-track usage when components mount
  useEffect(() => {
    trackUsage();
  }, [selectedBrush, selectedTone]);

  return {
    favorites,
    quickSwapEnabled,
    usageHistory,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleQuickSwap,
    trackUsage,
    getStyleInsights
  };
};