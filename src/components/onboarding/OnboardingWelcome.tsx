import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Zap, Target, TrendingUp, Heart, Users, SkipForward } from 'lucide-react';

interface OnboardingWelcomeProps {
  onNext: () => void;
  onSkip: () => void;
}

const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({ onNext, onSkip }) => {
  const benefits = [
    {
      icon: Brain,
      title: "Enhanced Neuroplasticity",
      description: "Circle drawing strengthens neural pathways between your brain and muscles, improving motor control precision.",
      color: "text-blue-500"
    },
    {
      icon: Zap,
      title: "Motor Cortex Training",
      description: "Repetitive practice activates your primary motor cortex, creating lasting improvements in hand-eye coordination.",
      color: "text-purple-500"
    },
    {
      icon: Target,
      title: "Cognitive Focus",
      description: "Drawing perfect circles requires intense concentration, training your attention and mindfulness abilities.",
      color: "text-green-500"
    },
    {
      icon: Heart,
      title: "Stress Reduction",
      description: "The meditative nature of circle drawing has been shown to reduce cortisol levels and promote relaxation.",
      color: "text-red-500"
    }
  ];

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className="text-6xl mb-4">🧠</div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Welcome to Giotto
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Train your brain through the ancient art of perfect circle drawing. 
          Backed by neuroscience, designed for mastery.
        </p>
      </motion.div>

      {/* The Science Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">The Science Behind Circle Drawing</h2>
              <p className="text-muted-foreground">
                Research shows that precise motor tasks like circle drawing create measurable 
                improvements in brain function and neural connectivity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUpVariants}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-background/50 rounded-lg"
                >
                  <benefit.icon className={`h-6 w-6 mt-1 ${benefit.color}`} />
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Historical Context */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="text-lg font-semibold mb-2">Giotto's Legacy</h3>
            <p className="text-sm text-muted-foreground">
              Legend says that when Pope Boniface VIII asked for proof of Giotto's skill, 
              the Renaissance master simply drew a perfect circle freehand. This became 
              the ultimate test of artistic mastery.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-4xl mb-3">🔬</div>
            <h3 className="text-lg font-semibold mb-2">Modern Application</h3>
            <p className="text-sm text-muted-foreground">
              Today, neuroscientists use circle drawing tasks to study motor control, 
              brain plasticity, and cognitive function. Your practice contributes to 
              understanding human potential.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-center space-y-4"
      >
        <h2 className="text-2xl font-bold">Ready to Train Your Brain?</h2>
        <p className="text-muted-foreground">
          Let's start with a quick tutorial to understand how the scoring system works.
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" onClick={onSkip}>
            <SkipForward className="h-4 w-4 mr-2" />
            Skip Tutorial
          </Button>
          <Button onClick={onNext} size="lg">
            Start Tutorial
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingWelcome;