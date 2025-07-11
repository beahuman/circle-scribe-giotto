import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Heart, Palette, Sparkles, Users } from 'lucide-react';

interface SupporterTierCardProps {
  hasSupporterTier: boolean;
  onPurchase: () => void;
  isPending: boolean;
}

export const SupporterTierCard: React.FC<SupporterTierCardProps> = ({
  hasSupporterTier,
  onPurchase,
  isPending
}) => {
  if (hasSupporterTier) {
    return (
      <Card className="border-amber-300 bg-gradient-to-br from-amber-100/50 to-yellow-100/50 mb-8">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Crown className="h-8 w-8 text-amber-600" />
          </div>
          <CardTitle className="text-xl text-amber-800">Studio Patron</CardTitle>
          <Badge variant="secondary" className="mx-auto bg-amber-200 text-amber-800">
            Active
          </Badge>
        </CardHeader>
        <CardContent className="text-center space-y-3">
          <p className="text-sm text-amber-700">
            Thank you for supporting neural creativity development! 
          </p>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-2 text-amber-600">
              <Palette className="h-4 w-4" />
              <span>Golden brush unlocked</span>
            </div>
            <div className="flex items-center gap-2 text-amber-600">
              <Sparkles className="h-4 w-4" />
              <span>Exclusive UI effects</span>
            </div>
            <div className="flex items-center gap-2 text-amber-600">
              <Crown className="h-4 w-4" />
              <span>Patron badge</span>
            </div>
            <div className="flex items-center gap-2 text-amber-600">
              <Heart className="h-4 w-4" />
              <span>Supporting development</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50/30 to-orange-50/30 mb-8">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Crown className="h-8 w-8 text-amber-500" />
        </div>
        <CardTitle className="text-xl bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          Become a Studio Patron
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Support the development of neural creativity tools
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex items-center gap-3">
            <Palette className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <span>Exclusive golden brush with special effects</span>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <span>Subtle golden UI accents throughout the app</span>
          </div>
          <div className="flex items-center gap-3">
            <Crown className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <span>Patron badge in your progress profile</span>
          </div>
          <div className="flex items-center gap-3">
            <Heart className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <span>Direct support for neuroscience research integration</span>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <span>Help keep the core experience completely free</span>
          </div>
        </div>
        
        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
          <p className="text-xs text-amber-700 text-center">
            "You're supporting neural creativity. Thank you."
          </p>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button
          onClick={onPurchase}
          disabled={isPending}
          className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white"
        >
          {isPending ? 'Processing...' : 'Become a Patron - $4.99'}
        </Button>
      </CardFooter>
    </Card>
  );
};