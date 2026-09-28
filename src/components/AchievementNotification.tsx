import React, { useEffect, useState } from 'react';
import { Achievement } from '../game/achievements';
import { Trophy, X, Sparkles } from 'lucide-react';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 350); // wait for fade out
      }, 4200);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [achievement, onDismiss]);

  if (!achievement) return null;

  return (
    <div
      id="achievement-toast"
      className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-auto transition-all duration-300 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
      }`}
    >
      <div className="relative flex items-center gap-3.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl bg-neutral-950/95 border-2 border-amber-400 text-white shadow-[0_0_35px_rgba(251,191,36,0.45)] backdrop-blur-md max-w-sm sm:max-w-md w-full overflow-hidden">
        {/* Shiny golden accent glow beam */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent animate-pulse" />

        {/* Trophy / Badge Icon */}
        <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-xl shadow-md shrink-0 border border-yellow-200/50">
          <span>{achievement.badge}</span>
          <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 text-amber-200 animate-spin" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-400">
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>ACHIEVEMENT UNLOCKED!</span>
          </div>
          <h4 className="font-extrabold text-sm text-white truncate drop-shadow-sm">
            {achievement.title}
          </h4>
          <p className="text-[11px] text-neutral-300 line-clamp-1 leading-snug">
            {achievement.description}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onDismiss, 350);
          }}
          className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
          title="Dismiss Notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
