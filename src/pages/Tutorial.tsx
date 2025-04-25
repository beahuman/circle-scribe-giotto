
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ChevronLeft, ChevronRight, Check, PenTool } from 'lucide-react';

const tutorialSteps = [
  {
    title: "Welcome to Giotto's Circle",
    description: "Learn how to master the art of drawing perfect circles",
    content: (
      <>
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 rounded-full border-4 border-primary"></div>
        </div>
        <p className="mb-4">
          Legend has it that Giotto di Bondone, a renowned Renaissance artist, drew a perfect freehand circle to prove his skill to the Pope's messenger.
        </p>
        <p>
          This game challenges you to do the same - draw the most perfect circle you can using only your finger and a steady hand.
        </p>
      </>
    )
  },
  {
    title: "Step 1: Memorize the Circle",
    description: "Watch carefully where the circle appears",
    content: (
      <>
        <div className="flex justify-center mb-6 relative">
          <div className="w-32 h-32 rounded-full border-2 border-dashed border-primary/60"></div>
          <div className="absolute animate-pulse w-4 h-4 rounded-full bg-primary" style={{ top: '45%', left: '55%' }}></div>
        </div>
        <p className="mb-4">
          When you start the game, a perfect circle will appear on your screen for 3 seconds.
        </p>
        <p>
          Pay attention to its <strong>position and size</strong>. You'll need to recreate it in the exact same spot.
        </p>
      </>
    )
  },
  {
    title: "Step 2: Draw Your Circle",
    description: "Use a single continuous motion",
    content: (
      <>
        <div className="flex justify-center mb-6 relative">
          <div className="w-32 h-32 rounded-full border-dashed border-primary/30"></div>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <path 
              d="M 50,20 C 70,20 80,30 80,50 C 80,70 70,80 50,80 C 30,80 20,70 20,50 C 20,30 30,20 50,20" 
              fill="none" 
              stroke="hsl(var(--primary))" 
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className="mb-4">
          After the circle disappears, you'll have the chance to draw your own circle.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Touch and hold to begin drawing</li>
          <li>Draw in one continuous motion</li>
          <li>Release when you've completed the circle</li>
          <li>Try to match the original circle's position and size</li>
        </ul>
      </>
    )
  },
  {
    title: "Step 3: See Your Score",
    description: "Find out how close you came to perfection",
    content: (
      <>
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-2 border-primary/30"></div>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              <path 
                d="M 50,15 C 75,15 85,25 85,50 C 85,65 75,80 55,85 C 35,90 20,75 15,55 C 10,35 25,15 50,15" 
                fill="none" 
                stroke="hsl(var(--primary))" 
                strokeWidth="2"
                strokeDasharray="2"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-xl font-bold">78%</div>
            </div>
          </div>
        </div>
        <p className="mb-4">
          Your score is based on how closely your circle matches the original:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>90-100%</strong>: Giotto would be proud!</li>
          <li><strong>70-89%</strong>: Good effort</li>
          <li><strong>50-69%</strong>: Keep practicing</li>
          <li><strong>&lt;50%</strong>: That's more of an oval...</li>
        </ul>
      </>
    )
  },
  {
    title: "Tips for Perfect Circles",
    description: "Master techniques to improve your score",
    content: (
      <>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-primary/20 text-primary mt-0.5">1</div>
            <div>
              <p className="font-medium">Use your whole arm</p>
              <p className="text-sm text-muted-foreground">Draw from the shoulder, not just the wrist, for smoother motion</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-primary/20 text-primary mt-0.5">2</div>
            <div>
              <p className="font-medium">Maintain a steady speed</p>
              <p className="text-sm text-muted-foreground">Drawing too quickly or slowly affects precision</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-primary/20 text-primary mt-0.5">3</div>
            <div>
              <p className="font-medium">Practice visualization</p>
              <p className="text-sm text-muted-foreground">Remember exactly where the circle was positioned</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-primary/20 text-primary mt-0.5">4</div>
            <div>
              <p className="font-medium">Start from the top</p>
              <p className="text-sm text-muted-foreground">Beginning at 12 o'clock position often helps with symmetry</p>
            </div>
          </div>
        </div>
      </>
    )
  },
  {
    title: "Customize Your Experience",
    description: "Adjust settings to your preference",
    content: (
      <>
        <div className="flex justify-center mb-6">
          <PenTool size={60} className="text-primary" />
        </div>
        <p className="mb-4">
          Visit the Settings screen to customize your experience:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Circle Display Time</strong>: Adjust how long you see the target circle</li>
          <li><strong>Scoring Strictness</strong>: Make scoring more forgiving or stricter</li>
          <li><strong>Drawing Precision</strong>: Control how smooth or detailed your drawn line appears</li>
          <li className="text-sm text-muted-foreground mt-2">Higher precision captures more detail but may look less smooth</li>
          <li className="text-sm text-muted-foreground">Lower precision creates smoother lines but may miss subtle movements</li>
        </ul>
      </>
    )
  }
];

const Tutorial = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = tutorialSteps.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen p-6 flex flex-col bg-gradient-to-b from-background to-background/80">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Tutorial</h1>
      </div>

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
        <div className="flex-1">
          <Card className="h-full flex flex-col border-primary/20 shadow-md">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-400/10">
              <CardTitle>{tutorialSteps[currentStep].title}</CardTitle>
              <CardDescription>{tutorialSteps[currentStep].description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              {tutorialSteps[currentStep].content}
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrev}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full ${i === currentStep ? 'bg-primary' : 'bg-muted'}`}
                  />
                ))}
              </div>
              
              <Button 
                onClick={handleNext}
                className={currentStep === totalSteps - 1 ? 
                  "bg-gradient-to-r from-primary to-purple-400" : ""}
              >
                {currentStep === totalSteps - 1 ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Finish
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
