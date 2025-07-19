import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { smoothPoints } from '@/utils/circleUtils';
import { evaluateShape } from '@/utils/shapes';
import { ShapeChallengeProps, Point, TargetShape } from '@/types/shapes';
import ShapeIcon, { getShapeName } from '@/components/shapes/ShapeIcon';
import ShapeCanvas from '@/components/shapes/ShapeCanvas';
import { generateTargetShape } from '@/utils/shapeGenerator';
import ShapeResultScreen from './shapes/ShapeResultScreen';

const ShapeChallenge: React.FC<ShapeChallengeProps> = ({
  shapeType,
  onComplete,
  difficultyLevel,
  completedShapes,
  totalShapesRequired
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [instructionVisible, setInstructionVisible] = useState(true);
  const [targetShape, setTargetShape] = useState<TargetShape>({ points: [], width: 0, height: 0 });
  const [showingTargetShape, setShowingTargetShape] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [goingToNextShape, setGoingToNextShape] = useState(false);

  // Generate a target shape based on the type
  useEffect(() => {
    setTargetShape(generateTargetShape(shapeType));
    setShowingTargetShape(true);
    // Clear any previous drawing points when shape type changes
    setPoints([]);
  }, [shapeType]);

  // Show target shape for 3 seconds
  useEffect(() => {
    if (showingTargetShape) {
      // Auto-hide target shape after 3 seconds
      const timer = setTimeout(() => {
        setShowingTargetShape(false);
        setInstructionVisible(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showingTargetShape]);

  const handleStart = (x: number, y: number) => {
    if (showingTargetShape) return; // Can't start drawing while target shape is visible
    
    setIsDrawing(true);
    setPoints([{ x, y }]);
    setInstructionVisible(false);
  };

  const handleMove = (x: number, y: number) => {
    if (!isDrawing) return;
    setPoints(prevPoints => [...prevPoints, { x, y }]);
  };

  const handleEnd = () => {
    if (!isDrawing || showingTargetShape) return;
    setIsDrawing(false);
    
    if (points.length >= 2) {
      const drawingPrecision = Number(localStorage.getItem('drawingPrecision')) || 50;
      const smoothedPoints = smoothPoints(points, Math.max(30, drawingPrecision));
      
      // Calculate accuracy compared to the target shape
      const accuracy = evaluateShape(smoothedPoints, targetShape.points, shapeType);
      setAccuracy(accuracy);
      setShowResults(true);
      
      // Determine if we're going to the next shape (for feedback messaging)
      const isPassing = accuracy >= 50;
      const isLast = completedShapes === totalShapesRequired - 1;
      setGoingToNextShape(isPassing && !isLast);
    }
  };

  const handleFinishResults = () => {
    const scoreGoodEnough = accuracy >= 50;
    setShowResults(false);
    
    // Reset for another attempt if score is too low
    if (!scoreGoodEnough) {
      setPoints([]);
      setShowingTargetShape(true);
      return;
    }
    
    // Clear the drawing points before completing this challenge
    setPoints([]);
    // Otherwise complete this challenge
    onComplete(accuracy);
  };

  const pointerEventHandlers = {
    onMouseDown: (e: React.MouseEvent) => handleStart(e.clientX, e.clientY),
    onMouseMove: (e: React.MouseEvent) => handleMove(e.clientX, e.clientY),
    onMouseUp: handleEnd,
    onMouseLeave: handleEnd,
    onTouchStart: (e: React.TouchEvent) => {
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    },
    onTouchMove: (e: React.TouchEvent) => {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    },
    onTouchEnd: handleEnd
  };

  if (showResults) {
    return (
      <ShapeResultScreen 
        accuracy={accuracy}
        shapeType={shapeType}
        onContinue={handleFinishResults}
        isLastShape={completedShapes === totalShapesRequired - 1}
        points={points}
        targetShape={targetShape}
        goingToNextShape={goingToNextShape}
      />
    );
  }

  return (
    <div className="absolute inset-0">
      {showingTargetShape && (
        <div className="fixed top-6 inset-x-0 mx-auto w-fit bg-primary px-6 py-2 rounded-full backdrop-blur-sm animate-fade-in z-10">
          <div className="flex items-center gap-2 text-white">
            <span>Memorize this {getShapeName(shapeType)}</span>
            <ShapeIcon shapeType={shapeType} />
          </div>
        </div>
      )}
      
      {!showingTargetShape && instructionVisible && (
        <div className="fixed top-6 inset-x-0 mx-auto w-fit bg-primary px-6 py-2 rounded-full backdrop-blur-sm animate-fade-in z-10">
          <div className="flex items-center gap-2 text-white">
            <span>Now draw the {getShapeName(shapeType)}</span>
            <ShapeIcon shapeType={shapeType} />
          </div>
        </div>
      )}
      
      <div className="fixed top-16 inset-x-0 mx-auto w-fit px-6 py-2 rounded-full z-10">
        <div className="text-sm text-muted-foreground">
          Challenge {completedShapes + 1} of {totalShapesRequired}
        </div>
      </div>
      
      <div {...pointerEventHandlers} className="w-full h-full">
        <ShapeCanvas 
          points={points}
          targetShape={targetShape}
          showingTargetShape={showingTargetShape}
        />
      </div>
    </div>
  );
};

export default ShapeChallenge;
