
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Hand, ArrowRight, Gauge, Trophy, ArrowLeft } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import LogoAnimation from '@/components/LogoAnimation';

const tutorialSteps = [
  {
    title: "Welcome to Giotto's Circle",
    content: "Learn how to draw the perfect circle with this step-by-step tutorial. Inspired by the Renaissance master Giotto di Bondone's famous demonstration of skill.",
    illustration: (
      <div className="relative w-full h-64 bg-white rounded-lg flex items-center justify-center">
        <div className="w-[120px] mx-auto">
          <LogoAnimation size={96} />
        </div>
      </div>
    )
  },
  {
    title: "The Perfect Grip",
    content: "Hold your device comfortably. Place your finger or stylus on the screen without pressing too hard. A light touch gives you better control.",
    illustration: (
      <div className="relative w-full h-64 bg-white rounded-lg flex items-center justify-center">
        <Hand className="w-32 h-32 text-[#765ED8]" strokeWidth={1.5} />
      </div>
    )
  },
  {
    title: "Start With Confidence",
    content: "Begin drawing from any point, but commit to it. A confident start leads to a smoother circle. Don't hesitate once you begin.",
    illustration: (
      <div className="relative w-full h-64 bg-white rounded-lg flex items-center justify-center">
        <ArrowRight className="w-32 h-32 text-[#765ED8] animate-bounce" strokeWidth={1.5} />
      </div>
    )
  },
  {
    title: "Maintain Even Speed",
    content: "Keep your drawing speed consistent throughout the entire motion. Varying speeds create uneven curves and affect accuracy.",
    illustration: (
      <div className="relative w-full h-64 bg-white rounded-lg flex items-center justify-center">
        <Gauge className="w-32 h-32 text-[#765ED8]" strokeWidth={1.5} />
      </div>
    )
  },
  {
    title: "Complete The Circle",
    content: "Return to your starting point, closing the circle with a smooth motion. The end should seamlessly connect with the beginning for a perfect circle.",
    illustration: (
      <div className="w-full h-64 bg-white rounded-lg flex items-center justify-center">
        <div className="w-40 h-40 rounded-full border-4 border-[#765ED8] animate-[spin_3s_linear_infinite]" />
      </div>
    )
  },
  {
    title: "Practice Makes Perfect",
    content: "Like Giotto, mastery comes with practice. Don't be discouraged by early attempts. Keep drawing circles and watch your skill improve.",
    illustration: (
      <div className="relative w-full h-64 bg-white rounded-lg flex items-center justify-center">
        <Trophy className="w-32 h-32 text-[#765ED8]" strokeWidth={1.5} />
      </div>
    )
  }
];

const Tutorial = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  const goToNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    } else {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      navigate('/');
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }
  };

  const isLastStep = currentStep === tutorialSteps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="min-h-screen p-6 flex flex-col pb-24 bg-gradient-to-b from-background to-background/95">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/about')} size="icon" className="mr-2">
          <ArrowLeft className="h-6 w-6 text-primary" />
        </Button>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Tutorial</h1>
      </div>

      <div className="flex-1 space-y-6 w-full" ref={contentRef}>
        <div className="text-center mb-8">
          <div className="w-[120px] mx-auto mb-4">
            <LogoAnimation size={96} />
          </div>
        </div>

        <div className="flex items-center mb-4 text-sm font-medium text-muted-foreground">
          <span>Step {currentStep + 1} of {tutorialSteps.length}</span>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-semibold flex items-center">
              {completedSteps.includes(currentStep) && (
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              )}
              {tutorialSteps[currentStep].title}
            </h3>
            
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg border-2 border-[#765ED8]">
                {tutorialSteps[currentStep].illustration}
              </div>

              <p className="text-lg">
                {tutorialSteps[currentStep].content}
              </p>

              <div className="flex justify-between gap-4 mt-8">
                <Button 
                  variant="premium"
                  size="lg"
                  className="flex-1 px-8 py-6 text-lg rounded-full"
                  onClick={goToPreviousStep}
                  disabled={isFirstStep}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button 
                  variant="premium"
                  size="lg"
                  className="flex-1 px-8 py-6 text-lg rounded-full"
                  onClick={goToNextStep}
                >
                  {isLastStep ? "Finish Tutorial" : "Next"}
                  {!isLastStep && <ChevronRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-2 justify-center">
          {tutorialSteps.map((_, index) => (
            <Button 
              key={index} 
              variant="ghost" 
              size="icon" 
              className={`w-3 h-3 p-0 rounded-full ${currentStep === index ? 'bg-primary' : 'bg-muted'}`}
              onClick={() => setCurrentStep(index)}
            />
          ))}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Tutorial;
