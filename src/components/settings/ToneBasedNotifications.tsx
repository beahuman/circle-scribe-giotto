import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Clock, Shield } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useToneSystem } from '@/hooks/useToneSystem';
import { getToneNotification } from '@/utils/toneNotifications';
import { Badge } from "@/components/ui/badge";

const ToneBasedNotifications = () => {
  const {
    toneBasedNotifications,
    dailyToneReminders,
    streakToneReminders,
    inactivityToneReminders,
    doNotDisturbStart,
    doNotDisturbEnd,
    handleToneBasedNotificationsToggle,
    handleDailyToneRemindersToggle,
    handleStreakToneRemindersToggle,
    handleInactivityToneRemindersToggle,
    handleDoNotDisturbStartChange,
    handleDoNotDisturbEndChange,
  } = useSettings();

  const { selectedTone } = useToneSystem();

  // Get sample notification for current tone
  const sampleNotification = getToneNotification(selectedTone, 'daily');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-medium">
        <Palette size={18} className="text-primary" />
        Tone-Based Notifications
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-medium">Enable Tone-Based Notifications</span>
            <p className="text-xs text-muted-foreground">
              Receive notifications that match your selected tone personality
            </p>
          </div>
          <Switch 
            checked={toneBasedNotifications}
            onCheckedChange={handleToneBasedNotificationsToggle}
          />
        </div>

        {toneBasedNotifications && (
          <>
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="capitalize">{selectedTone}</Badge>
                <span className="text-xs text-muted-foreground">Sample notification:</span>
              </div>
              <p className="text-sm font-medium">{sampleNotification.title}</p>
              <p className="text-xs text-muted-foreground">{sampleNotification.body}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-medium">Daily Calibration Reminders</span>
                  <p className="text-xs text-muted-foreground">
                    Tone-aware nudges for your daily drawing practice
                  </p>
                </div>
                <Switch 
                  checked={dailyToneReminders}
                  onCheckedChange={handleDailyToneRemindersToggle}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-medium">Streak Maintenance</span>
                  <p className="text-xs text-muted-foreground">
                    Personality-driven reminders to keep your streak alive
                  </p>
                </div>
                <Switch 
                  checked={streakToneReminders}
                  onCheckedChange={handleStreakToneRemindersToggle}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-medium">Inactivity Check-ins</span>
                  <p className="text-xs text-muted-foreground">
                    Gentle, tone-aware invitations to return after dormancy
                  </p>
                </div>
                <Switch 
                  checked={inactivityToneReminders}
                  onCheckedChange={handleInactivityToneRemindersToggle}
                />
              </div>
            </div>

            {(dailyToneReminders || streakToneReminders || inactivityToneReminders) && (
              <div className="space-y-3 pt-2 border-t border-border/50">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Shield size={14} />
                  Do Not Disturb Hours
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Quiet Time Starts</label>
                    <Select value={doNotDisturbStart.toString()} onValueChange={(value) => handleDoNotDisturbStartChange(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {i.toString().padStart(2, '0')}:00
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Quiet Time Ends</label>
                    <Select value={doNotDisturbEnd.toString()} onValueChange={(value) => handleDoNotDisturbEndChange(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {i.toString().padStart(2, '0')}:00
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Notifications will be delayed during these hours to respect your quiet time.
                </p>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="text-sm font-medium mb-2">Giotto's Personality</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Notifications adapt to your chosen tone, making each reminder feel like it's truly from Giotto's unique voice and perspective.
        </p>
      </div>
    </div>
  );
};

export default ToneBasedNotifications;