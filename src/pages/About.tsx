
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ExternalLink, Github, Heart, HelpCircle } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6 flex flex-col pb-24">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">About</h1>
      </div>

      <div className="flex-1 space-y-6 max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-primary/50 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full border-2 border-primary"></div>
          </div>
          <h2 className="text-3xl font-bold mb-1">Giotto</h2>
          <p className="text-muted-foreground">The art of the perfect circle</p>
        </div>

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
            
            <Button variant="outline" className="w-full" asChild>
              <a href="https://en.wikipedia.org/wiki/Giotto" target="_blank" rel="noopener noreferrer">
                Learn more about Giotto
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <Separator className="bg-[#D6BCFA]" />

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Try the Tutorial</h3>
          <div className="space-y-4">
            <p>
              Learn how to draw perfect circles with our step-by-step tutorial. Practice makes perfect!
            </p>
            
            <Button variant="outline" className="w-full" onClick={() => navigate('/tutorial')}>
              <HelpCircle className="mr-2 h-4 w-4" />
              Start Tutorial
            </Button>
          </div>
        </div>

        <Separator className="bg-[#D6BCFA]" />

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Credits</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Designed & Developed by</p>
              <p className="text-sm text-muted-foreground">The Giotto Team</p>
            </div>
            
            <div>
              <p className="text-sm font-medium">Built with</p>
              <p className="text-sm text-muted-foreground">React, TypeScript & Shadcn UI</p>
            </div>
            
            <div className="pt-2 flex justify-between">
              <Button variant="outline" size="sm" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
              
              <Button size="sm" className="gap-2">
                <Heart className="h-4 w-4" />
                Support Us
              </Button>
            </div>
          </div>
        </div>
        
        <div className="text-center text-xs text-muted-foreground pt-4">
          <p>Version 1.0.0 • © {new Date().getFullYear()} Giotto App</p>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default About;
