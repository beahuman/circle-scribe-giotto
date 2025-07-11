import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Palette, Brush, Eye, Settings } from 'lucide-react';
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
    isFavorite,
    getStyleInsights
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

  const insights = getStyleInsights();

  const getInsightMessage = (insight: string) => {
    switch (tone) {
      case 'sarcastic':
        return insight.replace('You', 'Wow, you really');
      case 'formal':
        return `Analysis: ${insight}`;
      case 'meditative':
        return insight.replace('You', 'Your journey shows');
      default:
        return insight;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="h-5 w-5" />
            Your Visual Identity
          </CardTitle>
          <div className="flex items-center gap-2">
            <Switch
              checked={quickSwapEnabled}
              onCheckedChange={toggleQuickSwap}
              id="quick-swap"
            />
            <label htmlFor="quick-swap" className="text-sm text-muted-foreground">
              Enable Quick Swap ({favorites.length}/3 favorites)
            </label>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Style Insights */}
          <Card className="bg-gradient-to-r from-primary/5 to-purple-400/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Eye className="h-4 w-4" />
                Style Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-muted-foreground">Most-Used Brush</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-8 h-2 bg-primary rounded opacity-60"></div>
                    <span>{insights.mostUsedBrush}</span>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-muted-foreground">Most-Used Theme</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-4 h-4 bg-gradient-to-br from-primary to-purple-400 rounded"></div>
                    <span>{insights.mostUsedTheme}</span>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="font-medium text-muted-foreground">Visual Streak</div>
                  <div className="text-caption mt-1">
                    {getInsightMessage(insights.longestStreak)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
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

          {/* Themes Grid */}
          {activeTab === 'themes' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {themeItems.map((theme, index) => (
                <motion.div
                  key={theme.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    theme.unlocked 
                      ? theme.active 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50 bg-card'
                      : 'border-border bg-muted/30 opacity-60 cursor-not-allowed'
                  }`}
                  onClick={() => theme.unlocked && /* switch theme logic */ null}
                >
                  <div className={`w-full h-8 rounded mb-2 ${theme.preview || 'bg-gradient-to-r from-primary to-purple-400'}`} />
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{theme.name}</h4>
                      <div className="flex gap-1">
                        {theme.active && <Badge variant="secondary" className="text-xs">Active</Badge>}
                        {!theme.unlocked && <span className="text-muted-foreground">🔒</span>}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{theme.description}</p>
                    
                    {theme.unlocked && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isFavorite('theme', theme.id)) {
                            removeFavorite('theme', theme.id);
                          } else {
                            addFavorite('theme', theme.id, theme.name);
                          }
                        }}
                      >
                        <Star className={`h-3 w-3 mr-1 ${isFavorite('theme', theme.id) ? 'fill-current text-yellow-500' : ''}`} />
                        {isFavorite('theme', theme.id) ? 'Favorited' : 'Favorite'}
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Brushes Grid */}
          {activeTab === 'brushes' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {brushItems.map((brush, index) => (
                <motion.div
                  key={brush.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    brush.unlocked 
                      ? brush.active 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50 bg-card'
                      : 'border-border bg-muted/30 opacity-60 cursor-not-allowed'
                  }`}
                  onClick={() => brush.unlocked && selectBrush(brush.id)}
                >
                  {/* Animated stroke preview */}
                  <div className="w-full h-8 mb-2 flex items-center justify-center">
                    <motion.div
                      className="w-16 h-1 rounded bg-primary"
                      animate={{ scaleX: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      style={{ 
                        transformOrigin: 'left',
                        backgroundColor: brush.effectColor || 'rgb(118, 94, 216)'
                      }}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{brush.name}</h4>
                      <div className="flex gap-1">
                        {brush.active && <Badge variant="secondary" className="text-xs">Active</Badge>}
                        {!brush.unlocked && <span className="text-muted-foreground">🔒</span>}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{brush.description}</p>
                    
                    {brush.unlocked && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isFavorite('brush', brush.id)) {
                            removeFavorite('brush', brush.id);
                          } else {
                            addFavorite('brush', brush.id, brush.name);
                          }
                        }}
                      >
                        <Star className={`h-3 w-3 mr-1 ${isFavorite('brush', brush.id) ? 'fill-current text-yellow-500' : ''}`} />
                        {isFavorite('brush', brush.id) ? 'Favorited' : 'Favorite'}
                      </Button>
                    )}
                  </div>
                  
                  {!brush.unlocked && (
                    <div className="text-xs text-muted-foreground mt-2">
                      {brush.unlockCondition}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Customize More Button */}
          <div className="pt-4 border-t">
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/settings'}>
              <Settings className="h-4 w-4 mr-2" />
              Customize More
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VisualIdentitySection;