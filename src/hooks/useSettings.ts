import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useSettings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
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
  const { toast } = useToast();

  const handleNotificationToggle = (checked: boolean) => {
    setNotifications(checked);
    toast({
      title: "Notification Settings",
      description: checked ? "Notifications enabled" : "Notifications disabled"
    });
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    toast({
      title: "Appearance",
      description: checked ? "Dark mode enabled" : "Light mode enabled"
    });
  };

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

  return {
    notifications,
    darkMode,
    difficultyLevel,
    drawingPrecision,
    displayDuration,
    showGhostCircle,
    penaltyModeEnabled,
    showSubmetrics,
    handleNotificationToggle,
    handleDarkModeToggle,
    handleDifficultyChange,
    handlePrecisionChange,
    handleDurationChange,
    handleGhostCircleToggle,
    handlePenaltyModeToggle,
    handleSubmetricsToggle,
  };
};
