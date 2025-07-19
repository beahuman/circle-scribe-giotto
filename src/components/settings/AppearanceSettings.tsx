
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from 'lucide-react';

interface AppearanceSettingsProps {
  darkMode: boolean;
  onDarkModeChange: (checked: boolean) => void;
}

const AppearanceSettings = ({ darkMode, onDarkModeChange }: AppearanceSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-medium">
        {darkMode ? <Moon size={18} className="text-primary" /> : <Sun size={18} className="text-primary" />}
        Appearance
      </div>
      <div className="flex items-center justify-between">
        <span>Dark Mode</span>
        <Switch 
          checked={darkMode}
          onCheckedChange={onDarkModeChange}
        />
      </div>
    </div>
  );
};

export default AppearanceSettings;
