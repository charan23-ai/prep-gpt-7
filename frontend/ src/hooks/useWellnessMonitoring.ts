import { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

interface WellnessState {
  sessionStartTime: number;
  totalUsageToday: number;
  lastBreakReminder: number;
  hasShownNightWarning: boolean;
}

export const useWellnessMonitoring = () => {
  const [wellnessState, setWellnessState] = useState<WellnessState>({
    sessionStartTime: Date.now(),
    totalUsageToday: 0,
    lastBreakReminder: 0,
    hasShownNightWarning: false
  });

  useEffect(() => {
    const savedState = localStorage.getItem('wellness-state');
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('wellness-date');

    if (savedState && savedDate === today) {
      try {
        const parsed = JSON.parse(savedState);
        setWellnessState({
          ...parsed,
          sessionStartTime: Date.now(),
          hasShownNightWarning: false
        });
      } catch (error) {
        console.error('Error loading wellness state:', error);
      }
    } else {
      // Reset for new day
      const newState = {
        sessionStartTime: Date.now(),
        totalUsageToday: 0,
        lastBreakReminder: 0,
        hasShownNightWarning: false
      };
      setWellnessState(newState);
      localStorage.setItem('wellness-state', JSON.stringify(newState));
      localStorage.setItem('wellness-date', today);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const currentHour = new Date().getHours();
      const sessionDuration = now - wellnessState.sessionStartTime;
      const totalDuration = wellnessState.totalUsageToday + sessionDuration;

      // Night time warning (12:00 AM - 6:00 AM)
      if ((currentHour >= 0 && currentHour < 6) && !wellnessState.hasShownNightWarning) {
        toast({
          title: "🌙 Time for Rest",
          description: "It's late! Consider getting 8 hours of sleep for better well-being and cognitive function.",
          duration: 10000,
        });
        setWellnessState(prev => ({ ...prev, hasShownNightWarning: true }));
      }

      // 90 minute break reminder
      if (sessionDuration >= 90 * 60 * 1000 && now - wellnessState.lastBreakReminder >= 90 * 60 * 1000) {
        toast({
          title: "⏰ Break Time Reminder",
          description: "You've been studying for 90 minutes. Take a 30-minute break and interact with others for better focus!",
          duration: 15000,
        });
        setWellnessState(prev => ({ ...prev, lastBreakReminder: now }));
      }

      // 3 hour total usage warning
      if (totalDuration >= 3 * 60 * 60 * 1000 && now - wellnessState.lastBreakReminder >= 60 * 60 * 1000) {
        toast({
          title: "🏃‍♂️ Extended Usage Alert",
          description: "You've been using the app for over 3 hours today. Consider physical activities and social interactions for your well-being!",
          duration: 20000,
        });
        setWellnessState(prev => ({ ...prev, lastBreakReminder: now }));
      }

      // Update total usage
      const updatedState = {
        ...wellnessState,
        totalUsageToday: Math.floor(totalDuration / 1000)
      };
      localStorage.setItem('wellness-state', JSON.stringify(updatedState));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [wellnessState]);

  const resetSession = () => {
    setWellnessState(prev => ({
      ...prev,
      sessionStartTime: Date.now()
    }));
  };

  return {
    wellnessState,
    resetSession
  };
};