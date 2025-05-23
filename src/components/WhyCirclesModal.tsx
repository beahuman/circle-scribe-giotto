
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Heart, Palette, Info, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

interface WhyCirclesModalProps {
  children: React.ReactNode;
}

const WhyCirclesModal: React.FC<WhyCirclesModalProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'brain' | 'medical' | 'giotto'>('brain');

  const tabs = [
    {
      id: 'brain' as const,
      icon: Brain,
      title: 'Brain Function',
      content: {
        headline: 'Circles & Cognitive Assessment',
        points: [
          'Drawing circles engages multiple brain regions simultaneously',
          'Tests motor control, spatial awareness, and cognitive planning',
          'Reveals insights into neurological health and development',
          'Used in psychological evaluations worldwide'
        ],
        demo: 'Perfect circles require coordination between visual cortex, motor cortex, and cerebellum'
      }
    },
    {
      id: 'medical' as const,
      icon: Heart,
      title: 'Medical Rehab',
      content: {
        headline: 'Therapeutic Applications',
        points: [
          'Stroke recovery programs use circle drawing exercises',
          'Helps rebuild fine motor skills and hand-eye coordination',
          'Measures progress in neurological rehabilitation',
          'Non-invasive assessment tool for cognitive function'
        ],
        demo: 'Therapists track circle accuracy to monitor patient improvement over time'
      }
    },
    {
      id: 'giotto' as const,
      icon: Palette,
      title: "Giotto's Legend",
      content: {
        headline: 'The Perfect Circle Master',
        points: [
          'Pope Benedict XI asked for proof of artistic skill',
          'Giotto drew a perfect circle freehand in red paint',
          'This single gesture secured him the commission',
          '"O" became synonymous with perfection and mastery'
        ],
        demo: 'The phrase "rounder than Giotto\'s O" still means perfection in Italian'
      }
    }
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab)!;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Info className="h-5 w-5 text-primary" />
            Why Circles?
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all flex-1 ${
                  activeTab === tab.id
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{tab.title}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
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
                      {currentTab.content.headline}
                    </h3>
                    
                    <ul className="space-y-3">
                      {currentTab.content.points.map((point, index) => (
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
                        💡 {currentTab.content.demo}
                      </p>
                    </div>

                    {/* Interactive Visual Demo */}
                    {activeTab === 'brain' && (
                      <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                        <div className="flex items-center justify-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-blue-200 animate-pulse flex items-center justify-center">
                            <Brain className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1 h-2 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-full animate-pulse" />
                          <div className="w-12 h-12 rounded-full border-2 border-purple-300 border-dashed animate-spin" />
                        </div>
                        <p className="text-xs text-center mt-2 text-muted-foreground">
                          Brain → Processing → Perfect Circle
                        </p>
                      </div>
                    )}

                    {activeTab === 'medical' && (
                      <div className="mt-6 p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
                        <div className="grid grid-cols-3 gap-2">
                          {[1, 2, 3].map((level) => (
                            <div key={level} className="text-center">
                              <div className={`w-8 h-8 mx-auto rounded-full border-2 ${
                                level === 1 ? 'border-red-300 border-dashed' :
                                level === 2 ? 'border-yellow-400 border-dotted' :
                                'border-green-500'
                              }`} />
                              <p className="text-xs mt-1 text-muted-foreground">
                                {level === 1 ? 'Recovery' : level === 2 ? 'Progress' : 'Mastery'}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'giotto' && (
                      <div className="mt-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
                        <div className="flex items-center justify-center">
                          <div className="relative">
                            <div className="w-16 h-16 rounded-full border-4 border-amber-400 animate-pulse" />
                            <Palette className="absolute inset-0 m-auto h-6 w-6 text-amber-600" />
                          </div>
                        </div>
                        <p className="text-xs text-center mt-2 text-muted-foreground">
                          "O di Giotto" - The Perfect Circle
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Call to Action */}
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Ready to test your own circle-drawing mastery?
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhyCirclesModal;
