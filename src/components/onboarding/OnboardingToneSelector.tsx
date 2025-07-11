import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smile, Brain, GraduationCap, Zap } from 'lucide-react';

interface OnboardingToneSelectorProps {
  onSelectTone: (tone: 'playful' | 'calm' | 'formal' | 'sarcastic') => void;
  onRandomize: () => void;
  onSkip: () => void;
}

const tones = [
  {
    id: 'playful' as const,
    icon: Smile,
    title: 'Playful',
    preview: "Let's make some wobbly magic.",
    color: 'from-yellow-500/20 to-orange-500/20',
    iconColor: 'text-yellow-600'
  },
  {
    id: 'calm' as const,
    icon: Brain,
    title: 'Meditative',
    preview: "Breathe in, draw out. Gently.",
    color: 'from-blue-500/20 to-teal-500/20',
    iconColor: 'text-blue-600'
  },
  {
    id: 'formal' as const,
    icon: GraduationCap,
    title: 'Formal',
    preview: "We begin with discipline.",
    color: 'from-gray-500/20 to-slate-500/20',
    iconColor: 'text-gray-600'
  },
  {
    id: 'sarcastic' as const,
    icon: Zap,
    title: 'Sarcastic',
    preview: "Circles? Easy. I was born perfect.",
    color: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-600'
  }
];

const OnboardingToneSelector: React.FC<OnboardingToneSelectorProps> = ({
  onSelectTone,
  onRandomize,
  onSkip
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold">
              How should I speak to you?
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {tones.map((tone, index) => (
                <motion.div
                  key={tone.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative overflow-hidden rounded-lg border p-4 cursor-pointer hover:border-primary/50 transition-colors`}
                  onClick={() => onSelectTone(tone.id)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${tone.color} opacity-50`} />
                  
                  <div className="relative space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-background rounded-lg">
                        <tone.icon className={`w-5 h-5 ${tone.iconColor}`} />
                      </div>
                      <h3 className="font-medium text-foreground">
                        {tone.title}
                      </h3>
                    </div>
                    
                    <p className="text-description pl-2 border-l-2 border-primary/30">
                      "{tone.preview}"
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="space-y-3 pt-4">
              <Button 
                onClick={onRandomize}
                variant="outline"
                className="w-full"
              >
                Let Giotto Choose for Me
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={onSkip}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                Skip Tone Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingToneSelector;