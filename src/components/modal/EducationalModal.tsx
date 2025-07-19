import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Target, Zap, TrendingUp, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EducationalContent {
  id: string;
  type: 'neuroscience' | 'scoring' | 'improvement';
  icon: React.ElementType;
  title: string;
  content: string;
  scientificBasis: string;
  actionTip: string;
}

const educationalContent: EducationalContent[] = [
  {
    id: 'motor-cortex',
    type: 'neuroscience',
    icon: Brain,
    title: 'Your Motor Cortex at Work',
    content: 'Drawing circles activates your primary motor cortex, the brain region responsible for precise hand movements. Each attempt strengthens neural pathways between your brain and muscles.',
    scientificBasis: 'Studies show that repetitive motor tasks create lasting changes in motor cortex organization, improving movement precision over time.',
    actionTip: 'Focus on smooth, controlled movements rather than speed to optimize motor learning.'
  },
  {
    id: 'symmetry-neuroplasticity',
    type: 'scoring',
    icon: Target,
    title: 'Symmetry & Spatial Processing',
    content: 'Your symmetry score reflects how well your parietal cortex processes spatial relationships. This brain region integrates visual and motor information.',
    scientificBasis: 'The parietal cortex shows increased activity during spatial tasks and strengthens with practice, improving hand-eye coordination.',
    actionTip: 'Visualize the perfect circle before drawing to pre-activate your spatial processing networks.'
  },
  {
    id: 'smoothness-cerebellum',
    type: 'scoring',
    icon: Zap,
    title: 'Smoothness & Motor Control',
    content: 'Smooth movements indicate healthy cerebellum function. This "little brain" coordinates timing and fluidity of motor actions.',
    scientificBasis: 'The cerebellum contains more neurons than the rest of the brain combined and fine-tunes every movement you make.',
    actionTip: 'Practice slow, deliberate circles to train your cerebellum for better movement coordination.'
  },
  {
    id: 'closure-planning',
    type: 'scoring',
    icon: TrendingUp,
    title: 'Closure & Motor Planning',
    content: 'Circle closure reflects your prefrontal cortex\'s ability to plan and execute complete motor sequences from start to finish.',
    scientificBasis: 'Motor planning involves multiple brain regions working together to predict and control complex movement patterns.',
    actionTip: 'Before starting, mentally trace your intended path to strengthen motor planning circuits.'
  },
  {
    id: 'neuroplasticity',
    type: 'improvement',
    icon: Brain,
    title: 'Your Brain is Constantly Adapting',
    content: 'Every circle you draw creates new neural connections. Your brain physically reshapes itself through practice, a process called neuroplasticity.',
    scientificBasis: 'Adult brains can form new neural pathways throughout life, with motor skills showing particularly strong plasticity.',
    actionTip: 'Consistent daily practice, even for 5 minutes, creates stronger neural changes than occasional long sessions.'
  },
  {
    id: 'muscle-memory',
    type: 'improvement',
    icon: Target,
    title: 'Building True Muscle Memory',
    content: 'Muscle memory isn\'t in your muscles—it\'s stored in your brain\'s motor cortex and cerebellum as optimized movement patterns.',
    scientificBasis: 'Repeated motor practice creates "motor engrams"—neural blueprints that automate complex movements.',
    actionTip: 'Focus on consistency over perfection. Your brain learns best from repeated, similar movement patterns.'
  },
  {
    id: 'stress-performance',
    type: 'improvement',
    icon: Zap,
    title: 'Stress and Motor Performance',
    content: 'Stress hormones like cortisol can impair fine motor control by interfering with prefrontal cortex function.',
    scientificBasis: 'Research shows that moderate stress can enhance learning, but high stress disrupts motor skill acquisition.',
    actionTip: 'Take deep breaths before each attempt. Relaxed practice leads to better motor learning outcomes.'
  }
];

interface EducationalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

const EducationalModal: React.FC<EducationalModalProps> = ({
  isOpen,
  onClose,
  onContinue
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasRead, setHasRead] = useState(false);
  const [readTimer, setReadTimer] = useState(3);

  // Rotate content each time modal opens
  useEffect(() => {
    if (isOpen) {
      const lastIndex = parseInt(localStorage.getItem('lastEducationalIndex') || '0');
      const nextIndex = (lastIndex + 1) % educationalContent.length;
      setCurrentIndex(nextIndex);
      localStorage.setItem('lastEducationalIndex', nextIndex.toString());
      setHasRead(false);
      setReadTimer(3);
    }
  }, [isOpen]);

  // Countdown timer and mark as read after 3 seconds
  useEffect(() => {
    if (isOpen && !hasRead) {
      const interval = setInterval(() => {
        setReadTimer((prev) => {
          if (prev <= 1) {
            setHasRead(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isOpen, hasRead]);

  const currentContent = educationalContent[currentIndex];
  const IconComponent = currentContent.icon;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'neuroscience': return 'text-blue-500 bg-blue-500/10';
      case 'scoring': return 'text-green-500 bg-green-500/10';
      case 'improvement': return 'text-purple-500 bg-purple-500/10';
      default: return 'text-primary bg-primary/10';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'neuroscience': return 'Brain Science';
      case 'scoring': return 'Scoring Insight';
      case 'improvement': return 'Improvement Tip';
      default: return 'Insight';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto p-0 overflow-hidden xs:max-w-md md:max-w-lg lg:max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative"
        >
          {/* Header - Grid Aligned */}
          <DialogHeader className="px-4 py-6 pb-4 xs:px-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(currentContent.type)}`}>
                <IconComponent className="h-3 w-3" />
                {getTypeLabel(currentContent.type)}
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <DialogTitle className="text-header font-semibold text-center">
              {currentContent.title}
            </DialogTitle>
          </DialogHeader>

          {/* Content - Grid Aligned with Consistent Spacing */}
          <div className="px-4 space-y-6 xs:px-6">
            {/* Main Content - Grid Aligned */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <p className="text-body text-muted-foreground leading-relaxed text-center">
                {currentContent.content}
              </p>

              {/* Scientific Basis - Grid Aligned */}
              <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
                <h4 className="text-small font-semibold mb-2 text-primary">Scientific Basis</h4>
                <p className="text-small text-muted-foreground leading-relaxed">
                  {currentContent.scientificBasis}
                </p>
              </div>

              {/* Action Tip - Grid Aligned */}
              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-4 border border-green-500/20">
                <h4 className="text-small font-semibold mb-2 text-green-600 dark:text-green-400">
                  💡 Practice Tip
                </h4>
                <p className="text-small leading-relaxed">
                  {currentContent.actionTip}
                </p>
              </div>
            </motion.div>

            {/* Progress indicator - Grid Centered */}
            <div className="flex justify-center space-x-2 py-4">
              {educationalContent.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Footer - Grid Aligned */}
          <div className="px-4 py-6 pt-4 xs:px-6">
            <Button
              onClick={onContinue}
              className="w-full"
              disabled={!hasRead}
            >
              <span>Continue Drawing</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            {!hasRead && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-caption text-muted-foreground mt-3 text-center"
              >
                Reading... {readTimer}s
              </motion.p>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default EducationalModal;