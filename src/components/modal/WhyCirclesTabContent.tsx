
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
    headline: 'Circles & Cognitive Assessment',
    points: [
      'Drawing circles engages multiple brain regions simultaneously',
      'Tests motor control, spatial awareness, and cognitive planning',
      'Reveals insights into neurological health and development',
      'Used in psychological evaluations worldwide'
    ],
    demo: 'Perfect circles require coordination between visual cortex, motor cortex, and cerebellum'
  },
  medical: {
    headline: 'Therapeutic Applications',
    points: [
      'Stroke recovery programs use circle drawing exercises',
      'Helps rebuild fine motor skills and hand-eye coordination',
      'Measures progress in neurological rehabilitation',
      'Non-invasive assessment tool for cognitive function'
    ],
    demo: 'Therapists track circle accuracy to monitor patient improvement over time'
  },
  giotto: {
    headline: 'The Perfect Circle Master',
    points: [
      'Pope Benedict XI asked for proof of artistic skill',
      'Giotto drew a perfect circle freehand in red paint',
      'This single gesture secured him the commission',
      '"O" became synonymous with perfection and mastery'
    ],
    demo: 'The phrase "rounder than Giotto\'s O" still means perfection in Italian'
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
