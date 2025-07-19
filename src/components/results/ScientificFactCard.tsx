
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Lightbulb } from 'lucide-react';

const SCIENTIFIC_FACTS = [
  "The cerebellum contains over 50% of all neurons in your brain and is crucial for motor coordination.",
  "Muscle memory is stored in the motor cortex and can be retained for decades even without practice.",
  "Drawing circles activates the same neural pathways used by professional artists and surgeons.",
  "Your brain creates new neural connections every time you practice motor skills - this is called neuroplasticity.",
  "The visual-motor cortex processes hand-eye coordination in just 100-200 milliseconds.",
  "Repetitive motor tasks strengthen the myelin sheath around neurons, improving signal speed.",
  "The basal ganglia help automate learned movements, freeing up conscious thought for other tasks.",
  "Mirror neurons fire both when you perform an action and when you watch someone else do it.",
  "Fine motor control develops throughout childhood and can be improved at any age through practice.",
  "The prefrontal cortex plans movements while the motor cortex executes them in real-time.",
  "Proprioception - your sense of body position - is processed by the posterior parietal cortex.",
  "Sleep consolidates motor learning, converting short-term motor memories into long-term skills."
];

interface ScientificFactCardProps {
  isVisible: boolean;
  onComplete: () => void;
}

const ScientificFactCard: React.FC<ScientificFactCardProps> = ({ 
  isVisible, 
  onComplete 
}) => {
  const [currentFact, setCurrentFact] = useState('');

  useEffect(() => {
    if (isVisible) {
      // Select a random fact
      const randomIndex = Math.floor(Math.random() * SCIENTIFIC_FACTS.length);
      setCurrentFact(SCIENTIFIC_FACTS[randomIndex]);
      
      // Auto-hide after 2.5 seconds
      const timer = setTimeout(() => {
        onComplete();
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ 
            duration: 0.4,
            exit: { duration: 0.6, ease: "easeOut" }
          }}
          className="fixed inset-x-4 top-1/2 transform -translate-y-1/2 z-50 mx-auto max-w-md"
        >
          <div className="bg-white/95 backdrop-blur-sm border border-primary/20 rounded-lg p-6 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-primary">Neural Science</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {currentFact}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScientificFactCard;
