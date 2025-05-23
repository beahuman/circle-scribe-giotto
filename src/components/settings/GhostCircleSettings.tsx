
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Eye } from 'lucide-react';

interface GhostCircleSettingsProps {
  showGhostCircle: boolean;
  onGhostCircleChange: (checked: boolean) => void;
}

const GhostCircleSettings = ({ showGhostCircle, onGhostCircleChange }: GhostCircleSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-medium">
        <Eye size={18} className="text-primary" />
        Ghost Circle
      </div>
      <p className="text-sm text-muted-foreground -mt-2">Show a faint outline of the target circle while drawing</p>
      <div className="flex items-center justify-between">
        <span>Display ghost circle</span>
        <Switch 
          checked={showGhostCircle}
          onCheckedChange={onGhostCircleChange}
        />
      </div>
    </div>
  );
};

export default GhostCircleSettings;
