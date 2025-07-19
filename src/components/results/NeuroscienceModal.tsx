import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, Waves, Link } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GeometricSubscores } from '@/utils/scoring/geometricScoring';

interface NeuroscienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscores?: GeometricSubscores | null;
}

const NeuroscienceModal: React.FC<NeuroscienceModalProps> = ({
  isOpen,
  onClose,
  subscores
}) => {
  const sections = [
    {
      icon: Target,
      title: 'Symmetry & Spatial Awareness',
      score: subscores?.strokeDeviation ?? 0,
      color: 'from-blue-500 to-blue-600',
      content: [
        "Your parietal cortex processes spatial relationships and maintains awareness of circular geometry.",
        "Drawing perfect circles requires the integration of visual-spatial processing with fine motor control.",
        "The visual cortex constantly compares your drawn path with the internal spatial model of a perfect circle.",
        "Improved symmetry indicates better visual-motor integration and spatial working memory."
      ]
    },
    {
      icon: Waves,
      title: 'Motor Smoothness & Control',
      score: subscores?.angularSmoothness ?? 0,
      color: 'from-green-500 to-green-600',
      content: [
        "The cerebellum fine-tunes your movements, ensuring smooth and coordinated motion.",
        "Motor cortex neurons fire in patterns that control the precise timing and force of muscle contractions.",
        "Smooth drawing reflects optimal coordination between the primary motor cortex and cerebellum.",
        "Practice strengthens neural pathways, reducing jitter and improving movement fluency."
      ]
    },
    {
      icon: Link,
      title: 'Completion & Planning',
      score: subscores?.completionOffset ?? 0,
      color: 'from-purple-500 to-purple-600',
      content: [
        "The prefrontal cortex plans and monitors the entire circular movement sequence.",
        "Successful completion requires maintaining spatial memory of your starting point throughout the drawing.",
        "The hippocampus helps track your position in space relative to the intended circular path.",
        "Good alignment indicates strong executive control and spatial working memory."
      ]
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 justify-center">
            <Brain className="h-6 w-6 text-primary" />
            <DialogTitle>The Neuroscience of Circle Drawing</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-4 bg-gradient-to-r from-primary/10 to-purple-400/10 rounded-lg border"
          >
            <p className="text-sm text-muted-foreground">
              Drawing a perfect circle engages multiple brain regions in a complex dance of 
              coordination, spatial awareness, and motor control. Understanding these processes 
              can help you improve your performance.
            </p>
          </motion.div>

          {/* Detailed Sections */}
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${section.color} text-white`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{section.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Your score: {section.score.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {section.content.map((point, pointIndex) => (
                    <motion.div
                      key={pointIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: (index * 0.1) + (pointIndex * 0.05) }}
                      className="flex items-start gap-2"
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {point}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}

          {/* Practice Tips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-muted/30 rounded-lg p-4 space-y-3"
          >
            <h3 className="font-semibold flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Neural Training Tips
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <p className="font-medium">For Better Symmetry:</p>
                <p className="text-muted-foreground">
                  Visualize the perfect circle before drawing. Engage your spatial working memory.
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="font-medium">For Smoother Motion:</p>
                <p className="text-muted-foreground">
                  Practice slow, deliberate movements. Let your cerebellum learn the pattern.
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="font-medium">For Better Completion:</p>
                <p className="text-muted-foreground">
                  Maintain awareness of your starting point throughout the entire drawing.
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="font-medium">For Overall Improvement:</p>
                <p className="text-muted-foreground">
                  Regular practice strengthens neural pathways and improves motor memory.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Fun Fact */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border border-yellow-200"
          >
            <p className="text-xs text-muted-foreground">
              <strong>Fun Fact:</strong> The ability to draw perfect circles was historically 
              considered a mark of artistic mastery. Giotto di Bondone famously drew a perfect 
              freehand circle to demonstrate his skill to the Pope!
            </p>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NeuroscienceModal;