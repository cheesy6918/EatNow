import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import {
  X,
  Star,
  Send,
  MessageSquare,
  CheckCircle2,
  Utensils,
} from 'lucide-react';

interface FoodReviewModalProps {
  order: Order;
  onClose: () => void;
}

export const FoodReviewModal: React.FC<FoodReviewModalProps> = ({
  order,
  onClose,
}) => {
  const { addReview, showToast } = useApp();
  const [selectedFoodId, setSelectedFoodId] = useState(order.items[0]?.foodId || '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const selectedItem = order.items.find((i) => i.foodId === selectedFoodId) || order.items[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Vui lòng nhập nhận xét của bạn về món ăn', 'error');
      return;
    }
    addReview(order.id, selectedFoodId, rating, comment.trim());
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-70 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Star className="w-4 h-4 fill-slate-950" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 leading-tight">
                Đánh giá chất lượng món ăn
              </h3>
              <span className="text-[11px] text-slate-500">
                Đơn hàng #{order.orderCode}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900">
              Cảm ơn đánh giá của bạn!
            </h4>
            <p className="text-xs text-slate-500">
              Nhận xét của bạn sẽ giúp nhân viên cải thiện chất lượng phục vụ ngày một tốt hơn.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Choose item if multiple */}
            {order.items.length > 1 && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Chọn món ăn bạn muốn đánh giá:
                </label>
                <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto">
                  {order.items.map((item) => (
                    <button
                      key={item.foodId}
                      type="button"
                      onClick={() => setSelectedFoodId(item.foodId)}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all border text-left ${
                        selectedFoodId === item.foodId
                          ? 'border-amber-500 bg-amber-50/70 font-bold text-slate-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="truncate">{item.name}</span>
                      <span className="text-slate-400 font-normal">x{item.quantity}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selected item display */}
            {selectedItem && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {selectedItem.name}
                  </div>
                  <div className="text-[11px] text-amber-600 font-mono-nums font-semibold">
                    {selectedItem.price.toLocaleString('vi-VN')}₫
                  </div>
                </div>
              </div>
            )}

            {/* Star Rating selector */}
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                Mức độ hài lòng của bạn
              </span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1.5 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-slate-300 hover:text-slate-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-xs font-semibold text-amber-700">
                {rating === 5 && '⭐⭐⭐⭐⭐ Xuất sắc, rất vừa miệng!'}
                {rating === 4 && '⭐⭐⭐⭐ Ngon, đầy đặn!'}
                {rating === 3 && '⭐⭐⭐ Ổn, tạm được'}
                {rating === 2 && '⭐⭐ Chưa được ngon lắm'}
                {rating === 1 && '⭐ Cần cải thiện nhiều'}
              </div>
            </div>

            {/* Comment Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Cảm nhận chi tiết của bạn:
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ví dụ: Đồ ăn nóng hổi, sườn nướng mật ong rất thơm mềm, nước mắm vừa vị, nhân viên vui vẻ..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi đánh giá</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
