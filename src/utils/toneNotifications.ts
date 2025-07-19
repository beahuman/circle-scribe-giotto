import { ToneType } from './toneMessages';

export interface NotificationMessage {
  title: string;
  body: string;
}

export const getToneNotification = (tone: ToneType, type: 'daily' | 'streak' | 'inactivity'): NotificationMessage => {
  const notifications = {
    playful: {
      daily: [
        { title: "Circle Time! 🎯", body: "Hey hey! Got a circle in ya today?" },
        { title: "Drawing Buddy Here! 👋", body: "Your daily dose of circle magic awaits!" },
        { title: "Giotto's Calling! 🎨", body: "Time to show those circles who's boss!" },
        { title: "Circle Challenge! ⭕", body: "Ready to make some perfectly imperfect art?" },
      ],
      streak: [
        { title: "Streak Squad! 🔥", body: "Your streak misses you. And so do I." },
        { title: "Don't Break It! 💪", body: "Your circle streak is on fire - keep it alive!" },
        { title: "Streak Keeper! ⚡", body: "You're on a roll! Don't let it slip away." },
        { title: "Circle Champion! 🏆", body: "Your streak deserves another perfect moment!" },
      ],
      inactivity: [
        { title: "Where'd You Go? 🤔", body: "The circles are wondering where their friend went!" },
        { title: "Miss You! 💭", body: "Your drawing hand is getting rusty without practice!" },
        { title: "Circle Withdrawal? 😅", body: "Time to cure those circle cravings!" },
        { title: "Art Emergency! 🚨", body: "Your creative muscles need a workout!" },
      ]
    },
    calm: {
      daily: [
        { title: "Mindful Drawing", body: "A day without drawing is a day without reflection." },
        { title: "Daily Practice", body: "Return to the line. Let it guide your stillness." },
        { title: "Centered Moment", body: "Find your center through the circle's embrace." },
        { title: "Gentle Reminder", body: "Your daily practice awaits with patience." },
      ],
      streak: [
        { title: "Flowing Consistency", body: "Each day builds upon the last, like ripples in water." },
        { title: "Steady Progress", body: "Your consistent practice creates lasting change." },
        { title: "Mindful Rhythm", body: "Maintain the gentle rhythm of daily creation." },
        { title: "Peaceful Continuity", body: "Let your streak flow like a calm river." },
      ],
      inactivity: [
        { title: "Return to Center", body: "When ready, the circle awaits your return." },
        { title: "Gentle Invitation", body: "No judgment, only the invitation to begin again." },
        { title: "Mindful Return", body: "Your practice space remains open and welcoming." },
        { title: "Peaceful Reminder", body: "Drawing brings you back to your centered self." },
      ]
    },
    formal: {
      daily: [
        { title: "Daily Calibration", body: "Reminder: Your calibration draw is pending." },
        { title: "Performance Review", body: "Daily assessment protocol requires completion." },
        { title: "Precision Practice", body: "Maintaining standards requires consistent effort." },
        { title: "Technical Exercise", body: "Your geometric precision session is scheduled." },
      ],
      streak: [
        { title: "Streak Maintenance", body: "Streak maintenance opportunity available." },
        { title: "Consistency Protocol", body: "Your performance streak requires continuation." },
        { title: "Progress Preservation", body: "Maintain your established improvement trajectory." },
        { title: "Achievement Status", body: "Your consistent performance record is at risk." },
      ],
      inactivity: [
        { title: "Practice Lapse", body: "Performance degradation occurs without regular practice." },
        { title: "Skill Maintenance", body: "Motor memory requires consistent reinforcement." },
        { title: "Training Resume", body: "Your precision training protocol has been paused." },
        { title: "Performance Update", body: "Regular practice sessions optimize muscle memory." },
      ]
    },
    sarcastic: {
      daily: [
        { title: "Still Not Perfect", body: "Still not perfect, huh? Let's keep at it." },
        { title: "Daily Disappointment", body: "Time for your daily dose of almost-circles." },
        { title: "Circle Attempt #247", body: "Maybe today you'll actually draw a circle. Maybe." },
        { title: "Practice Makes... Better?", body: "Well, practice makes... something. Let's find out what." },
      ],
      streak: [
        { title: "Streak at Risk", body: "Can't draw a circle if you ghost the app." },
        { title: "Almost There", body: "Your 'perfect' streak needs you... if you care." },
        { title: "Don't Quit Now", body: "You've come this far with mediocre circles. Why stop?" },
        { title: "Streak Breaking?", body: "About to break that streak? How... predictable." },
      ],
      inactivity: [
        { title: "Missing in Action", body: "Did you give up? Or just taking a very long break?" },
        { title: "Circle Avoidance", body: "Avoiding circles won't make you better at them." },
        { title: "Comeback Time?", body: "Ready to disappoint yourself with more wobbly circles?" },
        { title: "Where Are You?", body: "The circles miss your... unique interpretation of them." },
      ]
    }
  };

  const toneNotifications = notifications[tone] || notifications.playful;
  const typeNotifications = toneNotifications[type];
  const randomIndex = Math.floor(Math.random() * typeNotifications.length);
  
  return typeNotifications[randomIndex];
};

export const getDoNotDisturbHours = () => {
  const saved = localStorage.getItem('doNotDisturbHours');
  return saved ? JSON.parse(saved) : { start: 22, end: 8 }; // 10 PM to 8 AM
};

export const setDoNotDisturbHours = (start: number, end: number) => {
  localStorage.setItem('doNotDisturbHours', JSON.stringify({ start, end }));
};

export const isWithinDoNotDisturbHours = (): boolean => {
  const { start, end } = getDoNotDisturbHours();
  const currentHour = new Date().getHours();
  
  // Handle overnight DND (e.g., 22:00 to 8:00)
  if (start > end) {
    return currentHour >= start || currentHour < end;
  }
  
  // Handle same-day DND (e.g., 13:00 to 17:00)
  return currentHour >= start && currentHour < end;
};

export const scheduleNotification = (
  tone: ToneType, 
  type: 'daily' | 'streak' | 'inactivity',
  delay: number = 0
) => {
  // In a real app, this would integrate with the native notification system
  // For now, we'll simulate with console logging and localStorage flags
  
  const notification = getToneNotification(tone, type);
  
  setTimeout(() => {
    if (!isWithinDoNotDisturbHours()) {
      console.log(`📱 Notification: ${notification.title} - ${notification.body}`);
      
      // Store notification for display in app
      const notifications = JSON.parse(localStorage.getItem('pendingNotifications') || '[]');
      notifications.push({
        ...notification,
        type,
        tone,
        timestamp: Date.now()
      });
      localStorage.setItem('pendingNotifications', JSON.stringify(notifications));
      
      // In a real implementation, you would use:
      // - Web Push API for web notifications
      // - Capacitor Push Notifications plugin for mobile
    } else {
      console.log('⏰ Notification delayed due to Do Not Disturb hours');
      // Reschedule for when DND ends
      const { end } = getDoNotDisturbHours();
      const now = new Date();
      const nextAllowed = new Date();
      nextAllowed.setHours(end, 0, 0, 0);
      
      if (nextAllowed <= now) {
        nextAllowed.setDate(nextAllowed.getDate() + 1);
      }
      
      const delayUntilAllowed = nextAllowed.getTime() - now.getTime();
      scheduleNotification(tone, type, delayUntilAllowed);
    }
  }, delay);
};