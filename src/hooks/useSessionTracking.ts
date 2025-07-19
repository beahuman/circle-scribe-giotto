
import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useSessionTracking = () => {
  const { toast } = useToast();
  
  // Track session statistics for neuroplasticity-inspired feedback
  useEffect(() => {
    const lastSession = localStorage.getItem('lastSession');
    const today = new Date().toDateString();
    
    if (lastSession !== today) {
      // New day, new session
      localStorage.setItem('lastSession', today);
      
      // Check if they've been practicing regularly
      const sessionsThisWeek = Number(localStorage.getItem('sessionsThisWeek') || '0');
      if (sessionsThisWeek > 0) {
        toast({
          title: "Welcome back!",
          description: "Regular practice builds stronger neural pathways.",
          duration: 3000
        });
      }
      
      localStorage.setItem('sessionsThisWeek', String(sessionsThisWeek + 1));
    }
  }, [toast]);
};
