import { useState, useEffect, useCallback } from 'react';
import { BrushProgress } from '@/types/brushes';
import { BRUSH_STYLES, getBrushById } from '@/utils/brushStyles';
import { useToast } from '@/hooks/use-toast';


export const useBrushSystem = () => {
  const { toast } = useToast();
  
  const [brushProgress, setBrushProgress] = useState<BrushProgress>(() => {
    const saved = localStorage.getItem('brushProgress');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      unlockedBrushes: ['default'],
      selectedBrush: 'default',
      brushUnlockNotifications: []
    };
  });

  // Save to localStorage whenever brushProgress changes
  useEffect(() => {
    localStorage.setItem('brushProgress', JSON.stringify(brushProgress));
  }, [brushProgress]);

  // Check for newly unlocked brushes
  const checkForUnlocks = useCallback(() => {
    const currentlyUnlocked = new Set(brushProgress.unlockedBrushes);
    const newlyUnlocked: string[] = [];
    
    BRUSH_STYLES.forEach(brush => {
      if (!currentlyUnlocked.has(brush.id) && brush.isUnlocked({})) {
        newlyUnlocked.push(brush.id);
      }
    });
    
    if (newlyUnlocked.length > 0) {
      setBrushProgress(prev => ({
        ...prev,
        unlockedBrushes: [...prev.unlockedBrushes, ...newlyUnlocked],
        brushUnlockNotifications: [...prev.brushUnlockNotifications, ...newlyUnlocked]
      }));
      
      // Show unlock notification for the first new brush
      if (newlyUnlocked.length > 0) {
        const brush = getBrushById(newlyUnlocked[0]);
        if (brush) {
          toast({
            title: "New Brush Unlocked!",
            description: `${brush.name} - ${brush.description}`,
            duration: 4000
          });
        }
      }
    }
  }, [brushProgress.unlockedBrushes, toast]);

  // Check for unlocks on mount and when dependencies change
  useEffect(() => {
    checkForUnlocks();
  }, [checkForUnlocks]);

  const selectBrush = useCallback((brushId: string) => {
    if (brushProgress.unlockedBrushes.includes(brushId)) {
      setBrushProgress(prev => ({
        ...prev,
        selectedBrush: brushId
      }));
    }
  }, [brushProgress.unlockedBrushes]);

  const clearUnlockNotifications = useCallback(() => {
    setBrushProgress(prev => ({
      ...prev,
      brushUnlockNotifications: []
    }));
  }, []);

  const getSelectedBrush = useCallback(() => {
    return getBrushById(brushProgress.selectedBrush) || getBrushById('default')!;
  }, [brushProgress.selectedBrush]);

  const isBrushUnlocked = useCallback((brushId: string) => {
    return brushProgress.unlockedBrushes.includes(brushId);
  }, [brushProgress.unlockedBrushes]);

  const getUnlockedBrushes = useCallback(() => {
    return BRUSH_STYLES.filter(brush => isBrushUnlocked(brush.id));
  }, [isBrushUnlocked]);

  const getLockedBrushes = useCallback(() => {
    return BRUSH_STYLES.filter(brush => !isBrushUnlocked(brush.id));
  }, [isBrushUnlocked]);

  return {
    brushProgress,
    selectedBrush: brushProgress.selectedBrush,
    unlockedBrushes: brushProgress.unlockedBrushes,
    brushUnlockNotifications: brushProgress.brushUnlockNotifications,
    selectBrush,
    clearUnlockNotifications,
    getSelectedBrush,
    isBrushUnlocked,
    getUnlockedBrushes,
    getLockedBrushes,
    checkForUnlocks
  };
};