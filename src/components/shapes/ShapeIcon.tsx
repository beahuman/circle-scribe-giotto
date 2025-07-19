
import React from 'react';
import { CheckSquare, Triangle, FlipHorizontal } from "lucide-react";
import { ShapeType } from '@/types/shapes';

interface ShapeIconProps {
  shapeType: ShapeType;
  className?: string;
}

const ShapeIcon: React.FC<ShapeIconProps> = ({ shapeType, className = "h-6 w-6" }) => {
  switch (shapeType) {
    case 'line': 
      return <FlipHorizontal className={className} strokeWidth={1.5} />;
    case 'triangle': 
      return <Triangle className={className} strokeWidth={1.5} />;
    case 'square': 
      return <CheckSquare className={className} strokeWidth={1.5} />;
    default:
      return null;
  }
};

export const getShapeName = (shapeType: ShapeType): string => {
  return shapeType.charAt(0).toUpperCase() + shapeType.slice(1);
};

export default ShapeIcon;
