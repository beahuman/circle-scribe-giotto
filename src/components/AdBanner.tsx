
import React from 'react';
import { useSubscription } from '@/hooks/useSubscription';

const AdBanner: React.FC = () => {
  const { isPremium } = useSubscription();
  
  // Don't show ads for premium users
  if (isPremium) {
    return null;
  }
  
  // Placeholder for AdMob banner ad
  return (
    <div 
      id="ad-banner-container" 
      className="w-full flex justify-center items-center py-2"
    >
      {/* AdMob banner will be inserted here */}
    </div>
  );
};

export default AdBanner;
