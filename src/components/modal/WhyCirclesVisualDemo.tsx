
import React from 'react';
import { Brain, Palette } from "lucide-react";
import { TabId } from './WhyCirclesTabNavigation';

interface WhyCirclesVisualDemoProps {
  activeTab: TabId;
}

const WhyCirclesVisualDemo: React.FC<WhyCirclesVisualDemoProps> = ({ activeTab }) => {
  if (activeTab === 'brain') {
    return (
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
    );
  }

  if (activeTab === 'medical') {
    return (
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
    );
  }

  if (activeTab === 'giotto') {
    return (
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
    );
  }

  return null;
};

export default WhyCirclesVisualDemo;
