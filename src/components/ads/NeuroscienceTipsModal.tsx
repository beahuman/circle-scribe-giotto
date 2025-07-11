import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  Lightbulb, 
  Target, 
  Timer,
  Eye,
  Zap,
  Play,
  Sparkles,
  Lock
} from "lucide-react";
import { useRewardedAds } from "@/hooks/useRewardedAds";

interface NeuroscienceTip {
  id: string;
  title: string;
  category: 'Motor Learning' | 'Focus' | 'Practice' | 'Neuroscience';
  content: string;
  insight: string;
  application: string;
  isPremium: boolean;
}

const neuroscienceTips: NeuroscienceTip[] = [
  {
    id: '1',
    title: 'The Power of Slow Practice',
    category: 'Motor Learning',
    content: 'Deliberate slow practice activates different neural pathways than fast movements, allowing for more precise motor pattern encoding.',
    insight: 'Myelin sheaths develop more effectively when movements are performed slowly and with intention.',
    application: 'Practice your circles at 50% speed for 2-3 attempts before returning to normal speed.',
    isPremium: false
  },
  {
    id: '2',
    title: 'Visual-Motor Integration',
    category: 'Neuroscience',
    content: 'The posterior parietal cortex coordinates visual input with motor output, creating the foundation for precise movements.',
    insight: 'Focusing intently on the visual target enhances the neural connection between what you see and how you move.',
    application: 'Before drawing, spend 2-3 seconds visually tracing the perfect circle path.',
    isPremium: true
  },
  {
    id: '3',
    title: 'Error-Based Learning',
    category: 'Practice',
    content: 'The cerebellum uses prediction errors to refine motor commands, making "mistakes" essential for improvement.',
    insight: 'Your brain learns more from near-misses than from perfect attempts.',
    application: 'Pay attention to where your circle deviates from perfect - this feedback drives neural adaptation.',
    isPremium: true
  },
  {
    id: '4',
    title: 'Attention and Flow States',
    category: 'Focus',
    content: 'Optimal performance occurs when the prefrontal cortex reduces its monitoring, allowing automatic motor programs to execute.',
    insight: 'Overthinking disrupts the flow of well-learned movements.',
    application: 'Once you start drawing, trust your movement and avoid conscious corrections mid-circle.',
    isPremium: false
  },
  {
    id: '5',
    title: 'Sleep and Motor Consolidation',
    category: 'Motor Learning',
    content: 'Sleep facilitates the transfer of motor memories from the hippocampus to the motor cortex for long-term storage.',
    insight: 'Practice improvements often appear after sleep, not immediately during practice.',
    application: 'Practice consistently but allow rest between sessions - improvement happens during sleep.',
    isPremium: true
  },
  {
    id: '6',
    title: 'Variability in Practice',
    category: 'Practice',
    content: 'The brain builds more robust motor programs when exposed to slight variations in movement contexts.',
    insight: 'Practicing in slightly different conditions strengthens neural pathways.',
    application: 'Occasionally practice with your non-dominant hand or at different speeds.',
    isPremium: true
  }
];

interface NeuroscienceTipsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NeuroscienceTipsModal: React.FC<NeuroscienceTipsModalProps> = ({
  open,
  onOpenChange
}) => {
  const { showRewardedAd, canWatchAd, loading } = useRewardedAds();
  const [unlockedPremiumTips, setUnlockedPremiumTips] = useState<string[]>(() => {
    const stored = localStorage.getItem('unlockedNeuroscienceTips');
    return stored ? JSON.parse(stored) : [];
  });

  const handleUnlockTip = async (tipId: string) => {
    const success = await showRewardedAd('tips');
    if (success) {
      const newUnlocked = [...unlockedPremiumTips, tipId];
      setUnlockedPremiumTips(newUnlocked);
      localStorage.setItem('unlockedNeuroscienceTips', JSON.stringify(newUnlocked));
    }
  };

  const freeTips = neuroscienceTips.filter(tip => !tip.isPremium);
  const premiumTips = neuroscienceTips.filter(tip => tip.isPremium);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Motor Learning': return <Zap className="h-4 w-4" />;
      case 'Focus': return <Eye className="h-4 w-4" />;
      case 'Practice': return <Target className="h-4 w-4" />;
      case 'Neuroscience': return <Brain className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Motor Learning': return 'text-primary bg-primary/10';
      case 'Focus': return 'text-blue-500 bg-blue-500/10';
      case 'Practice': return 'text-green-500 bg-green-500/10';
      case 'Neuroscience': return 'text-purple-500 bg-purple-500/10';
      default: return 'text-orange-500 bg-orange-500/10';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Neuroscience Insights
          </DialogTitle>
          <DialogDescription>
            Science-backed tips to optimize your circle drawing practice
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Free Tips */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Essential Tips
            </h3>
            
            {freeTips.map((tip) => (
              <Card key={tip.id} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{tip.title}</CardTitle>
                    <Badge 
                      variant="secondary" 
                      className={getCategoryColor(tip.category)}
                    >
                      {getCategoryIcon(tip.category)}
                      <span className="ml-1">{tip.category}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <p className="text-sm text-muted-foreground">{tip.content}</p>
                  
                  <div className="space-y-2">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium text-foreground mb-1">💡 Key Insight:</p>
                      <p className="text-sm">{tip.insight}</p>
                    </div>
                    
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium text-primary mb-1">🎯 How to Apply:</p>
                      <p className="text-sm">{tip.application}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator />

          {/* Premium Tips */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-500" />
              Advanced Insights
              <Badge className="bg-purple-500/10 text-purple-500">Premium</Badge>
            </h3>
            
            {premiumTips.map((tip) => {
              const isUnlocked = unlockedPremiumTips.includes(tip.id);
              
              return (
                <Card key={tip.id} className="border-l-4 border-l-purple-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        {tip.title}
                        {!isUnlocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                      </CardTitle>
                      <Badge 
                        variant="secondary" 
                        className={getCategoryColor(tip.category)}
                      >
                        {getCategoryIcon(tip.category)}
                        <span className="ml-1">{tip.category}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {isUnlocked ? (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">{tip.content}</p>
                        
                        <div className="space-y-2">
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm font-medium text-foreground mb-1">💡 Key Insight:</p>
                            <p className="text-sm">{tip.insight}</p>
                          </div>
                          
                          <div className="p-3 bg-purple-500/5 rounded-lg">
                            <p className="text-sm font-medium text-purple-600 mb-1">🎯 How to Apply:</p>
                            <p className="text-sm">{tip.application}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-4 py-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10 mx-auto">
                          <Lock className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Unlock Advanced Insight</p>
                          <p className="text-xs text-muted-foreground mb-3">
                            Watch a short ad to unlock this neuroscience tip
                          </p>
                        </div>
                        
                        <Button
                          onClick={() => handleUnlockTip(tip.id)}
                          disabled={!canWatchAd || loading}
                          size="sm"
                          className="bg-purple-500 hover:bg-purple-600"
                        >
                          <Play className="h-3 w-3 mr-2" />
                          {loading ? 'Loading...' : 'Watch & Unlock'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NeuroscienceTipsModal;