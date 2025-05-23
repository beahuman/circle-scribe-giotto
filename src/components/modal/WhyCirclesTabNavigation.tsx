
import React from 'react';
import { Brain, Heart, Palette } from "lucide-react";

export type TabId = 'brain' | 'medical' | 'giotto';

interface Tab {
  id: TabId;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}

interface WhyCirclesTabNavigationProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
}

export const tabs: Tab[] = [
  {
    id: 'brain' as const,
    icon: Brain,
    title: 'Brain Function',
  },
  {
    id: 'medical' as const,
    icon: Heart,
    title: 'Medical Rehab',
  },
  {
    id: 'giotto' as const,
    icon: Palette,
    title: "Giotto's Legend",
  }
];

const WhyCirclesTabNavigation: React.FC<WhyCirclesTabNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="flex gap-2 p-1 bg-muted rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
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
  );
};

export default WhyCirclesTabNavigation;
