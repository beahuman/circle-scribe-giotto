import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Brain, Circle, Info } from 'lucide-react';

interface WhyCirclesContentProps {
  onContinue: () => void;
  onSkip: () => void;
}

const WhyCirclesContent: React.FC<WhyCirclesContentProps> = ({
  onContinue,
  onSkip
}) => {
  const [showNeuroscience, setShowNeuroscience] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="text-center space-y-4">
            <motion.div
              animate={{ 
                rotate: [0, 180, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="w-20 h-20 mx-auto relative"
            >
              <Circle 
                className="w-full h-full text-primary absolute" 
                strokeWidth={2}
                fill="none"
              />
              <Circle 
                className="w-16 h-16 text-primary/50 absolute top-2 left-2" 
                strokeWidth={1}
                fill="none"
              />
            </motion.div>
            
            <CardTitle className="text-xl font-bold">
              Why Circles?
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 text-center">
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                Drawing a perfect circle is one of the hardest simple tasks.
              </p>
              <p className="leading-relaxed">
                It requires spatial memory, fine motor control, and visual balance.
              </p>
              <p className="leading-relaxed font-medium text-foreground">
                Even the Pope tested artists this way.
              </p>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowNeuroscience(true)}
              className="w-full flex items-center space-x-2"
            >
              <Brain className="w-4 h-4" />
              <span>Tap to learn the neuroscience</span>
            </Button>
            
            <div className="space-y-3 pt-4">
              <Button 
                onClick={onContinue}
                className="w-full"
                size="lg"
              >
                Continue Journey
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={onSkip}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                Skip to Practice
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={showNeuroscience} onOpenChange={setShowNeuroscience}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-primary" />
              <span>The Neuroscience</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              Circle drawing activates multiple brain regions simultaneously:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Motor cortex:</strong> Fine motor control</li>
              <li><strong>Visual cortex:</strong> Spatial processing</li>
              <li><strong>Cerebellum:</strong> Movement coordination</li>
              <li><strong>Parietal lobe:</strong> Spatial awareness</li>
            </ul>
            <p>
              Regular practice strengthens neural pathways through neuroplasticity, 
              improving precision and focus over time.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WhyCirclesContent;