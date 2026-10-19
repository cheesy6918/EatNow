import React from 'react';
import { Megaphone, Zap, Sparkles } from 'lucide-react';

export const MarqueeBanner: React.FC = () => {
  const defaultText =
    "🎉 Chào mừng đến với Căn tin EatNow! Đặt trước nhận ngay — Giảm 10% cho đơn hàng đầu tiên qua Ví CanteenGo | Thực đơn trưa phục vụ từ 10:30 đến 13:30 mỗi ngày | Chúc bạn một bữa ăn ngon miệng! 🍱🥤";

  const [announcementText, setAnnouncementText] = React.useState<string>(() => {
    return localStorage.getItem('eatnow_announcement') || defaultText;
  });

  React.useEffect(() => {
    const handleUpdate = () => {
      const val = localStorage.getItem('eatnow_announcement');
      if (val) setAnnouncementText(val);
    };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('eatnow_announcement_updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('eatnow_announcement_updated', handleUpdate);
    };
  }, []);

  return (
    <div className="bg-amber-50/90 border-b border-amber-200/80 text-slate-800 text-xs py-2 px-3 sm:px-4 overflow-hidden relative select-none">
      <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-3">
        {/* Fixed leading badge */}
        <div className="shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold px-2.5 py-0.5 rounded-full text-[10.5px] shadow-2xs z-10">
          <Megaphone className="w-3.5 h-3.5" />
          <span className="tracking-wide uppercase font-extrabold hidden sm:inline">Thông báo</span>
        </div>

        {/* Marquee Track with gradient fade edges */}
        <div className="flex-1 overflow-hidden relative">
          {/* Subtle gradient masks for smooth edge fade */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-amber-50/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-amber-50/80 to-transparent z-10 pointer-events-none" />

          {/* Scrolling text container - pauses on hover */}
          <div className="animate-marquee whitespace-nowrap font-medium text-slate-700 hover:text-slate-950 transition-colors cursor-default py-0.5">
            <span className="mx-6 inline-flex items-center gap-2">
              <Zap className="w-3 h-3 text-amber-600 inline" />
              <span>{announcementText}</span>
            </span>
            <span className="mx-6 inline-flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-amber-600 inline" />
              <span>{announcementText}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
