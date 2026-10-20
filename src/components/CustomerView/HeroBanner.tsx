import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, ShieldCheck, Zap, ArrowDown, Star, UtensilsCrossed } from 'lucide-react';

const HERO_PRIMARY_IMAGE =
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80';
const HERO_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80';

export const HeroBanner: React.FC = () => {
  const { setSelectedCategoryId } = useApp();
  const [bgImageSrc, setBgImageSrc] = useState(HERO_PRIMARY_IMAGE);
  const [cardImageSrc, setCardImageSrc] = useState(HERO_PRIMARY_IMAGE);

  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white rounded-2xl sm:rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 sm:mt-6 shadow-xl border border-slate-800">
      {/* Background Image with Ambient Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImageSrc}
          alt="Không gian Căn tin EatNow nền"
          className="w-full h-full object-cover object-center filter brightness-[0.22] scale-105 transition-all duration-700"
          loading="eager"
          onError={() => setBgImageSrc(HERO_FALLBACK_IMAGE)}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-900/60" />
      </div>

      <div className="relative z-10 px-6 py-8 sm:py-12 lg:py-14 lg:px-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-10">
        {/* Left Column: Headline, Description & CTAs */}
        <div className="flex-1 flex flex-col items-start justify-center">
          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400 mb-3 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Căn tin Đại học Thông Minh</span>
            <span aria-hidden="true">·</span>
            <span>Phục vụ: 06:30 – 18:30</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-bold tracking-tight text-white max-w-2xl leading-[1.25]">
            Đặt món trước, đến nhận ngay — <span className="text-amber-400">Không còn cảnh chờ đợi</span>
          </h1>

          <p className="mt-3.5 text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
            Giải pháp đặt bữa trưa & giải khát nhanh chóng cho sinh viên và giảng viên. Chọn khung giờ lấy món yêu thích, thanh toán bảo mật qua Ví CanteenGo và nhận món nóng hổi ngay khi đến quầy.
          </p>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={scrollToMenu}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Khám phá thực đơn</span>
              <ArrowDown className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setSelectedCategoryId('mon-man');
                scrollToMenu();
              }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm backdrop-blur-sm border border-white/20 transition-colors cursor-pointer"
            >
              Cơm trưa nóng hổi
            </button>

            <button
              onClick={() => {
                setSelectedCategoryId('do-uong');
                scrollToMenu();
              }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm backdrop-blur-sm border border-white/20 transition-colors cursor-pointer"
            >
              Trà đào & Cafe
            </button>
          </div>

          {/* Feature proof strip */}
          <div className="mt-8 pt-5 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Tiết kiệm 15–20 phút giờ nghỉ trưa</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Hẹn giờ nhận từ 10:45 – 13:00</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Hoàn tiền tự động 100% nếu hết suất</span>
            </div>
          </div>
        </div>

        {/* Right Column: Featured Canteen Image Card */}
        <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0">
          <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-slate-800/80 group">
            {/* Aspect Ratio Container */}
            <div className="aspect-4/3 w-full overflow-hidden relative">
              <img
                src={cardImageSrc}
                alt="Không gian Căn tin EatNow"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="eager"
                onError={() => setCardImageSrc(HERO_FALLBACK_IMAGE)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
            </div>

            {/* Badges on card */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-xs font-semibold text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-3.5" />
              <span>Không gian Căn tin EatNow</span>
            </div>

            <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-950 text-xs font-bold shadow-md">
              <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
              <span>4.9 (1.2k+)</span>
            </div>

            {/* Bottom info banner on card */}
            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-white">Đặt món trước, đến nhận ngay</p>
                  <p className="text-[11px] text-amber-400/90">Bếp đang hoạt động sẵn sàng</p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">
                  Không chờ đợi
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
