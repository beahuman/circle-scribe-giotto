
import React from 'react';

interface PenaltyModeInfoProps {
  isPenaltyMode: boolean;
  penaltyShapesRequired: number;
  penaltyShapesCompleted: number;
}

const PenaltyModeInfo: React.FC<PenaltyModeInfoProps> = ({
  isPenaltyMode,
  penaltyShapesRequired,
  penaltyShapesCompleted
}) => {
  if (!isPenaltyMode) return null;
  
  return (
    <div className="bg-red-100 border border-red-200 p-3 rounded-lg max-w-xs mx-auto">
      <p className="text-red-500 font-medium text-center">
        Shape Challenge Mode!
      </p>
      <p className="text-sm text-red-400 mt-1 text-center">
        Complete {penaltyShapesRequired} shape challenges to return to circle drawing.
        {penaltyShapesCompleted > 0 && ` (${penaltyShapesCompleted}/${penaltyShapesRequired} completed)`}
      </p>
      
      {/* Added next shape message */}
      {penaltyShapesCompleted > 0 && penaltyShapesCompleted < penaltyShapesRequired && (
        <p className="text-sm text-red-500 font-medium mt-2 text-center">
          Moving on to the next shape challenge!
        </p>
      )}
    </div>
  );
};

export default PenaltyModeInfo;
