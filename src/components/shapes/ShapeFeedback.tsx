
import React from 'react';
import { ShapeType } from '@/types/shapes';
import { useToneSystem } from '@/hooks/useToneSystem';

interface ShapeFeedbackProps {
  score: number;
  shapeType: ShapeType;
}

const ShapeFeedback: React.FC<ShapeFeedbackProps> = ({ score, shapeType }) => {
  const { getScoreMessageForTone } = useToneSystem();
  const getFeedbackMessage = (score: number, shape: ShapeType): string => {
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

  // Use tone system for consistent feedback, fallback to shape-specific for variety
  const message = score >= 80 ? getScoreMessageForTone(score) : getFeedbackMessage(score, shapeType);

  return (
    <p className="text-muted-foreground max-w-xs mx-auto">
      {message}
    </p>
  );
};

export default ShapeFeedback;
