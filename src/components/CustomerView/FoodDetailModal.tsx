import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Star,
  Clock,
  Flame,
  Plus,
  Minus,
  ShoppingBag,
  MessageSquare,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Dna,
  Wheat,
  Activity,
  Heart,
  Info,
} from 'lucide-react';

import { FoodImage } from '../common/FoodImage';

export const FoodDetailModal: React.FC = () => {
  const { selectedFood, setSelectedFood, addToCart, reviews, currentUser, openAuthModal, showToast } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'nutrition' | 'reviews'>('info');

  if (!selectedFood) return null;

  const isOutOfStock = !selectedFood.isAvailable || selectedFood.stockQuantity <= 0;
  const foodReviews = reviews.filter((r) => r.foodId === selectedFood.id);

  // Nutritional values (with sensible fallback if nutrition object wasn't specified)
  const calories = selectedFood.calories || selectedFood.nutrition?.calories || 450;
  const protein =
    selectedFood.nutrition?.protein ??
    Math.round((calories * 0.2) / 4); // 20% protein estimate
  const carbs =
    selectedFood.nutrition?.carbs ??
    Math.round((calories * 0.55) / 4); // 55% carbs estimate
  const fat =
    selectedFood.nutrition?.fat ??
    Math.round((calories * 0.25) / 9); // 25% fat estimate
  const fiber = selectedFood.nutrition?.fiber ?? 3.0;
  const sodium = selectedFood.nutrition?.sodiumMg ?? 650;

  // Percentage of daily value based on standard 2000 kcal diet
  const dailyCaloriesPercent = Math.min(100, Math.round((calories / 2000) * 100));
  const dailyProteinPercent = Math.min(100, Math.round((protein / 50) * 100));
  const dailyCarbsPercent = Math.min(100, Math.round((carbs / 275) * 100));
  const dailyFatPercent = Math.min(100, Math.round((fat / 78) * 100));

  // Allergens
  const allergens = selectedFood.allergens || [];
  const hasAllergens = allergens.length > 0;

  const handleAddToCart = () => {
    if (!currentUser) {
      showToast('Vui lòng đăng nhập để thêm món vào giỏ hàng!', 'info');
      openAuthModal('login');
      return;
    }
    addToCart(selectedFood, quantity, note);
    setSelectedFood(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={() => setSelectedFood(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition-colors backdrop-blur-xs"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden shrink-0 max-h-56 sm:max-h-64">
          <FoodImage
            src={selectedFood.image}
            alt={selectedFood.name}
            categoryId={selectedFood.categoryId}
            categoryName={selectedFood.categoryName}
            aspectRatioClass="aspect-[16/9]"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

          {/* Calorie & Category Overlay on Image */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs z-10">
            <span className="font-semibold bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-xs">
              {selectedFood.categoryName}
            </span>

            <div className="flex items-center gap-1.5 bg-amber-500 text-slate-950 font-bold px-3 py-1 rounded-lg shadow-sm">
              <Flame className="w-3.5 h-3.5 fill-slate-950" />
              <span className="font-mono-nums">{calories} kcal</span>
            </div>
          </div>

          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[1px] flex items-center justify-center z-15">
              <div className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-xl font-bold uppercase text-xs sm:text-sm shadow">
                <AlertTriangle className="w-4 h-4" />
                <span>Món ăn tạm hết hôm nay</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs (Info / Nutrition Facts / Reviews) */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'info'
                ? 'border-amber-500 text-amber-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Tổng quan món</span>
          </button>
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'nutrition'
                ? 'border-amber-500 text-amber-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-600" />
            <span>Dinh dưỡng & Dị ứng</span>
            {hasAllergens && (
              <span className="w-2 h-2 rounded-full bg-rose-500" title="Có cảnh báo dị ứng" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-amber-500 text-amber-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Đánh giá ({foodReviews.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Header (Shared) */}
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>{selectedFood.categoryName}</span>
              <span aria-hidden="true">·</span>
              <div className="flex items-center gap-1 text-amber-600 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{selectedFood.rating.toFixed(1)}</span>
              </div>
              <span>({selectedFood.reviewCount} lượt đánh giá)</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-700">~{selectedFood.prepTimeMinutes} phút chế biến</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {selectedFood.name}
            </h2>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold font-mono-nums text-amber-600">
                {selectedFood.price.toLocaleString('vi-VN')}₫
              </span>
              {selectedFood.originalPrice && selectedFood.originalPrice > selectedFood.price && (
                <span className="text-sm font-mono-nums text-slate-400 line-through">
                  {selectedFood.originalPrice.toLocaleString('vi-VN')}₫
                </span>
              )}
            </div>
          </div>

          {/* TAB 1: General Info */}
          {activeTab === 'info' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Quick Nutrition & Calorie Callout Banner */}
              <div
                onClick={() => setActiveTab('nutrition')}
                className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-3 cursor-pointer hover:bg-amber-100/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                    <Flame className="w-5 h-5 fill-slate-950" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {calories} Calories (kcal)
                      </span>
                      <span className="text-[11px] text-amber-800 font-semibold font-mono-nums">
                        · {dailyCaloriesPercent}% Nhu cầu/ngày
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-mono-nums mt-0.5">
                      Đạm: <strong>{protein}g</strong> · Tinh bột: <strong>{carbs}g</strong> · Béo: <strong>{fat}g</strong>
                    </div>
                  </div>
                </div>

                <span className="text-xs font-bold text-amber-700 hover:underline shrink-0">
                  Xem chi tiết & Dị ứng →
                </span>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Mô tả món ăn
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedFood.description}
                </p>
              </div>

              {/* Dietary Tags */}
              {selectedFood.dietaryTags && selectedFood.dietaryTags.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Lợi ích & Đặc điểm dinh dưỡng
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap">
                    {selectedFood.dietaryTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/70 font-medium"
                      >
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergen Quick Strip */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs flex items-start gap-2.5">
                <ShieldAlert
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    hasAllergens ? 'text-amber-600' : 'text-emerald-600'
                  }`}
                />
                <div>
                  <span className="font-semibold text-slate-800 block">
                    {hasAllergens
                      ? `Chứa chất gây dị ứng: ${allergens.join(', ')}`
                      : 'Không chứa các chất gây dị ứng phổ biến'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Bấm tab "Dinh dưỡng & Dị ứng" để xem phân tích chi tiết.
                  </span>
                </div>
              </div>

              {/* Special Request / Note */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Ghi chú cho quầy bếp (Tùy chọn)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Xin ít cơm, nhiều nước canh, không hành lá..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Nutrition Facts & Allergens (Core User Request) */}
          {activeTab === 'nutrition' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Nutritional Facts Sheet */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                {/* Header */}
                <div className="bg-slate-900 text-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold tracking-tight">
                        Giá Trị Dinh Dưỡng / Nutrition Facts
                      </h3>
                      <p className="text-[11px] text-slate-300">
                        Khẩu phần: 1 suất ăn ({selectedFood.name})
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black font-mono-nums text-amber-400 leading-none">
                        {calories}
                      </div>
                      <span className="text-[10px] text-slate-300 uppercase tracking-wider">
                        Calories (kcal)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Macro Distribution Bars */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Tỷ lệ năng lượng các chất đa lượng (Macronutrients)</span>
                    <span className="font-mono-nums text-slate-500">
                      ~{dailyCaloriesPercent}% Nhu cầu ngày (2.000 kcal)
                    </span>
                  </div>
                  {/* Visual Stacked Bar */}
                  <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-200">
                    <div
                      style={{ width: `${Math.round(((protein * 4) / calories) * 100)}%` }}
                      className="bg-emerald-500 h-full"
                      title={`Đạm: ${protein}g`}
                    />
                    <div
                      style={{ width: `${Math.round(((carbs * 4) / calories) * 100)}%` }}
                      className="bg-amber-500 h-full"
                      title={`Tinh bột: ${carbs}g`}
                    />
                    <div
                      style={{ width: `${Math.round(((fat * 9) / calories) * 100)}%` }}
                      className="bg-orange-500 h-full"
                      title={`Chất béo: ${fat}g`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      Đạm ({protein}g · {Math.round(((protein * 4) / calories) * 100)}%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      Tinh bột ({carbs}g · {Math.round(((carbs * 4) / calories) * 100)}%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                      Chất béo ({fat}g · {Math.round(((fat * 9) / calories) * 100)}%)
                    </span>
                  </div>
                </div>

                {/* Detailed Table */}
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Dna className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-slate-900">Chất đạm (Protein)</span>
                    </div>
                    <div className="flex items-baseline gap-2 font-mono-nums">
                      <strong className="text-slate-900">{protein} g</strong>
                      <span className="text-slate-400 text-[11px]">({dailyProteinPercent}% DV)</span>
                    </div>
                  </div>

                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wheat className="w-4 h-4 text-amber-600" />
                      <span className="font-bold text-slate-900">Tinh bột (Carbohydrates)</span>
                    </div>
                    <div className="flex items-baseline gap-2 font-mono-nums">
                      <strong className="text-slate-900">{carbs} g</strong>
                      <span className="text-slate-400 text-[11px]">({dailyCarbsPercent}% DV)</span>
                    </div>
                  </div>

                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-orange-600" />
                      <span className="font-bold text-slate-900">Tổng chất béo (Total Fat)</span>
                    </div>
                    <div className="flex items-baseline gap-2 font-mono-nums">
                      <strong className="text-slate-900">{fat} g</strong>
                      <span className="text-slate-400 text-[11px]">({dailyFatPercent}% DV)</span>
                    </div>
                  </div>

                  <div className="p-3 flex items-center justify-between bg-slate-50/40">
                    <span className="text-slate-600 pl-6">↳ Chất xơ (Dietary Fiber)</span>
                    <span className="font-mono-nums font-semibold text-slate-800">
                      {fiber} g
                    </span>
                  </div>

                  <div className="p-3 flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Natri (Sodium)</span>
                    <div className="flex items-baseline gap-2 font-mono-nums">
                      <strong className="text-slate-900">{sodium} mg</strong>
                      <span className="text-slate-400 text-[11px]">
                        ({Math.round((sodium / 2300) * 100)}% DV)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 text-[11px] text-slate-500 italic border-t border-slate-100 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    * % Giá trị hàng ngày (% DV) dựa trên chế độ ăn 2.000 calo tiêu chuẩn của người trưởng thành.
                  </span>
                </div>
              </div>

              {/* ALLERGENS SECTION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>Cảnh báo dị ứng thực phẩm (Allergens)</span>
                  </h4>
                </div>

                {hasAllergens ? (
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 text-xs space-y-2.5">
                    <div className="flex items-center gap-2 text-amber-900 font-bold">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>Món ăn này có chứa các thành phần sau:</span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {allergens.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold shadow-2xs"
                        >
                          ⚠️ {item}
                        </span>
                      ))}
                    </div>

                    <p className="text-[11px] text-amber-800 leading-relaxed pt-1">
                      Nếu bạn bị dị ứng hoặc mẫn cảm với bất kỳ thành phần nào ở trên, vui lòng ghi chú yêu cầu riêng trong ô ghi chú hoặc cân nhắc chọn món khác trong thực đơn căn tin.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-bold text-emerald-900">
                        Không chứa các chất gây dị ứng phổ biến
                      </div>
                      <p className="text-[11px] text-emerald-800 leading-relaxed">
                        Món ăn không sử dụng các nguyên liệu dễ gây dị ứng (như trứng, sữa bò, hải sản hay gluten). Phù hợp với đại đa số thực khách.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Nhận xét & Trải nghiệm thực tế ({foodReviews.length})
                </h4>
              </div>

              {foodReviews.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400 italic">
                    Chưa có nhận xét nào. Hãy đặt món và chia sẻ cảm nhận của bạn nhé!
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {foodReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">
                          {rev.userName}
                        </span>
                        <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{rev.rating}</span>
                        </div>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{rev.comment}</p>
                      <span className="text-[10px] text-slate-400 block pt-0.5">
                        {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 shrink-0">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-600">Số lượng:</span>
            <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-slate-200 shadow-2xs">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || isOutOfStock}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-700 disabled:opacity-40 transition-colors"
                title="Giảm số lượng"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-bold font-mono-nums text-slate-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(selectedFood.stockQuantity, quantity + 1))}
                disabled={quantity >= selectedFood.stockQuantity || isOutOfStock}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-700 disabled:opacity-40 transition-colors"
                title="Tăng số lượng"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Add button */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase block">
                Tổng cộng
              </span>
              <span className="text-lg font-bold font-mono-nums text-slate-900">
                {(selectedFood.price * quantity).toLocaleString('vi-VN')}₫
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isOutOfStock ? 'Hết món' : 'Thêm vào giỏ'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
