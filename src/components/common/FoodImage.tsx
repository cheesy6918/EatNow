import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Coffee, Salad, Cookie, Sparkles } from 'lucide-react';

interface FoodImageProps {
  src?: string;
  alt: string;
  categoryId?: string;
  categoryName?: string;
  className?: string;
  aspectRatioClass?: string; // e.g. 'aspect-[4/3]' or 'aspect-[16/9]'
}

// Curated high quality verified Unsplash fallback images by category
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'mon-man': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  'mon-chay': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
  'do-uong': 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
  'an-vat': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
};

export const FoodImage: React.FC<FoodImageProps> = ({
  src,
  alt,
  categoryId,
  categoryName,
  className = 'w-full h-full object-cover',
  aspectRatioClass = 'aspect-[4/3]',
}) => {
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);
  const [fallbackStage, setFallbackStage] = useState<0 | 1 | 2>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // When src prop changes, reset
  useEffect(() => {
    setCurrentSrc(src);
    setFallbackStage(0);
    setIsLoaded(false);
  }, [src]);

  const getCategoryFallback = () => {
    if (categoryId && CATEGORY_FALLBACK_IMAGES[categoryId]) {
      return CATEGORY_FALLBACK_IMAGES[categoryId];
    }
    return CATEGORY_FALLBACK_IMAGES.default;
  };

  const handleError = () => {
    if (fallbackStage === 0) {
      // Step 1: Try the category-appropriate Unsplash image
      const fallbackUrl = getCategoryFallback();
      if (fallbackUrl && fallbackUrl !== currentSrc) {
        setFallbackStage(1);
        setCurrentSrc(fallbackUrl);
        return;
      }
    }
    // Step 2: If fallback also fails, render graphic placeholder
    setFallbackStage(2);
  };

  const getCategoryIcon = () => {
    switch (categoryId) {
      case 'do-uong':
        return <Coffee className="w-6 h-6 text-amber-700" />;
      case 'mon-chay':
        return <Salad className="w-6 h-6 text-emerald-700" />;
      case 'an-vat':
        return <Cookie className="w-6 h-6 text-orange-700" />;
      case 'mon-man':
      default:
        return <UtensilsCrossed className="w-6 h-6 text-amber-700" />;
    }
  };

  // If stage 2 reached (both primary and remote fallback failed), render graphic card
  if (fallbackStage === 2 || !currentSrc) {
    return (
      <div
        className={`relative w-full ${aspectRatioClass} bg-gradient-to-br from-amber-100/90 via-orange-50 to-amber-200/80 p-4 flex flex-col items-center justify-center text-center select-none overflow-hidden`}
      >
        {/* Subtle decorative circles */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-amber-300/20 blur-xl pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-orange-300/20 blur-xl pointer-events-none" />

        <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-xs border border-amber-200/80 shadow-xs flex items-center justify-center mb-2">
          {getCategoryIcon()}
        </div>

        <span className="relative z-10 text-xs font-bold text-slate-900 line-clamp-2 px-2 leading-tight">
          {alt}
        </span>

        <span className="relative z-10 mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-white/70 px-2 py-0.5 rounded-full border border-amber-200/60 shadow-2xs">
          <Sparkles className="w-2.5 h-2.5 text-amber-600" />
          <span>{categoryName || 'Món ngon Căn tin'}</span>
        </span>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${aspectRatioClass} bg-slate-100 overflow-hidden`}>
      {/* Skeleton loading pulse placeholder while image loads */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-200/70 to-slate-100 animate-pulse" />
      )}

      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
