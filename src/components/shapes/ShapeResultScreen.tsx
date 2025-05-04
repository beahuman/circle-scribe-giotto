
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShapeType, Point, TargetShape } from '@/types/shapes';
import { getShapeName } from './ShapeIcon';

interface ShapeResultScreenProps {
  accuracy: number;
  shapeType: ShapeType;
  onContinue: () => void;
  isLastShape: boolean;
  points: Point[];
  targetShape: TargetShape;
  goingToNextShape: boolean;
}

const ShapeResultScreen: React.FC<ShapeResultScreenProps> = ({
  accuracy,
  shapeType,
  onContinue,
  isLastShape,
  points,
  targetShape,
  goingToNextShape
}) => {
  const roundedAccuracy = Math.round(accuracy * 100) / 100;
  const isPassing = roundedAccuracy >= 50;
  
  const getShapeFeedback = (score: number, shape: ShapeType): string => {
    if (score >= 90) {
      switch(shape) {
        case 'line': return "That's so straight it could be a ruler. Beginner's luck?";
        case 'triangle': return "Triangle master! Did you use a protractor or something?";
        case 'square': return "Perfect square! What are you, some kind of geometry teacher?";
        default: return "Impressive! Almost suspiciously good...";
      }
    }
    else if (score >= 70) {
      switch(shape) {
        case 'line': return "Not bad for someone who probably can't draw a straight line with a ruler.";
        case 'triangle': return "Your triangle is decent. My cat could do better though.";
        case 'square': return "Almost square-like. You're halfway to becoming a human ruler.";
        default: return "Not terrible, but not amazing either.";
      }
    }
    else if (score >= 50) {
      switch(shape) {
        case 'line': return "That line is as straight as my career path. Barely passing.";
        case 'triangle': return "I've seen better triangles in preschool art class, but it'll do.";
        case 'square': return "That's more of a rhombus on a bad day, but I'll accept it.";
        default: return "Barely passing. My expectations were low, but wow.";
      }
    }
    else {
      switch(shape) {
        case 'line': return "That's what you call a straight line? My grandma could do better with her eyes closed!";
        case 'triangle': return "That triangle has more issues than a soap opera. Try again!";
        case 'square': return "If that's a square, I'm a flying unicorn. Let's try one more time.";
        default: return "Ouch. That was painful to watch. Another attempt might help!";
      }
    }
  };
  
  const getNextStepMessage = (): string => {
    if (!isPassing) {
      return `Try drawing the ${getShapeName(shapeType)} again. You can do it!`;
    }
    
    if (isLastShape) {
      return "Congratulations! You've completed all shape challenges. Now back to circles!";
    }
    
    return "Nice job! Moving on to the next shape challenge.";
  };
  
  // Calculate the visualization container size
  const containerSize = 200;
  const centerX = containerSize / 2;
  const centerY = containerSize / 2;
  
  // Find bounds of drawn shape
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  points.forEach(point => {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  });
  
  // Calculate scale factor to fit in container
  const drawnWidth = maxX - minX;
  const drawnHeight = maxY - minY;
  const drawnCenterX = minX + drawnWidth / 2;
  const drawnCenterY = minY + drawnHeight / 2;
  
  const scaleFactor = Math.min(
    (containerSize * 0.8) / (drawnWidth || 1), 
    (containerSize * 0.8) / (drawnHeight || 1)
  );
  
  const transformedDrawnPoints = points.map(point => ({
    x: centerX + (point.x - drawnCenterX) * scaleFactor,
    y: centerY + (point.y - drawnCenterY) * scaleFactor
  }));
  
  return (
    <div className="flex flex-col items-center justify-center gap-6 animate-fade-in p-6 pb-24 text-center">
      <div className="space-y-2 mt-10">
        <h2 className="text-2xl font-bold">{getShapeName(shapeType)} Result</h2>
        <p className="text-muted-foreground">How well did you draw?</p>
      </div>
      
      {/* Visualization of the shape results */}
      <div className="relative w-[200px] h-[200px] mx-auto my-6 rounded-lg bg-gradient-to-br from-background to-muted/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-full h-full pointer-events-none">
            <path
              d={transformedDrawnPoints.length > 0 ? 
                `M ${transformedDrawnPoints[0].x} ${transformedDrawnPoints[0].y} 
                 ${transformedDrawnPoints.map(p => `L ${p.x} ${p.y}`).join(' ')}` : ''}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          {isPassing && (
            <div className="absolute bg-green-500/20 w-10 h-10 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="text-4xl font-bold text-primary">
          {roundedAccuracy}%
        </div>
        
        <p className="text-muted-foreground max-w-xs mx-auto">
          {getShapeFeedback(roundedAccuracy, shapeType)}
        </p>
        
        <p className="text-sm text-muted-foreground mt-4">
          {getNextStepMessage()}
        </p>
        
        {/* Additional message about next shape challenge */}
        {isPassing && !isLastShape && goingToNextShape && (
          <p className="text-sm text-primary font-medium mt-2">
            Get ready for the next shape challenge!
          </p>
        )}
      </div>
      
      <Button 
        onClick={onContinue}
        className="px-8 py-6 text-lg rounded-full bg-gradient-to-r from-primary to-purple-400 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 mt-4"
      >
        {isPassing ? (isLastShape ? "Back to Circle Drawing" : "Next Shape") : "Try Again"}
      </Button>
    </div>
  );
};

export default ShapeResultScreen;
