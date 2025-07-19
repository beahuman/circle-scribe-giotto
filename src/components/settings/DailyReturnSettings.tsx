import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Gift, Sparkles, Clock } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

const DailyReturnSettings = () => {
  const {
    dailyNotifications,
    streakMilestoneNotifications,
    dailyRewards,
    habitCues,
    reminderTime,
    handleDailyNotificationsToggle,
    handleStreakMilestoneNotificationsToggle,
    handleDailyRewardsToggle,
    handleHabitCuesToggle,
    handleReminderTimeChange
  } = useSettings();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-medium">
        <Bell size={18} className="text-primary" />
        Daily Return System
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium">Daily Draw Reminders</span>
            <p className="text-xs text-muted-foreground">
              Gentle notifications to maintain your streak
            </p>
          </div>
          <Switch 
            checked={dailyNotifications}
            onCheckedChange={handleDailyNotificationsToggle}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium">Streak Milestone Alerts</span>
            <p className="text-xs text-muted-foreground">
              Celebrate when you reach 3, 7, 14+ day streaks
            </p>
          </div>
          <Switch 
            checked={streakMilestoneNotifications}
            onCheckedChange={handleStreakMilestoneNotificationsToggle}
          />
        </div>
        
        {(dailyNotifications || streakMilestoneNotifications) && (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-sm font-medium flex items-center gap-2">
                <Clock size={14} />
                Reminder Time
              </span>
              <p className="text-xs text-muted-foreground">
                When you prefer to receive reminders
              </p>
            </div>
            <Select value={reminderTime} onValueChange={handleReminderTimeChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="midday">Midday</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium flex items-center gap-2">
              <Gift size={14} />
              Daily Completion Rewards
            </span>
            <p className="text-xs text-muted-foreground">
              Visual celebrations for completing calibrations
            </p>
          </div>
          <Switch 
            checked={dailyRewards}
            onCheckedChange={handleDailyRewardsToggle}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium flex items-center gap-2">
              <Sparkles size={14} />
              Gentle Habit Cues
            </span>
            <p className="text-xs text-muted-foreground">
              Subtle visual reminders when you haven't drawn today
            </p>
          </div>
          <Switch 
            checked={habitCues}
            onCheckedChange={handleHabitCuesToggle}
          />
        </div>
      </div>
      
      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="text-sm font-medium mb-2">Why Daily Practice?</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Consistency trains your neural pathways. Even one circle a day builds lasting precision and motor memory formation.
        </p>
      </div>
    </div>
  );
};

export default DailyReturnSettings;