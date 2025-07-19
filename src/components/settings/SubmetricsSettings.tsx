
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { BarChart3 } from 'lucide-react';

interface SubmetricsSettingsProps {
  showSubmetrics: boolean;
  onSubmetricsChange: (checked: boolean) => void;
}

const SubmetricsSettings = ({ showSubmetrics, onSubmetricsChange }: SubmetricsSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-medium">
        <BarChart3 size={18} className="text-primary" />
        Visual Analytics
      </div>
      <p className="text-sm text-muted-foreground -mt-2">
        Show detailed performance indicators on your drawing
      </p>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span>Submetrics Overlay</span>
          <p className="text-xs text-muted-foreground">
            Displays symmetry, smoothness, and alignment indicators
          </p>
        </div>
        <Switch 
          checked={showSubmetrics}
          onCheckedChange={onSubmetricsChange}
        />
      </div>
    </div>
  );
};

export default SubmetricsSettings;
