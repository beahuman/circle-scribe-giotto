
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Palette, Brush, Sparkles, Lock } from "lucide-react";
import { usePlayerProgress } from "@/hooks/usePlayerProgress";
import { useCosmetics } from "@/hooks/useCosmetics";
import { Progress } from "@/components/ui/progress";

const Store: React.FC = () => {
  const navigate = useNavigate();
  const { level, xp, xpInCurrentLevel, xpForNextLevel, spendXp } = usePlayerProgress();
  const { 
    items, 
    unlockedItems, 
    equippedItems, 
    unlockItem, 
    equipItem
  } = useCosmetics();
  
  const categoryItems = (category: string) => {
    return items.filter(item => item.category === category);
  };
  
  // Handle unlock and equip actions
  const handleItemAction = (itemId: string, cost: number) => {
    const isUnlocked = unlockedItems.includes(itemId);
    
    if (!isUnlocked) {
      // Try to unlock the item
      if (xp >= cost) {
        const success = spendXp(cost);
        if (success) {
          unlockItem(itemId);
          // Add haptic feedback for unlock
          if ('navigator' in window && 'vibrate' in navigator) {
            navigator.vibrate([30, 20, 50]);
          }
        }
      }
    } else {
      // Item is already unlocked, equip it
      equipItem(itemId);
    }
  };
  
  return (
    <div className="container max-w-4xl mx-auto p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="flex gap-2 items-center"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-sm">
              {level}
            </span>
            <span className="font-medium">{xp} XP</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 text-center mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
          Cosmetic Store
        </h1>
        <p className="text-muted-foreground">Spend your XP to unlock exclusive visuals</p>
        
        <div className="max-w-xs mx-auto mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Level {level}</span>
            <span>Level {level + 1}</span>
          </div>
          <Progress value={(xpInCurrentLevel / xpForNextLevel) * 100} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{xpInCurrentLevel} XP</span>
            <span>{xpForNextLevel} XP</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-8">
        {/* Background Themes */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Background Themes</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categoryItems('background').map(item => (
              <StoreItem
                key={item.id}
                item={item}
                isUnlocked={unlockedItems.includes(item.id)}
                isEquipped={equippedItems[item.category] === item.id}
                onAction={() => handleItemAction(item.id, item.cost)}
                playerXp={xp}
              />
            ))}
          </div>
        </section>
        
        {/* Drawing Trail Styles */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Brush className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Drawing Trail Styles</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categoryItems('trail').map(item => (
              <StoreItem
                key={item.id}
                item={item}
                isUnlocked={unlockedItems.includes(item.id)}
                isEquipped={equippedItems[item.category] === item.id}
                onAction={() => handleItemAction(item.id, item.cost)}
                playerXp={xp}
              />
            ))}
          </div>
        </section>
        
        {/* Score Animations */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Score Animations</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categoryItems('animation').map(item => (
              <StoreItem
                key={item.id}
                item={item}
                isUnlocked={unlockedItems.includes(item.id)}
                isEquipped={equippedItems[item.category] === item.id}
                onAction={() => handleItemAction(item.id, item.cost)}
                playerXp={xp}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

interface StoreItemProps {
  item: {
    id: string;
    name: string;
    description: string;
    cost: number;
    thumbnail: string;
    category: string;
  };
  isUnlocked: boolean;
  isEquipped: boolean;
  onAction: () => void;
  playerXp: number;
}

const StoreItem: React.FC<StoreItemProps> = ({ 
  item, 
  isUnlocked, 
  isEquipped, 
  onAction,
  playerXp
}) => {
  const canAfford = playerXp >= item.cost;
  
  return (
    <Card className={`overflow-hidden transition-all ${!isUnlocked ? 'opacity-75' : ''} ${isEquipped ? 'ring-2 ring-primary' : ''}`}>
      <div className="relative aspect-video overflow-hidden bg-muted">
        {!isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <Lock className="h-5 w-5" />
              <span className="text-sm font-medium">Locked</span>
            </div>
          </div>
        )}
        <img 
          src={item.thumbnail} 
          alt={item.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>{item.name}</span>
          <span className="text-sm font-normal text-muted-foreground flex items-center gap-1">
            {item.cost} XP
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        {isUnlocked ? (
          <Button 
            onClick={onAction} 
            variant={isEquipped ? "secondary" : "default"}
            className="w-full"
          >
            {isEquipped ? 'Equipped' : 'Equip'}
          </Button>
        ) : (
          <Button 
            onClick={onAction} 
            disabled={!canAfford} 
            variant="outline"
            className="w-full"
          >
            {canAfford ? `Unlock - ${item.cost} XP` : `Requires ${item.cost} XP`}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Store;
