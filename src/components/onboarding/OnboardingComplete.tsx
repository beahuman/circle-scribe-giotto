import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Sparkles, Target, Calendar, Trophy } from 'lucide-react';

interface OnboardingCompleteProps {
  onComplete: () => void;
  onPrevious: () => void;
}

const OnboardingComplete: React.FC<OnboardingCompleteProps> = ({ onComplete, onPrevious }) => {
  const features = [
    {
      icon: Target,
      title: "Practice Mode",
      description: "Train freely with instant feedback and scoring"
    },
    {
      icon: Calendar,
      title: "Daily Challenges",
      description: "Structured practice with increasing difficulty levels"
    },
    {
      icon: Trophy,
      title: "Achievement System",
      description: "Earn badges and track your progress over time"
    }
  ];

  const tips = [
    "Start with 5-10 minutes of daily practice",
    "Focus on smooth, controlled movements",
    "Don't rush - quality over speed",
    "Use the daily challenges to build consistency",
    "Check your progress dashboard regularly"
  ];

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Success Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="text-center space-y-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto"
        >
          <CheckCircle className="h-12 w-12 text-white" />
        </motion.div>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
          You're All Set!
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Congratulations! You now understand the science and scoring behind circle drawing. 
          Your journey to better motor control starts now.
        </p>
      </motion.div>

      {/* Feature Overview */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              What You Can Do Now
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUpVariants}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center p-4 bg-muted/50 rounded-lg"
                >
                  <feature.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Success Tips */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-center mb-4">Tips for Success</h2>
            <div className="space-y-3">
              {tips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUpVariants}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-primary-foreground font-bold">{index + 1}</span>
                  </div>
                  <p className="text-sm">{tip}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        transition={{ delay: 0.8 }}
        className="text-center space-y-6"
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Ready to Begin Your Journey?</h2>
          <p className="text-muted-foreground">
            Your brain is ready to learn. Every circle you draw makes you better.
          </p>
        </div>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
        >
          <Button 
            onClick={onComplete}
            size="lg"
            className="px-8 py-4 text-lg rounded-full bg-gradient-to-r from-primary to-purple-400 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            Start Drawing Circles!
          </Button>
        </motion.div>

        <p className="text-xs text-muted-foreground">
          You can revisit this tutorial anytime from the settings menu.
        </p>
      </motion.div>
    </div>
  );
};

export default OnboardingComplete;