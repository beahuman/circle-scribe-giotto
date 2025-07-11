import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useGameSettings = () => {
  const [difficultyLevel, setDifficultyLevel] = useState(() => {
    return Number(localStorage.getItem('difficultyLevel')) || 50;
  });
  
  const [drawingPrecision, setDrawingPrecision] = useState(() => {
    return Number(localStorage.getItem('drawingPrecision')) || 50;
  });
  
  const [displayDuration, setDisplayDuration] = useState(() => {
    return Number(localStorage.getItem('displayDuration')) || 3;
  });
  
  const [showGhostCircle, setShowGhostCircle] = useState(() => {
    return localStorage.getItem('showGhostCircle') === 'true';
  });
  
  const [penaltyModeEnabled, setPenaltyModeEnabled] = useState(() => {
    return localStorage.getItem('penaltyModeEnabled') === 'true';
  });
  
  const [showSubmetrics, setShowSubmetrics] = useState(() => {
    return localStorage.getItem('showSubmetrics') === 'true';
  });
  
  const [mirrorOffsetEnabled, setMirrorOffsetEnabled] = useState(() => {
    return localStorage.getItem('mirrorOffsetEnabled') === 'true';
  });
  
  const [adaptiveScoreScreen, setAdaptiveScoreScreen] = useState(() => {
    const saved = localStorage.getItem('adaptiveScoreScreen');
    return saved !== null ? saved === 'true' : true; // Default to true
  });
  
  const [ghostTrailOverlay, setGhostTrailOverlay] = useState(() => {
    const saved = localStorage.getItem('ghostTrailOverlay');
    return saved !== null ? saved === 'true' : true; // Default to true
  });
  
  const { toast } = useToast();

  const handleDifficultyChange = (value: number[]) => {
    const newValue = value[0];
    setDifficultyLevel(newValue);
    localStorage.setItem('difficultyLevel', String(newValue));
    toast({
      title: "Difficulty Updated",
      description: `Difficulty level set to ${newValue}%`
    });
  };

  const handlePrecisionChange = (value: number[]) => {
    const newValue = value[0];
    setDrawingPrecision(newValue);
    localStorage.setItem('drawingPrecision', String(newValue));
    toast({
      title: "Drawing Precision Updated",
      description: `Drawing precision set to ${newValue}%`
    });
  };

  const handleDurationChange = (value: number[]) => {
    const newValue = value[0];
    setDisplayDuration(newValue);
    localStorage.setItem('displayDuration', String(newValue));
    toast({
      title: "Display Duration Updated",
      description: `Circle will display for ${newValue} seconds`
    });
  };
  
  const handleGhostCircleToggle = (checked: boolean) => {
    setShowGhostCircle(checked);
    localStorage.setItem('showGhostCircle', String(checked));
    toast({
      title: "Ghost Circle",
      description: checked ? "Ghost circle enabled" : "Ghost circle disabled"
    });
  };

  const handlePenaltyModeToggle = (checked: boolean) => {
    setPenaltyModeEnabled(checked);
    localStorage.setItem('penaltyModeEnabled', String(checked));
    toast({
      title: "Penalty Mode",
      description: checked ? "Penalty mode enabled - good luck!" : "Penalty mode disabled"
    });
  };

  const handleSubmetricsToggle = (checked: boolean) => {
    setShowSubmetrics(checked);
    localStorage.setItem('showSubmetrics', String(checked));
    toast({
      title: "Visual Analytics",
      description: checked ? "Submetrics overlay enabled" : "Submetrics overlay disabled"
    });
  };

  const handleMirrorOffsetToggle = (checked: boolean) => {
    setMirrorOffsetEnabled(checked);
    localStorage.setItem('mirrorOffsetEnabled', String(checked));
    toast({
      title: "Mirror-Offset Mode",
      description: checked ? "Mirror-offset mode enabled" : "Mirror-offset mode disabled"
    });
  };

  const handleAdaptiveScoreScreenToggle = (checked: boolean) => {
    setAdaptiveScoreScreen(checked);
    localStorage.setItem('adaptiveScoreScreen', String(checked));
    toast({
      title: "Adaptive Score Screen",
      description: checked ? "Dynamic score screen enabled" : "Traditional score screen enabled"
    });
  };

  const handleGhostTrailOverlayToggle = (checked: boolean) => {
    setGhostTrailOverlay(checked);
    localStorage.setItem('ghostTrailOverlay', String(checked));
    toast({
      title: "Ghost Trail Overlay",
      description: checked ? "Ghost trail comparison enabled" : "Ghost trail comparison disabled"
    });
  };

  return {
    difficultyLevel,
    drawingPrecision,
    displayDuration,
    showGhostCircle,
    penaltyModeEnabled,
    showSubmetrics,
    mirrorOffsetEnabled,
    adaptiveScoreScreen,
    ghostTrailOverlay,
    handleDifficultyChange,
    handlePrecisionChange,
    handleDurationChange,
    handleGhostCircleToggle,
    handlePenaltyModeToggle,
    handleSubmetricsToggle,
    handleMirrorOffsetToggle,
    handleAdaptiveScoreScreenToggle,
    handleGhostTrailOverlayToggle,
  };
};