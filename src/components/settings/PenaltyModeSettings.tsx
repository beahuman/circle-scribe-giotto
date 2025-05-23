
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { AlertTriangle } from 'lucide-react';

interface PenaltyModeSettingsProps {
  penaltyModeEnabled: boolean;
  onPenaltyModeChange: (checked: boolean) => void;
}

const PenaltyModeSettings = ({ penaltyModeEnabled, onPenaltyModeChange }: PenaltyModeSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-medium">
        <AlertTriangle size={18} className="text-red-500" />
        Penalty Mode
      </div>
      <p className="text-sm text-muted-foreground -mt-2">
        Harder circles, less time, and extra sarcastic feedback
      </p>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Always enable Penalty Mode
          </label>
          <p className="text-xs text-muted-foreground">
            Feeling brave? Smaller circles, stricter scoring!
          </p>
        </div>
        <Switch 
          checked={penaltyModeEnabled}
          onCheckedChange={onPenaltyModeChange}
          className={penaltyModeEnabled ? "bg-red-500" : ""}
        />
      </div>
    </div>
  );
};

export default PenaltyModeSettings;
