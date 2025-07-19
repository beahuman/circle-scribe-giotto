import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ExternalLink, Github, Heart, HelpCircle } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import LogoAnimation from '@/components/LogoAnimation';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6 flex flex-col pb-24">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} size="icon" className="mr-2">
          <ArrowLeft className="h-6 w-6 text-primary" />
        </Button>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">About</h1>
      </div>

      <div className="flex-1 space-y-6 max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <LogoAnimation size={96} />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Try the Tutorial</h3>
          <div className="space-y-4">
            <p>
              Learn how to draw perfect circles with our step-by-step tutorial. Practice makes perfect!
            </p>
            
            <Button 
              variant="premium"
              size="lg"
              className="w-full px-8 py-6 text-lg rounded-full"
              onClick={() => navigate('/tutorial')}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Start Tutorial
            </Button>
          </div>
        </div>

        <Separator className="bg-[#D6BCFA]" />

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">The Legend of Giotto's O</h3>
          <p className="text-muted-foreground text-sm">A historical masterpiece</p>
          <div className="space-y-4">
            <p>
              In the late 13th century, Pope Boniface VIII sought to recruit the best artists in Italy.
              He sent messengers across the country to collect samples of their work.
            </p>
            
            <p>
              When the messenger reached Giotto di Bondone, the artist took a sheet of paper and, with a brush dipped in red paint, drew a perfect circle in one continuous stroke.
            </p>
            
            <p>
              "Take this back to His Holiness," Giotto said.
            </p>
            
            <p>
              The Pope and his courtiers immediately recognized the mastery required to draw such a perfect circle freehand. Giotto was commissioned for the work based on this simple demonstration of skill.
            </p>
          </div>
        </div>

        <Separator className="bg-[#D6BCFA]" />

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">The Science of Circle Drawing</h3>
          <div className="space-y-4">
            <p>
              Drawing a perfect circle freehand is considered one of the most difficult basic tasks in art and design. It requires exceptional hand-eye coordination, muscle memory, and spatial awareness.
            </p>
            
            <p>
              Studies have shown that the ability to draw circles is linked to fine motor control and can even be used to detect certain neurological conditions. The more you practice, the better your neural pathways adapt to the task.
            </p>
            
            <Button 
              variant="outline"
              size="lg"
              className="w-full px-8 py-6 text-lg rounded-full border-primary/30 hover:bg-primary/5"
              asChild
            >
              <a href="https://en.wikipedia.org/wiki/Giotto" target="_blank" rel="noopener noreferrer">
                Learn more about Giotto
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <Separator className="bg-[#D6BCFA]" />

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Credits</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Designed & Developed by</p>
              <p className="text-sm text-muted-foreground">human design</p>
            </div>
            
            <div className="text-center text-xs text-muted-foreground pt-4">
              <p>Version 1.0.0 • © {new Date().getFullYear()} Giotto App</p>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default About;
