
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import WhyCirclesTabNavigation, { TabId } from './WhyCirclesTabNavigation';
import WhyCirclesTabContent from './WhyCirclesTabContent';

const WhyCirclesContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('brain');

  return (
    <div className="space-y-6">
      <WhyCirclesTabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <AnimatePresence mode="wait">
        <WhyCirclesTabContent activeTab={activeTab} />
      </AnimatePresence>

      <div className="text-center p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Ready to test your own circle-drawing mastery?
        </p>
      </div>
    </div>
  );
};

export default WhyCirclesContent;
