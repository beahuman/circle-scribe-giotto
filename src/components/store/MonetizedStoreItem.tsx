import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Loader2, Crown, Sparkles } from 'lucide-react';
import { MonetizationItem } from '@/hooks/useMonetization';

interface MonetizedStoreItemProps {
  item: MonetizationItem;
  isUnlocked: boolean;
  isPurchased: boolean;
  isPending: boolean;
  isEquipped: boolean;
  canAffordXP: boolean;
  playerXp: number;
  onUnlockWithXP: () => void;
  onPurchase: () => void;
  onEquip: () => void;
}

export const MonetizedStoreItem: React.FC<MonetizedStoreItemProps> = ({
  item,
  isUnlocked,
  isPurchased,
  isPending,
  isEquipped,
  canAffordXP,
  playerXp,
  onUnlockWithXP,
  onPurchase,
  onEquip
}) => {
  const isAvailable = isUnlocked || isPurchased;
  
  const getCostDisplay = () => {
    if (item.isPremium && item.price) {
      return `$${(item.price / 100).toFixed(2)}`;
    }
    if (!item.isPremium && item.cost > 0) {
      return `${item.cost} XP`;
    }
    return 'Free';
  };

  const getButtonContent = () => {
    if (isPending) {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Processing...
        </>
      );
    }
    
    if (isAvailable) {
      if (isEquipped) {
        return 'Equipped';
      }
      return 'Equip';
    }
    
    if (item.isPremium) {
      return `Purchase - $${(item.price! / 100).toFixed(2)}`;
    }
    
    if (canAffordXP) {
      return `Unlock - ${item.cost} XP`;
    }
    
    return `Requires ${item.cost} XP`;
  };

  const getButtonAction = () => {
    if (isAvailable) {
      return onEquip;
    }
    
    if (item.isPremium) {
      return onPurchase;
    }
    
    return onUnlockWithXP;
  };

  const getButtonVariant = () => {
    if (isPending) return 'secondary';
    if (isEquipped) return 'secondary';
    if (item.isPremium) return 'default';
    if (canAffordXP) return 'outline';
    return 'outline';
  };

  return (
    <Card 
      className={`
        overflow-hidden transition-all duration-300 
        ${!isAvailable ? 'opacity-75' : ''} 
        ${isEquipped ? 'ring-2 ring-primary' : ''} 
        ${item.isPremium ? 'border-amber-200 bg-gradient-to-br from-amber-50/30 to-orange-50/30' : ''}
        ${item.category === 'supporter' ? 'border-amber-300 bg-gradient-to-br from-amber-100/50 to-yellow-100/50' : ''}
      `}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {/* Premium badge */}
        {item.isPremium && (
          <Badge 
            variant="secondary" 
            className="absolute top-2 left-2 bg-amber-100 text-amber-800 border-amber-200"
          >
            {item.category === 'supporter' ? (
              <>
                <Crown className="h-3 w-3 mr-1" />
                Patron
              </>
            ) : item.isBundle ? (
              <>
                <Sparkles className="h-3 w-3 mr-1" />
                Bundle
              </>
            ) : (
              'Premium'
            )}
          </Badge>
        )}
        
        {/* Lock overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
            <div className="flex flex-col items-center gap-2">
              <Lock className="h-5 w-5" />
              <span className="text-sm font-medium">Locked</span>
            </div>
          </div>
        )}
        
        {/* Item thumbnail */}
        <img 
          src={item.thumbnail} 
          alt={item.name} 
          className="w-full h-full object-cover"
        />
        
        {/* Preview animation overlay (for supported items) */}
        {item.previewAnimation && isAvailable && (
          <div className="absolute bottom-2 right-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          </div>
        )}
      </div>
      
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg flex justify-between items-start">
          <span className="line-clamp-1">{item.name}</span>
          <div className="flex flex-col items-end gap-1">
            <span className="text-sm font-normal text-muted-foreground">
              {getCostDisplay()}
            </span>
            {!item.isPremium && item.price && (
              <span className="text-xs text-muted-foreground line-through">
                ${(item.price / 100).toFixed(2)}
              </span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>
        
        {/* Bundle contents preview */}
        {item.isBundle && (
          <div className="mt-2 text-xs text-muted-foreground">
            <span>Includes: Theme + Brush + Animation</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={getButtonAction()}
          disabled={isPending || (!canAffordXP && !item.isPremium && !isAvailable)}
          variant={getButtonVariant()}
          className={`
            w-full transition-all duration-200
            ${item.isPremium ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white' : ''}
            ${item.category === 'supporter' ? 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white' : ''}
          `}
        >
          {getButtonContent()}
        </Button>
      </CardFooter>
    </Card>
  );
};