import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Play, History, Settings, Trophy, HelpCircle, Tag, Palette } from "lucide-react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LogoAnimation from './LogoAnimation';
interface HomeScreenProps {
  onStart: () => void;
  showLeaderboard?: () => void;
  isGuestMode?: boolean;
  onRemoveAds?: () => void;
}
const HomeScreen: React.FC<HomeScreenProps> = ({
  onStart,
  showLeaderboard,
  isGuestMode,
  onRemoveAds
}) => {
  const navigate = useNavigate();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const tips = ["Focus on smooth, consistent strokes.", "Adjust difficulty for optimal challenge.", "Experiment with different drawing speeds.", "Visualize the target before drawing.", "Take breaks to avoid mental fatigue."];
  const handleNextTip = () => {
    setCurrentTipIndex(prev => (prev + 1) % tips.length);
  };
  const handlePrevTip = () => {
    setCurrentTipIndex(prev => (prev - 1 + tips.length) % tips.length);
  };
  return <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-800 opacity-30 z-0" />
      
      <LogoAnimation className="z-10" />
      
      
      <p className="text-md md:text-lg text-center mb-8 z-10 text-indigo-600 text-xl">
        Master the art of freehand circles.
      </p>
      
      <div className="space-y-4 w-full max-w-md z-10 mt-8">
        <Button onClick={onStart} size="lg" className="w-full text-lg font-medium">
          Start Drawing
        </Button>
        
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={() => navigate("/store")} variant="outline" className="flex gap-2 items-center justify-center">
            <Palette className="h-4 w-4" />
            Reward Store
          </Button>
          
          <Button onClick={() => navigate("/history")} variant="outline" className="flex gap-2 items-center justify-center">
            <History className="h-4 w-4" />
            History
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={() => navigate("/tutorial")} variant="secondary" className="flex gap-2 items-center justify-center">
            <HelpCircle className="h-4 w-4" />
            Tutorial
          </Button>
          
          <Button onClick={() => navigate("/settings")} variant="secondary" className="flex gap-2 items-center justify-center">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
        
        {showLeaderboard && <Button onClick={showLeaderboard} variant="ghost" className="w-full flex gap-2 items-center justify-center" disabled={isGuestMode}>
            <Trophy className="h-4 w-4" />
            {isGuestMode ? 'Sign in for Leaderboard' : 'Show Leaderboard'}
          </Button>}
        
        {onRemoveAds && <Button onClick={onRemoveAds} variant="ghost" className="w-full flex gap-2 items-center justify-center">
            <Tag className="h-4 w-4" />
            Remove Ads
          </Button>}
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 p-4 z-10">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={handlePrevTip}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <p className="text-sm text-zinc-500 italic text-center max-w-[240px]">
            {tips[currentTipIndex]}
          </p>
          <Button variant="ghost" size="icon" onClick={handleNextTip}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>;
};
export default HomeScreen;