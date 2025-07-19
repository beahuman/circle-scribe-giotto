
import React from 'react';
import { ShapeType } from '@/types/shapes';
import { getShapeName } from './ShapeIcon';

interface NextStepMessageProps {
  isPassing: boolean;
  isLastShape: boolean;
  shapeType: ShapeType;
  goingToNextShape: boolean;
}

const NextStepMessage: React.FC<NextStepMessageProps> = ({
  isPassing,
  isLastShape,
  shapeType,
  goingToNextShape
}) => {
  const getNextStepMessage = (): string => {
    if (!isPassing) {
      return `Try drawing the ${getShapeName(shapeType)} again. You can do it!`;
    }
    
    if (isLastShape) {
      return "Congratulations! You've completed all shape challenges. Now back to circles!";
    }
    
    return "Nice job! Moving on to the next shape challenge.";
  };

  return (
    <div className="space-y-2">
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
  );
};

export default NextStepMessage;
