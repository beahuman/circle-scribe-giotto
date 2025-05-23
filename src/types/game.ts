
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
