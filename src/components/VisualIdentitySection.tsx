
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Palette, Brush, Eye, Settings, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useBrushSystem } from '@/hooks/useBrushSystem';
import { useToneSystem } from '@/hooks/useToneSystem';
import { useCosmetics } from '@/hooks/useCosmetics';
import { useVisualFavorites } from '@/hooks/useVisualFavorites';
import { BRUSH_STYLES } from '@/utils/brushStyles';
import { TONE_THEMES } from '@/utils/toneMessages';

interface VisualIdentitySectionProps {
  tone: string;
}

const VisualIdentitySection: React.FC<VisualIdentitySectionProps> = ({ tone }) => {
  const { 
    selectedBrush, 
    getUnlockedBrushes, 
    getLockedBrushes, 
    selectBrush, 
    isBrushUnlocked 
  } = useBrushSystem();
  
  const { 
    selectedTone, 
    toneUsage, 
    unlockedThemes, 
    isThemeUnlocked, 
    getMostUsedTone 
  } = useToneSystem();
  
  const { items: cosmeticItems, unlockedItems, equippedItems } = useCosmetics();
  
  const {
    favorites,
    quickSwapEnabled,
    toggleQuickSwap,
    addFavorite,
    removeFavorite,
    isFavorite
  } = useVisualFavorites();

  const [activeTab, setActiveTab] = useState<'themes' | 'brushes'>('themes');

  const unlockedBrushes = getUnlockedBrushes();
  const lockedBrushes = getLockedBrushes();

  const themeItems = Object.entries(TONE_THEMES).map(([key, theme]) => ({
    id: key,
    name: theme.name,
    description: theme.description,
    unlocked: isThemeUnlocked(key as any),
    active: selectedTone === key,
    preview: theme.visualStyle.background
  }));

  const brushItems = [...unlockedBrushes, ...lockedBrushes].map(brush => ({
    ...brush,
    unlocked: isBrushUnlocked(brush.id),
    active: selectedBrush === brush.id
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65 }}
      className="space-y-8"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="h-5 w-5" />
            Visual Customization
          </CardTitle>
          <div className="flex items-center gap-2">
            <Switch
              checked={quickSwapEnabled}
              onCheckedChange={toggleQuickSwap}
              id="quick-swap"
            />
            <label htmlFor="quick-swap" className="text-sm text-muted-foreground">
              Quick Swap ({favorites.length}/3 favorites)
            </label>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-muted p-1 rounded-xl">
            <Button
              variant={activeTab === 'themes' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('themes')}
              className="flex-1"
            >
              <Palette className="h-4 w-4 mr-2" />
              Themes ({themeItems.filter(t => t.unlocked).length})
            </Button>
            <Button
              variant={activeTab === 'brushes' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('brushes')}
              className="flex-1"
            >
              <Brush className="h-4 w-4 mr-2" />
              Brushes ({unlockedBrushes.length})
            </Button>
          </div>

          {/* Enhanced Themes Grid - Improved sizing and layout */}
          {activeTab === 'themes' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {themeItems.map((theme, index) => (
                <motion.div
                  key={theme.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: theme.unlocked ? 1.02 : 1 }}
                  whileTap={{ scale: theme.unlocked ? 0.98 : 1 }}
                  className={`relative p-5 rounded-xl border-2 transition-all cursor-pointer group min-h-[180px] ${
                    theme.unlocked 
                      ? theme.active 
                        ? 'border-primary bg-primary/10 shadow-lg' 
                        : 'border-border hover:border-primary/50 bg-card hover:shadow-md'
                      : 'border-border bg-muted/30 opacity-60 cursor-not-allowed grayscale'
                  }`}
                  onClick={() => theme.unlocked && /* switch theme logic */ null}
                >
                  {/* Large preview area */}
                  <div className={`w-full h-20 rounded-xl mb-4 ${theme.preview || 'bg-gradient-to-r from-primary to-purple-400'}`} />
                  
                  {/* Lock overlay for locked themes */}
                  {!theme.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                      <div className="bg-background/90 rounded-full p-3">
                        <span className="text-2xl">🔒</span>
                      </div>
                    </div>
                  )}

                  {/* Unlock glow for newly unlocked */}
                  {theme.unlocked && index < 2 && (
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-primary/10 pointer-events-none"
                      animate={{ opacity: [0, 0.3, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  
                  <div className="space-y-3 flex flex-col h-full">
                    <div className="flex items-start justify-between min-h-[24px]">
                      <h4 className="font-semibold text-sm leading-tight">{theme.name}</h4>
                      <div className="flex gap-1 flex-shrink-0 ml-2">
                        {theme.active && <Badge variant="secondary" className="text-xs">Active</Badge>}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                      {theme.description}
                    </p>
                    
                    {theme.unlocked && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto text-xs w-full justify-start hover:bg-transparent mt-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isFavorite('theme', theme.id)) {
                            removeFavorite('theme', theme.id);
                          } else {
                            addFavorite('theme', theme.id, theme.name);
                          }
                        }}
                      >
                        <Heart className={`h-3 w-3 mr-1 flex-shrink-0 ${isFavorite('theme', theme.id) ? 'fill-current text-red-500' : 'text-muted-foreground'}`} />
                        <span className="truncate">{isFavorite('theme', theme.id) ? 'Favorited' : 'Add to Favorites'}</span>
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Enhanced Brushes Grid - Improved sizing and layout */}
          {activeTab === 'brushes' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {brushItems.map((brush, index) => (
                <motion.div
                  key={brush.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: brush.unlocked ? 1.02 : 1 }}
                  whileTap={{ scale: brush.unlocked ? 0.98 : 1 }}
                  className={`relative p-5 rounded-xl border-2 transition-all cursor-pointer group min-h-[180px] ${
                    brush.unlocked 
                      ? brush.active 
                        ? 'border-primary bg-primary/10 shadow-lg' 
                        : 'border-border hover:border-primary/50 bg-card hover:shadow-md'
                      : 'border-border bg-muted/30 opacity-60 cursor-not-allowed grayscale'
                  }`}
                  onClick={() => brush.unlocked && selectBrush(brush.id)}
                >
                  {/* Animated stroke preview */}
                  <div className="w-full h-16 mb-4 flex items-center justify-center bg-muted/20 rounded-xl">
                    <motion.div
                      className="w-24 h-1 rounded bg-primary"
                      animate={{ scaleX: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      style={{ 
                        transformOrigin: 'left',
                        backgroundColor: brush.effectColor || 'rgb(118, 94, 216)'
                      }}
                    />
                  </div>

                  {/* Lock overlay for locked brushes */}
                  {!brush.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                      <div className="bg-background/90 rounded-full p-3">
                        <span className="text-2xl">🔒</span>
                      </div>
                    </div>
                  )}

                  {/* Unlock glow for newly unlocked */}
                  {brush.unlocked && index < 2 && (
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-primary/10 pointer-events-none"
                      animate={{ opacity: [0, 0.3, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  
                  <div className="space-y-3 flex flex-col h-full">
                    <div className="flex items-start justify-between min-h-[24px]">
                      <h4 className="font-semibold text-sm leading-tight">{brush.name}</h4>
                      <div className="flex gap-1 flex-shrink-0 ml-2">
                        {brush.active && <Badge variant="secondary" className="text-xs">Active</Badge>}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                      {brush.description}
                    </p>
                    
                    {brush.unlocked ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto text-xs w-full justify-start hover:bg-transparent mt-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isFavorite('brush', brush.id)) {
                            removeFavorite('brush', brush.id);
                          } else {
                            addFavorite('brush', brush.id, brush.name);
                          }
                        }}
                      >
                        <Heart className={`h-3 w-3 mr-1 flex-shrink-0 ${isFavorite('brush', brush.id) ? 'fill-current text-red-500' : 'text-muted-foreground'}`} />
                        <span className="truncate">{isFavorite('brush', brush.id) ? 'Favorited' : 'Add to Favorites'}</span>
                      </Button>
                    ) : (
                      <div className="text-xs text-muted-foreground mt-auto pt-2 line-clamp-2">
                        {brush.unlockCondition}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Customize More Button */}
          <div className="pt-4 border-t">
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/settings'}>
              <Settings className="h-4 w-4 mr-2" />
              More Customization Options
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VisualIdentitySection;
