import React from 'react';
import { FoodItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { Plus, Minus, Star, Clock, AlertTriangle } from 'lucide-react';
import { FoodImage } from '../common/FoodImage';

interface FoodCardProps {
  food: FoodItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const { addToCart, cart, updateCartQuantity, setSelectedFood } = useApp();

  // Check if item is already in cart
  const cartItem = cart.find((c) => c.foodItem.id === food.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = !food.isAvailable || food.stockQuantity <= 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:border-slate-300 hover:shadow-md transition-all duration-200">
      {/* Product Image Area with Fixed Aspect Ratio & Multi-stage Fallback */}
      <div
        onClick={() => setSelectedFood(food)}
        className="relative aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer"
      >
        <FoodImage
          src={food.image}
          alt={food.name}
          categoryId={food.categoryId}
          categoryName={food.categoryName}
          aspectRatioClass="aspect-[4/3]"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Stock status overlay if out of stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[1px] flex items-center justify-center p-3">
            <div className="flex items-center gap-1.5 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-rose-600/90 shadow">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Hết món</span>
            </div>
          </div>
        )}

        {/* Prep Time Tag (quiet text overlay) */}
        {!isOutOfStock && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/70 backdrop-blur-sm text-[11px] font-medium text-white flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>~{food.prepTimeMinutes} phút</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata (Zero-pill discipline) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1 flex-wrap">
            <span>{food.categoryName}</span>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-0.5 text-amber-600 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{(food.rating ?? 5.0).toFixed(1)}</span>
            </div>
            <span className="text-slate-400">({food.reviewCount ?? 0})</span>
            {food.calories && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-slate-600 font-mono-nums font-medium">
                  {food.calories} kcal
                </span>
              </>
            )}
            {food.allergens && food.allergens.length > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-700 font-medium text-[11px]" title={`Chứa: ${food.allergens.join(', ')}`}>
                  ⚠️ Dị ứng
                </span>
              </>
            )}
          </div>

          {/* Dish Name */}
          <h3
            onClick={() => setSelectedFood(food)}
            className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-amber-600 cursor-pointer transition-colors"
            title={food.name}
          >
            {food.name}
          </h3>

          {/* Short description */}
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {food.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold font-mono-nums text-slate-900">
                {food.price.toLocaleString('vi-VN')}₫
              </span>
              {food.originalPrice && food.originalPrice > food.price && (
                <span className="text-xs font-mono-nums text-slate-400 line-through">
                  {food.originalPrice.toLocaleString('vi-VN')}₫
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {isOutOfStock ? (
                <span className="text-rose-600 font-semibold">Tạm hết hôm nay</span>
              ) : (
                `Còn ${food.stockQuantity} suất`
              )}
            </span>
          </div>

          {/* Action button */}
          <div>
            {isOutOfStock ? (
              <button
                disabled
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-400 text-xs font-medium cursor-not-allowed"
              >
                Hết món
              </button>
            ) : inCartQty > 0 ? (
              /* Quantity Stepper */
              <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-1 border border-slate-200">
                <button
                  onClick={() => updateCartQuantity(food.id, inCartQty - 1)}
                  className="w-6 h-6 rounded-md bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-2xs"
                  title="Giảm số lượng"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-5 text-center text-xs font-bold font-mono-nums text-slate-900">
                  {inCartQty}
                </span>
                <button
                  onClick={() => addToCart(food, 1)}
                  disabled={inCartQty >= food.stockQuantity}
                  className="w-6 h-6 rounded-md bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
                  title="Tăng số lượng"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(food, 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-xs active:scale-95 whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Chọn món</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
