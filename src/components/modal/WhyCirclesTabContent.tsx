
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { TabId } from './WhyCirclesTabNavigation';
import WhyCirclesVisualDemo from './WhyCirclesVisualDemo';

interface TabContentData {
  headline: string;
  points: string[];
  demo: string;
}

interface WhyCirclesTabContentProps {
  activeTab: TabId;
}

const tabContentData: Record<TabId, TabContentData> = {
  brain: {
    headline: 'The Neuroscience of Circle Drawing',
    points: [
      'Activates cerebellum, premotor cortex, and visual processing centers simultaneously',
      'Tests the coordination between your mind\'s spatial planning and hand execution', 
      'Used in stroke rehabilitation to assess motor coordination recovery',
      'NASA uses similar precision tasks to test astronaut dexterity in zero gravity',
      'Reveals insights into neurological health and cognitive development'
    ],
    demo: 'Perfect circles require a complex neural symphony - your brain must plan, execute, and adjust in real-time'
  },
  medical: {
    headline: 'Medical & Therapeutic Applications', 
    points: [
      'Standard assessment in neurological rehabilitation programs',
      'Helps rebuild fine motor skills after stroke or brain injury',
      'Non-invasive tool for measuring cognitive and motor function',
      'Tracks progress in conditions affecting hand-eye coordination',
      'Used in occupational therapy to restore daily living skills'
    ],
    demo: 'Therapists measure circle accuracy over time to track patient recovery and adjust treatment plans'
  },
  giotto: {
    headline: 'The Legend That Inspired Perfection',
    points: [
      'In 1334, Pope Benedict XII sought the greatest artist for a commission',
      'When asked for a sample, Giotto drew a perfect circle with a single brushstroke',
      'The Pope understood: only a true master could achieve such precision',
      'This "O" secured Giotto the commission and immortalized the perfect circle',
      'The phrase "rounder than Giotto\'s O" still means perfection in Italian'
    ],
    demo: 'Whether true or legend, Giotto\'s circle represents the ultimate test of artistic mastery and human precision'
  }
};

const WhyCirclesTabContent: React.FC<WhyCirclesTabContentProps> = ({ activeTab }) => {
  const content = tabContentData[activeTab];

  return (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">
              {content.headline}
            </h3>
            
            <ul className="space-y-3">
              {content.points.map((point, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{point}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-sm font-medium text-primary/80">
                💡 {content.demo}
              </p>
            </div>

            <WhyCirclesVisualDemo activeTab={activeTab} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WhyCirclesTabContent;
