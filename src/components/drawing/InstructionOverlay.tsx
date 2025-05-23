
import React from 'react';

interface InstructionOverlayProps {
  visible: boolean;
}

const InstructionOverlay: React.FC<InstructionOverlayProps> = ({ visible }) => {
  if (!visible) {
    return null;
  }

  return (
    <div className="fixed top-6 inset-x-0 mx-auto w-fit bg-[#765ED8] px-6 py-2 rounded-full backdrop-blur-sm animate-fade-in">
      <span className="text-lg font-medium text-white block text-center">Draw the circle</span>
    </div>
  );
};

export default InstructionOverlay;
