
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, Bell, Palette, Moon, Sun } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();

  const handleNotificationToggle = (checked: boolean) => {
    setNotifications(checked);
    toast({
      title: "Notification Settings",
      description: checked ? "Notifications enabled" : "Notifications disabled"
    });
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    toast({
      title: "Appearance",
      description: checked ? "Dark mode enabled" : "Light mode enabled"
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-background to-background/80 pb-24">
      <div className="flex items-center mb-6">
        <SettingsIcon size={24} className="mr-2 text-primary" />
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
          App Settings
        </h1>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <Card className="border-primary/20 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-400/10">
            <CardTitle className="flex items-center gap-2">
              <Bell size={18} className="text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex items-center justify-between">
            <span>Enable Notifications</span>
            <Switch 
              checked={notifications}
              onCheckedChange={handleNotificationToggle}
            />
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-400/10">
            <CardTitle className="flex items-center gap-2">
              {darkMode ? <Moon size={18} className="text-primary" /> : <Sun size={18} className="text-primary" />}
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex items-center justify-between">
            <span>Dark Mode</span>
            <Switch 
              checked={darkMode}
              onCheckedChange={handleDarkModeToggle}
            />
          </CardContent>
        </Card>

        <Button variant="outline" className="w-full">
          <Palette size={18} className="mr-2" />
          Customize Theme
        </Button>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Settings;
