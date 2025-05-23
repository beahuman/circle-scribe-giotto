
import { ShapeType } from './shapes';

export type GameState = 'showing' | 'drawing' | 'result' | 'penalty';
export type PenaltyShape = 'line' | 'triangle' | 'square' | null;

export interface GameProps {
  onReturnToHome?: () => void;
  onRemoveAds?: () => void;
}

export interface MobileWarningProps {
  onBypassMobile: () => void;
}

export interface CosmeticItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  thumbnail: string;
  category: string;
  value: string;
}
