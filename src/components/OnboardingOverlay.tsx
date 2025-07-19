
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ChevronRight, Brain, Target } from "lucide-react";

interface OnboardingOverlayProps {
  onComplete: () => void;
}

const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: <Brain className="h-16 w-16 text-primary" />,
      title: "Neural Precision Training",
      content: "Drawing perfect circles activates the motor cortex and visual-spatial regions of your brain, strengthening the neural pathways responsible for fine motor control and hand-eye coordination."
    },
    {
      icon: <Target className="h-16 w-16 text-primary" />,
      title: "Focused Attention",
      content: "This exercise requires sustained concentration and mindful movement, training your brain's attention networks while developing muscle memory for precise motor movements."
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Skip button */}
        <div className="absolute top-6 right-6">
          <Button 
            variant="ghost" 
            onClick={handleSkip} 
            className="text-sm text-gray-500 min-h-[44px] min-w-[44px]"
          >
            Skip
          </Button>
        </div>

        {/* Slide content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="flex justify-center">
              {slides[currentSlide].icon}
            </div>
            
            <h2 className="text-header text-foreground">
              {slides[currentSlide].title}
            </h2>
            
            <p className="text-description leading-relaxed">
              {slides[currentSlide].content}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="py-4"
        >
          <p className="text-body-lg text-button text-primary">
            "Train your hand. Focus your mind."
          </p>
        </motion.div>

        {/* Progress dots */}
        <div className="flex justify-center space-x-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                index === currentSlide ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Navigation button */}
        <Button
          onClick={handleNext}
          size="lg"
          className="w-full mt-8 flex items-center justify-center gap-2 min-h-[56px]"
        >
          {currentSlide < slides.length - 1 ? (
            <>
              Next
              <ChevronRight className="h-4 w-4" />
            </>
          ) : (
            "Begin Motor Training"
          )}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingOverlay;
