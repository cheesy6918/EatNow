import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Clock,
  User,
  ShoppingBag,
  ArrowRight,
  Wallet,
  AlertCircle,
  Tag,
  Check,
  UtensilsCrossed,
  Package,
  Sparkles,
  Banknote,
} from 'lucide-react';
import { WalletPaymentModal } from './WalletPaymentModal';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    finalCartTotal,
    currentUser,
    pickupSlots,
    vouchers,
    appliedVoucher,
    applyVoucher,
    removeVoucher,
    voucherDiscount,
    diningOption,
    setDiningOption,
    tableNumber,
    setTableNumber,
    openAuthModal,
    createOrder,
  } = useApp();

  const [selectedSlot, setSelectedSlot] = useState(pickupSlots[2] || '11:15 - 11:30');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'cod'>('wallet');
  const [isSubmittingCod, setIsSubmittingCod] = useState(false);
  const [voucherInput, setVoucherInput] = useState('');
  const [showVoucherList, setShowVoucherList] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyVoucher = (codeToApply?: string) => {
    const code = codeToApply || voucherInput;
    if (!code.trim()) return;
    const res = applyVoucher(code);
    if (res.success) {
      setVoucherInput('');
      setShowVoucherList(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
        <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Giỏ hàng của bạn
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {cart.length} món
              </span>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-slate-400 hover:text-rose-600 transition-colors p-1"
                  title="Xóa tất cả"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <ShoppingBag className="w-12 h-12 text-slate-300 mb-3 stroke-[1.5]" />
                <h3 className="text-base font-semibold text-slate-700">
                  Giỏ hàng chưa có món nào
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Chọn những món ăn hấp dẫn trong thực đơn hôm nay và lên lịch hẹn nhận bạn nhé!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  Xem thực đơn ngay
                </button>
              </div>
            ) : (
              <>
                {/* Item List */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.foodItem.id}
                      className="p-3 rounded-2xl border border-slate-200 bg-slate-50/50 flex gap-3 items-start"
                    >
                      <img
                        src={item.foodItem.image}
                        alt={item.foodItem.name}
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';
                        }}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 bg-slate-200"
                        referrerPolicy="no-referrer"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {item.foodItem.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.foodItem.id)}
                            className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-xs font-bold font-mono-nums text-amber-600 mt-0.5">
                          {item.foodItem.price.toLocaleString('vi-VN')}₫
                        </div>

                        {item.note && (
                          <div className="text-[11px] text-slate-500 italic mt-0.5 line-clamp-1">
                            Ghi chú: {item.note}
                          </div>
                        )}

                        {/* Quantity Stepper */}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 bg-white rounded-lg p-0.5 border border-slate-200">
                            <button
                              onClick={() =>
                                updateCartQuantity(item.foodItem.id, item.quantity - 1)
                              }
                              className="w-6 h-6 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-700"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold font-mono-nums text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateCartQuantity(item.foodItem.id, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.foodItem.stockQuantity}
                              className="w-6 h-6 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-700 disabled:opacity-30"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs font-bold font-mono-nums text-slate-900">
                            {(item.foodItem.price * item.quantity).toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dining Option Selection */}
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4 text-amber-600" />
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Hình thức nhận món
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDiningOption('takeaway')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        diningOption === 'takeaway'
                          ? 'bg-amber-500 border-amber-600 text-slate-950 font-bold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Package className="w-4 h-4" />
                      <span>Đóng hộp mang đi</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDiningOption('dine_in')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        diningOption === 'dine_in'
                          ? 'bg-amber-500 border-amber-600 text-slate-950 font-bold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <UtensilsCrossed className="w-4 h-4" />
                      <span>Ăn tại căn tin</span>
                    </button>
                  </div>
                </div>

                {/* Pickup Time Slot (US15) */}
                <div className="pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Khung giờ hẹn nhận món
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1">
                    {pickupSlots.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold text-center transition-all border ${
                            isSelected
                              ? 'bg-amber-500 border-amber-600 text-slate-950 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 italic">
                    * Căn tin sẽ chuẩn bị món nóng hổi trước giờ nhận khoảng 5 phút.
                  </p>
                </div>

                {/* Voucher Section */}
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
                      <Tag className="w-3.5 h-3.5 text-amber-600" />
                      <span>Mã giảm giá sinh viên</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowVoucherList(!showVoucherList)}
                      className="text-xs font-semibold text-amber-700 hover:text-amber-800"
                    >
                      {showVoucherList ? 'Thu gọn' : 'Xem mã ưu đãi'}
                    </button>
                  </div>

                  {appliedVoucher ? (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Mã: {appliedVoucher.code}</span>
                        </div>
                        <div className="text-[11px] text-emerald-700 font-medium">
                          {appliedVoucher.title} (-{voucherDiscount.toLocaleString('vi-VN')}₫)
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeVoucher}
                        className="px-2 py-1 rounded-lg text-[11px] font-bold text-rose-600 hover:bg-rose-100 transition-colors"
                      >
                        Gỡ bỏ
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voucherInput}
                        onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                        placeholder="Nhập mã (vd: CHAOTAN2026)..."
                        className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300 uppercase font-mono font-bold tracking-wider placeholder:normal-case placeholder:font-sans placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyVoucher()}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                      >
                        Áp dụng
                      </button>
                    </div>
                  )}

                  {/* Suggestion list of vouchers */}
                  {showVoucherList && (
                    <div className="space-y-1.5 pt-1">
                      {vouchers.map((v) => (
                        <div
                          key={v.code}
                          className="p-2 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/40 transition-all flex items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <span className="font-mono font-bold text-amber-700 mr-2">
                              {v.code}
                            </span>
                            <span className="text-slate-800 font-medium">{v.title}</span>
                            <div className="text-[10px] text-slate-500">
                              {v.description}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleApplyVoucher(v.code)}
                            disabled={cartTotal < v.minOrderValue}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-[11px] shrink-0"
                          >
                            Dùng
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Student / User Info Verification */}
                {currentUser ? (
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900">
                      <User className="w-3.5 h-3.5 text-amber-700" />
                      <span>Thông tin nhận món:</span>
                    </div>
                    <div className="text-slate-700">
                      <strong>{currentUser.name}</strong> · {currentUser.phone}
                      {currentUser.className && ` · ${currentUser.className}`}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-700 shrink-0" />
                      <span className="text-amber-900 font-medium">
                        Bạn chưa đăng nhập. Vui lòng đăng nhập để hoàn tất đơn.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => openAuthModal('login')}
                      className="px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shrink-0 cursor-pointer"
                    >
                      Đăng nhập
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 space-y-3">
              {/* Payment Method Selection */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Phương thức thanh toán:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === 'wallet'
                        ? 'border-orange-500 bg-orange-50/80 ring-2 ring-orange-500/20 shadow-2xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Wallet
                        className={`w-3.5 h-3.5 ${
                          paymentMethod === 'wallet' ? 'text-orange-600' : 'text-slate-400'
                        }`}
                      />
                      <span
                        className={`text-xs font-bold ${
                          paymentMethod === 'wallet' ? 'text-orange-950' : 'text-slate-800'
                        }`}
                      >
                        Thanh toán qua ví
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1">
                      Mặc định · Ví CanteenGo
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === 'cod'
                        ? 'border-orange-500 bg-orange-50/80 ring-2 ring-orange-500/20 shadow-2xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Banknote
                        className={`w-3.5 h-3.5 ${
                          paymentMethod === 'cod' ? 'text-orange-600' : 'text-slate-400'
                        }`}
                      />
                      <span
                        className={`text-xs font-bold ${
                          paymentMethod === 'cod' ? 'text-orange-950' : 'text-slate-800'
                        }`}
                      >
                        Khi nhận đơn (COD)
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1">
                      Tiền mặt tại quầy căn tin
                    </span>
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1 text-xs text-slate-600 pt-1 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>Tạm tính ({cart.reduce((s, i) => s + i.quantity, 0)} phần):</span>
                  <span className="font-mono-nums font-semibold text-slate-900">
                    {cartTotal.toLocaleString('vi-VN')}₫
                  </span>
                </div>
                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Giảm giá Voucher ({appliedVoucher?.code}):</span>
                    <span className="font-mono-nums">
                      -{voucherDiscount.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Phí đóng gói & phục vụ:</span>
                  <span className="font-mono-nums font-semibold text-emerald-600">
                    Miễn phí
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="text-base font-extrabold font-mono-nums text-orange-600">
                    {finalCartTotal.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              {currentUser ? (
                paymentMethod === 'wallet' ? (
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md active:scale-98 transition-all cursor-pointer"
                  >
                    <span>Xác nhận & Thanh toán Ví</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                ) : (
                  <button
                    disabled={isSubmittingCod}
                    onClick={async () => {
                      setIsSubmittingCod(true);
                      await createOrder(selectedSlot, 'cod');
                      setIsSubmittingCod(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingCod ? (
                      <span>Đang tạo đơn...</span>
                    ) : (
                      <>
                        <span>Đặt món & Thanh toán khi nhận đơn (COD)</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </>
                    )}
                  </button>
                )
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md active:scale-98 transition-all cursor-pointer"
                >
                  <span>Đăng nhập để đặt món</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      {isPaymentModalOpen && (
        <WalletPaymentModal
          pickupSlot={selectedSlot}
          onClose={() => setIsPaymentModalOpen(false)}
        />
      )}
    </>
  );
};
