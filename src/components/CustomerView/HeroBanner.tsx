import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, ShieldCheck, Zap, ArrowDown, Sparkles, Utensils } from 'lucide-react';

const HERO_PRIMARY_IMAGE =
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=85';
const HERO_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85';

export const HeroBanner: React.FC = () => {
  const { setSelectedCategoryId } = useApp();
  const [bgImageSrc, setBgImageSrc] = useState(HERO_PRIMARY_IMAGE);

  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="relative overflow-hidden text-white rounded-2xl sm:rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 sm:mt-6 shadow-2xl border border-white/10 bg-slate-950"
      style={{
        backgroundImage: `url(${bgImageSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Fallback image handler for robust production rendering */}
      <img
        src={bgImageSrc}
        alt="Không gian Căn tin EatNow"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
        loading="eager"
        onError={() => setBgImageSrc(HERO_FALLBACK_IMAGE)}
      />

      {/* Dark gradient overlay to guarantee text legibility & contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/55 backdrop-blur-[0.5px]" />
      <div className="absolute inset-0 bg-black/30" />

      {/* Content Container */}
      <div className="relative z-10 px-6 py-10 sm:py-14 lg:py-16 sm:px-10 lg:px-12 max-w-4xl">
        {/* Top Tag / Status */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-300 mb-4 bg-amber-500/15 px-3.5 py-1.5 rounded-full border border-amber-400/30 backdrop-blur-md shadow-xs">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>CĂN TIN ĐẠI HỌC THÔNG MINH</span>
          <span aria-hidden="true" className="text-amber-400/50">·</span>
          <span>Phục vụ: 06:30 – 18:30</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.2] drop-shadow-md">
          Đặt món trước, đến nhận ngay —{' '}
          <span className="text-amber-400 inline-block">Không còn cảnh chờ đợi</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed max-w-2xl drop-shadow-sm font-normal">
          Giải pháp đặt bữa trưa & giải khát nhanh chóng cho sinh viên và giảng viên. Chọn khung giờ lấy món yêu thích, thanh toán bảo mật qua Ví CanteenGo và nhận món nóng hổi ngay khi đến quầy.
        </p>

        {/* Action Buttons */}
        <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
          <button
            onClick={scrollToMenu}
            className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-lg hover:shadow-amber-500/25 active:scale-95 cursor-pointer"
          >
            <Utensils className="w-4 h-4" />
            <span>Khám phá thực đơn</span>
            <ArrowDown className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setSelectedCategoryId('mon-man');
              scrollToMenu();
            }}
            className="px-4.5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm sm:text-base backdrop-blur-md border border-white/20 transition-all hover:border-white/40 cursor-pointer"
          >
            🍱 Cơm trưa nóng hổi
          </button>

          <button
            onClick={() => {
              setSelectedCategoryId('do-uong');
              scrollToMenu();
            }}
            className="px-4.5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm sm:text-base backdrop-blur-md border border-white/20 transition-all hover:border-white/40 cursor-pointer"
          >
            🧋 Trà đào & Cafe
          </button>
        </div>

        {/* Feature proof strip */}
        <div className="mt-9 pt-6 border-t border-white/20 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-400/20 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-amber-300" />
            </div>
            <span className="font-medium">Tiết kiệm 15–20 phút giờ nghỉ trưa</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-400/20 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-amber-300" />
            </div>
            <span className="font-medium">Hẹn giờ nhận từ 10:45 – 13:00</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-400/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
            </div>
            <span className="font-medium">Hoàn tiền tự động 100% nếu hết suất</span>
          </div>
        </div>
      </div>
    </section>
  );
};
