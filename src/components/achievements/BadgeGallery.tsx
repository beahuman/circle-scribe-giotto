import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Share2, Lock, Calendar, Award, TrendingUp } from 'lucide-react';
import { useBadgeSystem } from '@/hooks/useBadgeSystem';
import { format } from 'date-fns';

interface BadgeGalleryProps {
  className?: string;
}

const BadgeGallery: React.FC<BadgeGalleryProps> = ({ className = '' }) => {
  const { getBadgeProgress, shareBadge, loading } = useBadgeSystem();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBadge, setSelectedBadge] = useState<any>(null);

  const badgeProgress = getBadgeProgress();
  
  const categories = [
    { id: 'all', name: 'All', icon: Award },
    { id: 'accuracy', name: 'Accuracy', icon: TrendingUp },
    { id: 'streak', name: 'Streaks', icon: Calendar },
    { id: 'improvement', name: 'Growth', icon: TrendingUp },
    { id: 'volume', name: 'Practice', icon: Award },
    { id: 'milestone', name: 'Milestones', icon: Award },
    { id: 'special', name: 'Special', icon: Award }
  ];

  const rarityOrder = ['mythic', 'legendary', 'epic', 'rare', 'uncommon', 'common'];
  const rarityColors = {
    common: 'bg-slate-100 text-slate-700 border-slate-200',
    uncommon: 'bg-green-100 text-green-700 border-green-200',
    rare: 'bg-blue-100 text-blue-700 border-blue-200',
    epic: 'bg-purple-100 text-purple-700 border-purple-200',
    legendary: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    mythic: 'bg-gradient-to-r from-pink-100 to-purple-100 text-purple-800 border-purple-300'
  };

  const filteredBadges = badgeProgress
    .filter(bp => selectedCategory === 'all' || bp.badge.category === selectedCategory)
    .sort((a, b) => {
      // Sort unlocked badges first, then by rarity
      if (a.unlocked !== b.unlocked) {
        return a.unlocked ? -1 : 1;
      }
      return rarityOrder.indexOf(a.badge.rarity) - rarityOrder.indexOf(b.badge.rarity);
    });

  const unlockedCount = badgeProgress.filter(bp => bp.unlocked).length;
  const totalCount = badgeProgress.length;

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="aspect-square">
              <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                <div className="w-12 h-12 bg-muted rounded-full animate-pulse mb-2" />
                <div className="w-16 h-4 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Progress Overview */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Achievement Gallery</h2>
        <p className="text-muted-foreground">
          {unlockedCount} of {totalCount} badges unlocked
        </p>
        <div className="w-full bg-muted rounded-full h-2 max-w-md mx-auto">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          {categories.map(category => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="text-xs"
            >
              <category.icon className="h-4 w-4 mr-1" />
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredBadges.map((badgeProgress, index) => (
                <motion.div
                  key={badgeProgress.badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card 
                        className={`aspect-square cursor-pointer transition-all duration-300 hover:scale-105 relative overflow-hidden ${
                          badgeProgress.unlocked 
                            ? 'ring-2 ring-primary/20 shadow-lg' 
                            : 'opacity-60 grayscale'
                        }`}
                        onClick={() => setSelectedBadge(badgeProgress)}
                      >
                        <CardContent className="p-4 flex flex-col items-center justify-center h-full relative">
                          {!badgeProgress.unlocked && (
                            <Lock className="absolute top-2 right-2 h-4 w-4 text-muted-foreground" />
                          )}
                          
                          <div className="text-3xl mb-2">
                            {badgeProgress.badge.icon}
                          </div>
                          
                          <h3 className="font-semibold text-center text-sm mb-1 line-clamp-2">
                            {badgeProgress.badge.name}
                          </h3>
                          
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${rarityColors[badgeProgress.badge.rarity as keyof typeof rarityColors]}`}
                          >
                            {badgeProgress.badge.rarity}
                          </Badge>
                          
                          {badgeProgress.unlocked && badgeProgress.unlockedAt && (
                            <div className="absolute bottom-2 left-2 right-2">
                              <div className="text-xs text-muted-foreground text-center">
                                {format(new Date(badgeProgress.unlockedAt), 'MMM d')}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </DialogTrigger>

                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-4">
                          <span className="text-4xl">{badgeProgress.badge.icon}</span>
                          <div>
                            <div>{badgeProgress.badge.name}</div>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${rarityColors[badgeProgress.badge.rarity as keyof typeof rarityColors]}`}
                            >
                              {badgeProgress.badge.rarity}
                            </Badge>
                          </div>
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          {badgeProgress.badge.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="font-medium">XP Reward:</span> {badgeProgress.badge.xp_reward}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Category:</span> {badgeProgress.badge.category}
                          </div>
                        </div>
                        
                        {badgeProgress.unlocked ? (
                          <div className="space-y-4">
                            {badgeProgress.unlockedAt && (
                              <div className="text-sm text-center p-3 bg-green-50 rounded-lg">
                                <Calendar className="h-4 w-4 inline mr-2" />
                                Unlocked on {format(new Date(badgeProgress.unlockedAt), 'MMMM d, yyyy')}
                              </div>
                            )}
                            
                            <Button 
                              onClick={() => shareBadge(badgeProgress.badge)}
                              className="w-full"
                              variant="outline"
                            >
                              <Share2 className="h-4 w-4 mr-2" />
                              Share Achievement
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center p-4 bg-muted/50 rounded-xl">
                            <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Complete the requirement to unlock this badge
                            </p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BadgeGallery;