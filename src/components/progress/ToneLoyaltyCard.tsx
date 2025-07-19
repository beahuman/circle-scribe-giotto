import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Feather, BookOpen, Skull } from 'lucide-react';
import { useToneSystem } from '@/hooks/useToneSystem';
import { ToneType } from '@/utils/toneMessages';

const ToneLoyaltyCard = () => {
  const { selectedTone, toneLoyalty } = useToneSystem();
  
  const loyaltyProgress = toneLoyalty.getLoyaltyProgress(selectedTone);
  const advancedTonePreview = toneLoyalty.getAdvancedTonePreview(selectedTone);
  
  if (!advancedTonePreview || toneLoyalty.isAdvancedToneUnlocked(advancedTonePreview)) {
    return null; // Don't show if no advanced tone or already unlocked
  }

  const getToneIcon = (tone: ToneType) => {
    switch (tone) {
      case 'romantic': return <Heart size={16} className="text-rose-500" />;
      case 'poetic': return <Feather size={16} className="text-indigo-500" />;
      case 'philosophical': return <BookOpen size={16} className="text-amber-600" />;
      case 'darkHumor': return <Skull size={16} className="text-gray-600" />;
      default: return null;
    }
  };

  const getAdvancedToneName = (tone: ToneType): string => {
    const names: Record<ToneType, string> = {
      romantic: 'Romantic',
      poetic: 'Poetic',
      philosophical: 'Philosophical',
      darkHumor: 'Dark Humor',
      playful: '',
      calm: '',
      formal: '',
      sarcastic: '',
      existential: ''
    };
    return names[tone] || tone;
  };

  const progressPercentage = (loyaltyProgress.progress / loyaltyProgress.required) * 100;
  
  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getToneIcon(advancedTonePreview)}
          <h3 className="text-sm font-medium">Tone Loyalty Progress</h3>
        </div>
        <Badge variant="outline" className="text-xs">
          {loyaltyProgress.progress} / {loyaltyProgress.required}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Unlock {getAdvancedToneName(advancedTonePreview)} tone
          </span>
          <span className="font-medium">{Math.round(progressPercentage)}%</span>
        </div>
        
        <Progress value={progressPercentage} className="h-2" />
        
        {loyaltyProgress.isEligible ? (
          <p className="text-xs text-muted-foreground">
            Keep using {selectedTone} tone to unlock advanced personality
          </p>
        ) : (
          <p className="text-xs text-orange-600">
            Too many tone switches - loyalty progress reset
          </p>
        )}
      </div>
    </div>
  );
};

export default ToneLoyaltyCard;