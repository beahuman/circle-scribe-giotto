import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrawingState } from '@/hooks/useDrawingState';
import CanvasRenderer from '@/components/drawing/CanvasRenderer';
import InstructionOverlay from '@/components/drawing/InstructionOverlay';
import { generateRandomCirclePosition } from '@/utils/circleGeneration';
import { Point } from '@/types/shapes';
import { useToneSystem } from '@/hooks/useToneSystem';
import { useInfinitePracticeMode } from '@/hooks/useInfinitePracticeMode';

interface InfinitePracticeCanvasProps {
  targetCircle: { x: number; y: number; radius: number };
}

const InfinitePracticeCanvas: React.FC<InfinitePracticeCanvasProps> = ({ 
  targetCircle: initialTargetCircle 
}) => {
  const [targetCircle, setTargetCircle] = useState(initialTargetCircle);
  const [showResult, setShowResult] = useState(false);
  const [completedPoints, setCompletedPoints] = useState<Point[]>([]);
  const [autoRhythmTimer, setAutoRhythmTimer] = useState<NodeJS.Timeout | null>(null);
  const [roundCount, setRoundCount] = useState(0);
  
  const { getMotivationalPhraseForTone } = useToneSystem();
  const { 
    autoRhythmEnabled, 
    visualFeedbackEnabled, 
    recordPracticeRound 
  } = useInfinitePracticeMode();
  
  const {
    isDrawing,
    points,
    drawingPoints,
    instructionVisible,
    showGhostCircle,
    handleStart,
    handleMove,
    handleEnd,
  } = useDrawingState();

  // Auto rhythm mode - new circle every 10 seconds
  useEffect(() => {
    if (autoRhythmEnabled && !isDrawing && !showResult) {
      const timer = setTimeout(() => {
        generateNewCircle();
      }, 10000);
      setAutoRhythmTimer(timer);
      return () => clearTimeout(timer);
    }
  }, [autoRhythmEnabled, isDrawing, showResult, roundCount]);

  const generateNewCircle = useCallback(() => {
    const newCircle = generateRandomCirclePosition();
    setTargetCircle(newCircle);
    setShowResult(false);
    setCompletedPoints([]);
    if (autoRhythmTimer) {
      clearTimeout(autoRhythmTimer);
      setAutoRhythmTimer(null);
    }
  }, [autoRhythmTimer]);

  const handleDrawingComplete = useCallback(() => {
    if (points.length < 3) return;
    
    setCompletedPoints([...points]);
    setShowResult(true);
    recordPracticeRound();
    setRoundCount(prev => prev + 1);
    
    // Show result for 3-5 seconds then fade and reset
    setTimeout(() => {
      generateNewCircle();
    }, 4000);
  }, [points, recordPracticeRound, generateNewCircle]);

  // Show zen message every 3-5 rounds
  const shouldShowMessage = roundCount > 0 && roundCount % 4 === 0;
  const zenMessage = shouldShowMessage ? getMotivationalPhraseForTone() : null;

  return (
    <div className="relative h-full w-full bg-gradient-to-br from-background via-background/95 to-muted/30 overflow-hidden">
      {/* Subtle breathing background animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 animate-pulse opacity-30" />
      
      {/* Instruction overlay */}
      <InstructionOverlay 
        visible={instructionVisible && !showResult} 
        message="Draw freely. No score. Just flow."
        position="top"
        variant="secondary"
        animateIn={true}
      />
      
      {/* Auto rhythm indicator */}
      <AnimatePresence>
        {autoRhythmEnabled && instructionVisible && !showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10"
          >
            <div className="bg-background/60 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md border border-border/30">
              <p className="text-sm text-muted-foreground">Auto rhythm: New circle every 10 seconds</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zen message overlay */}
      <AnimatePresence>
        {zenMessage && showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-1/4 left-1/2 transform -translate-x-1/2 z-10"
          >
            <div className="bg-background/90 backdrop-blur-md rounded-lg px-8 py-4 shadow-xl border border-border/30">
              <p className="text-base text-foreground/90 font-medium text-center max-w-sm">
                {zenMessage}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main drawing interface */}
      <div 
        className="w-full h-full select-none"
        onMouseDown={(e) => {
          e.preventDefault();
          const rect = e.currentTarget.getBoundingClientRect();
          handleStart(e.clientX - rect.left, e.clientY - rect.top);
        }}
        onMouseMove={(e) => {
          if (isDrawing) {
            const rect = e.currentTarget.getBoundingClientRect();
            handleMove(e.clientX - rect.left, e.clientY - rect.top);
          }
        }}
        onMouseUp={() => {
          handleEnd();
          if (!isDrawing && points.length >= 3) {
            handleDrawingComplete();
          }
        }}
        onMouseLeave={() => {
          handleEnd();
          if (!isDrawing && points.length >= 3) {
            handleDrawingComplete();
          }
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          const touch = e.touches[0];
          const rect = e.currentTarget.getBoundingClientRect();
          handleStart(touch.clientX - rect.left, touch.clientY - rect.top);
        }}
        onTouchMove={(e) => {
          e.preventDefault();
          if (e.touches.length === 1) {
            const touch = e.touches[0];
            const rect = e.currentTarget.getBoundingClientRect();
            handleMove(touch.clientX - rect.left, touch.clientY - rect.top);
          }
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          handleEnd();
          if (!isDrawing && points.length >= 3) {
            handleDrawingComplete();
          }
        }}
        style={{ 
          touchAction: 'none',
          userSelect: 'none',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none'
        }}
      >
        <CanvasRenderer 
          drawingPoints={drawingPoints}
          targetCircle={targetCircle}
          showGhostCircle={showGhostCircle && visualFeedbackEnabled}
          strokeQuality={1}
          showCompletedDrawing={showResult}
        />
      </div>

      {/* Soft pulse animation on completion */}
      <AnimatePresence>
        {showResult && visualFeedbackEnabled && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${targetCircle.x}px ${targetCircle.y}px, hsl(var(--primary)) 0%, transparent 30%)`
            }}
          />
        )}
      </AnimatePresence>

      {/* Continue prompt */}
      <AnimatePresence>
        {showResult && !autoRhythmEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          >
            <motion.button
              onClick={generateNewCircle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-background/80 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg border border-border/50 hover:bg-background/90 transition-colors"
            >
              <p className="text-foreground/80 font-medium">Tap to continue</p>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InfinitePracticeCanvas;