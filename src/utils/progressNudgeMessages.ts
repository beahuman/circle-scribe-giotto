import { useToast } from '@/hooks/use-toast';

export const createProgressNudgeMessages = () => {
  const { toast } = useToast();

  const showFirstDailyToast = () => {
    toast({
      title: "Nice start! 🎯",
      description: "Your journey is being tracked. See your progress →",
      duration: 4000,
    });
  };

  const showFirstProgressNudgeToast = () => {
    toast({
      title: "Growing already! 🌱",
      description: "Your progress is being tracked. Ready to see the journey?",
      duration: 4000,
    });
  };

  const showStreakToast = () => {
    toast({
      title: "3 Days. That's a pattern. 🔥",
      description: "See what you're building in your progress page",
      duration: 5000,
    });
  };

  return {
    showFirstDailyToast,
    showFirstProgressNudgeToast,
    showStreakToast
  };
};