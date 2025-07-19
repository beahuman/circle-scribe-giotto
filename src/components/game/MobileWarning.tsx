
import React from 'react';
import { MobileWarningProps } from '@/types/game';

const MobileWarning: React.FC<MobileWarningProps> = ({ onBypassMobile }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Giotto</h1>
      <p className="text-lg mb-8">This game is designed for touch devices. Please open it on a mobile device for the best experience.</p>
      <button 
        onClick={onBypassMobile} 
        className="px-6 py-3 bg-primary text-primary-foreground rounded-full"
      >
        Continue Anyway
      </button>
    </div>
  );
};

export default MobileWarning;
