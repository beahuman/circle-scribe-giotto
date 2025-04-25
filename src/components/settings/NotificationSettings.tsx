
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Bell } from 'lucide-react';

interface NotificationSettingsProps {
  notifications: boolean;
  onNotificationsChange: (checked: boolean) => void;
}

const NotificationSettings = ({ notifications, onNotificationsChange }: NotificationSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-medium">
        <Bell size={18} className="text-primary" />
        Notifications
      </div>
      <div className="flex items-center justify-between">
        <span>Enable Notifications</span>
        <Switch 
          checked={notifications}
          onCheckedChange={onNotificationsChange}
        />
      </div>
    </div>
  );
};

export default NotificationSettings;
