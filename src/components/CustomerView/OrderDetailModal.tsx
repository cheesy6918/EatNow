import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import {
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Receipt,
  RotateCcw,
  Star,
  Send,
  ChefHat,
  ShoppingBag,
  User,
  ShieldCheck,
  Printer,
  UtensilsCrossed,
  Package,
} from 'lucide-react';

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
}) => {
  const { cancelOrder, addReview, currentUser, setReceiptOrder } = useApp();

  // Review state
  const [selectedFoodId, setSelectedFoodId] = useState(order.items[0]?.foodId || '');
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Cancellation confirm modal
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('Đổi ý / Thay đổi thời gian học');

  // Can student cancel order?
  // Only when status is pending_payment, paid_pending_confirm, or preparing
  const canCancel =
    order.status === 'paid_pending_confirm' || order.status === 'preparing';

  const handleCancel = () => {
    cancelOrder(order.id, cancelReason);
    setIsCancelling(false);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setIsSubmittingReview(true);
    addReview(order.id, selectedFoodId, rating, reviewComment);
    setIsSubmittingReview(false);
    setReviewComment('');
  };

  // Status mapping
  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    {
      key: 'paid_pending_confirm',
      label: 'Đã thanh toán',
      desc: 'Chờ căn tin tiếp nhận',
    },
    {
      key: 'preparing',
      label: 'Đang nấu',
      desc: 'Bếp đang chế biến món',
    },
    {
      key: 'ready',
      label: 'Sẵn sàng',
      desc: 'Mời bạn tới quầy nhận',
    },
    {
      key: 'completed',
      label: 'Đã nhận',
      desc: 'Hoàn tất đơn hàng',
    },
  ];

  const getStepStatus = (stepKey: OrderStatus) => {
    if (order.status === 'cancelled') return 'cancelled';
    const orderIndex = steps.findIndex((s) => s.key === order.status);
    const stepIndex = steps.findIndex((s) => s.key === stepKey);

    if (orderIndex >= stepIndex) return 'completed';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  Đơn hàng #{order.orderCode}
                </h3>
                <span className="text-[11px] font-mono-nums px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                  Ví CanteenGo
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Đặt lúc: {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} · {new Date(order.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setReceiptOrder(order)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-xs"
              title="In phiếu nhận món & Hóa đơn Căn tin"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">In phiếu / Hóa đơn</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[72vh] overflow-y-auto space-y-6">
          {/* Order Status Timeline */}
          {order.status === 'cancelled' ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span>Đơn hàng đã được hủy</span>
              </div>
              <p className="text-xs text-rose-700">
                Lý do: <strong>{order.cancelReason || 'Không có lý do'}</strong>
              </p>
              <div className="pt-2 border-t border-rose-200 text-xs text-emerald-800 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>
                  Đã hoàn lại <strong>{order.totalAmount.toLocaleString('vi-VN')}₫</strong> về Ví CanteenGo của bạn.
                </span>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Tiến độ chuẩn bị món
                </span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Hẹn nhận: {order.pickupTimeSlot}
                </span>
              </div>

              {/* Steps Progress */}
              <div className="grid grid-cols-4 gap-2 relative">
                {steps.map((step, idx) => {
                  const state = getStepStatus(step.key);
                  const isCurrent = order.status === step.key;

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-colors ${
                          state === 'completed'
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        } ${isCurrent ? 'ring-2 ring-amber-400 ring-offset-2' : ''}`}
                      >
                        {state === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <span
                        className={`text-xs font-semibold leading-tight ${
                          state === 'completed' ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </span>
                      <span className="text-[10px] text-slate-400 leading-tight mt-0.5 hidden sm:block">
                        {step.desc}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Ready for Pickup Alert */}
              {order.status === 'ready' && (
                <div className="mt-4 p-3.5 rounded-2xl bg-amber-500 text-slate-950 flex items-center gap-3 animate-bounce">
                  <ChefHat className="w-6 h-6 shrink-0" />
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wide">
                      Món ăn của bạn đã sẵn sàng tại quầy!
                    </h4>
                    <p className="text-xs font-medium">
                      Vui lòng đến Căn tin và đọc mã <strong>#{order.orderCode}</strong> để nhận món ngay.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pickup Voucher & QR simulation */}
          <div className="p-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                Mã lấy món đối chiếu tại quầy
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono-nums tracking-widest text-slate-900">
                {order.orderCode}
              </div>
              <div className="text-xs text-slate-600">
                Người nhận: <strong>{order.userName}</strong> ({order.userPhone})
              </div>
            </div>

            <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 p-1.5 flex flex-col items-center justify-center text-slate-700 shadow-2xs">
              <QrCode className="w-12 h-12 text-slate-800" />
              <span className="text-[9px] font-mono font-bold mt-0.5">CHECK-IN</span>
            </div>
          </div>

          {/* Electronic Receipt Items (US21) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Chi tiết hóa đơn điện tử
            </h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="w-11 h-11 rounded-lg object-cover bg-slate-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">
                        {item.name}
                      </div>
                      <div className="text-slate-500 font-mono-nums">
                        {item.quantity} x {item.price.toLocaleString('vi-VN')}₫
                      </div>
                      {item.note && (
                        <div className="text-[11px] text-amber-700 italic">
                          Ghi chú: {item.note}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="font-bold font-mono-nums text-slate-900 shrink-0">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                  </div>
                </div>
              ))}

              <div className="p-3.5 bg-slate-50 space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Hình thức nhận món:</span>
                  <span className="font-semibold text-slate-800">
                    {order.diningOption === 'dine_in'
                      ? '🍽️ Ăn tại căn tin'
                      : '🥡 Đóng hộp mang đi'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Phương thức:</span>
                  <span className="font-semibold text-slate-800">
                    {order.paymentMethod === 'cod' ? 'Tiền mặt khi nhận (COD)' : 'Ví CanteenGo'}
                  </span>
                </div>
                {order.discountAmount && order.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Mã ưu đãi ({order.voucherCode}):</span>
                    <span className="font-mono-nums">
                      -{order.discountAmount.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Trạng thái thanh toán:</span>
                  <span
                    className={`font-semibold ${
                      order.paymentStatus === 'refunded'
                        ? 'text-rose-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {order.paymentStatus === 'refunded'
                      ? 'Đã hoàn tiền vào ví'
                      : 'Đã thanh toán thành công'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Tổng cộng:</span>
                  <span className="text-amber-600 font-mono-nums text-base">
                    {order.totalAmount.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Section (US31: Đánh giá món ăn sau khi nhận) */}
          {order.status === 'completed' && (
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
                <Star className="w-4 h-4 text-amber-600 fill-amber-400" />
                <span>Đánh giá món ăn cho Căn tin</span>
              </div>

              {order.rating ? (
                <div className="text-xs text-slate-700 space-y-1">
                  <div className="flex items-center gap-1 text-amber-600 font-bold">
                    <span>Đánh giá của bạn:</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < order.rating!
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {order.reviewComment && (
                    <p className="italic bg-white p-2.5 rounded-xl border border-amber-200/60">
                      "{order.reviewComment}"
                    </p>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="text-slate-600">Chọn số sao:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Món ăn vừa miệng không bạn? Cảm nhận về độ nóng hổi..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />

                  <button
                    type="submit"
                    disabled={isSubmittingReview || !reviewComment.trim()}
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors disabled:opacity-40"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi nhận xét</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Cancellation section (US17) */}
          {canCancel && (
            <div className="pt-2">
              {!isCancelling ? (
                <button
                  type="button"
                  onClick={() => setIsCancelling(true)}
                  className="w-full py-2.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/70 text-rose-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Hủy đơn hàng này & hoàn tiền về Ví CanteenGo</span>
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3 animate-in fade-in duration-150">
                  <div className="text-xs font-bold text-rose-900">
                    Xác nhận hủy đơn #{order.orderCode}?
                  </div>
                  <p className="text-xs text-rose-700">
                    Hệ thống sẽ hoàn trả ngay <strong>{order.totalAmount.toLocaleString('vi-VN')}₫</strong> về Ví CanteenGo của bạn.
                  </p>
                  <div>
                    <label className="block text-[11px] font-semibold text-rose-800 mb-1">
                      Lý do hủy đơn:
                    </label>
                    <select
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg bg-white border border-rose-300 text-slate-800"
                    >
                      <option value="Đổi ý / Thay đổi thời gian học">Đổi ý / Thay đổi thời gian học</option>
                      <option value="Đặt nhầm món / nhầm số lượng">Đặt nhầm món / nhầm số lượng</option>
                      <option value="Có việc bận đột xuất">Có việc bận đột xuất không kịp qua lấy</option>
                      <option value="Lý do khác">Lý do khác</option>
                    </select>
                  </div>
                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setIsCancelling(false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-medium"
                    >
                      Giữ lại đơn
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                    >
                      Xác nhận hủy ngay
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Hỗ trợ căn tin: <strong>024.3869.2345</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
