import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  Clock,
} from 'lucide-react';

interface WalletPaymentModalProps {
  pickupSlot: string;
  onClose: () => void;
}

export const WalletPaymentModal: React.FC<WalletPaymentModalProps> = ({
  pickupSlot,
  onClose,
}) => {
  const {
    currentUser,
    cartTotal,
    finalCartTotal,
    voucherDiscount,
    appliedVoucher,
    diningOption,
    tableNumber,
    cart,
    createOrder,
    depositWallet,
    showToast,
  } = useApp();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!currentUser) return null;

  const amountToPay = finalCartTotal;
  const isBalanceSufficient = currentUser.walletBalance >= amountToPay;
  const deficit = amountToPay - currentUser.walletBalance;

  const handleConfirmPayment = async () => {
    setErrorMessage(null);
    if (!isBalanceSufficient) {
      setErrorMessage(
        `Số dư Ví CanteenGo không đủ (${currentUser.walletBalance.toLocaleString(
          'vi-VN'
        )}₫ / Cần ${amountToPay.toLocaleString('vi-VN')}₫). Vui lòng nạp thêm tiền!`
      );
      return;
    }

    setIsProcessing(true);
    // Simulate brief secure processing
    setTimeout(async () => {
      const res = await createOrder(pickupSlot);
      setIsProcessing(false);
      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.error || 'Có lỗi xảy ra khi tạo đơn');
      }
    }, 600);
  };

  const handleQuickDeposit = (amount: number) => {
    depositWallet(amount);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Thanh toán Ví CanteenGo
              </h3>
              <span className="text-[11px] text-slate-500">
                Thanh toán mô phỏng nội bộ trường
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
        <div className="p-6 space-y-5">
          {/* Order Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Số lượng món:</span>
              <span className="font-semibold text-slate-900">
                {cart.reduce((s, i) => s + i.quantity, 0)} phần ({cart.length} món)
              </span>
            </div>
            <div className="flex justify-between text-slate-600 items-center">
              <span>Hình thức:</span>
              <span className="font-semibold text-slate-800">
                {diningOption === 'dine_in' ? '🍽️ Ăn tại căn tin' : '🥡 Đóng hộp mang đi'}
              </span>
            </div>
            <div className="flex justify-between text-slate-600 items-center">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Giờ hẹn lấy món:</span>
              </span>
              <span className="font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md">
                {pickupSlot}
              </span>
            </div>

            {voucherDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold pt-1 border-t border-slate-200">
                <span>Voucher giảm giá ({appliedVoucher?.code}):</span>
                <span className="font-mono-nums">
                  -{voucherDiscount.toLocaleString('vi-VN')}₫
                </span>
              </div>
            )}

            <div className="flex justify-between text-slate-900 pt-2 border-t border-slate-200 text-sm font-bold">
              <span>Tổng tiền cần thanh toán:</span>
              <span className="text-base font-extrabold font-mono-nums text-amber-600">
                {amountToPay.toLocaleString('vi-VN')}₫
              </span>
            </div>
          </div>

          {/* Wallet Balance Card */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              isBalanceSufficient
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                : 'bg-rose-50/70 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet
                  className={`w-5 h-5 ${
                    isBalanceSufficient ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Số dư Ví CanteenGo
                </span>
              </div>
              <span className="text-base font-extrabold font-mono-nums">
                {(currentUser.walletBalance ?? 0).toLocaleString('vi-VN')}₫
              </span>
            </div>

            {isBalanceSufficient ? (
              <div className="mt-2 text-xs text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>
                  Số dư hợp lệ. Sau thanh toán còn:{' '}
                  <strong className="font-mono-nums">
                    {((currentUser.walletBalance ?? 0) - amountToPay).toLocaleString('vi-VN')}₫
                  </strong>
                </span>
              </div>
            ) : (
              <div className="mt-2 text-xs text-rose-700 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>
                    Số dư không đủ! Còn thiếu{' '}
                    <strong className="font-mono-nums">
                      {deficit.toLocaleString('vi-VN')}₫
                    </strong>
                  </span>
                </div>
                <p className="text-[11px] text-rose-600/90">
                  Vui lòng nạp thêm tiền demo bên dưới để hoàn tất giao dịch.
                </p>
              </div>
            )}
          </div>

          {/* Quick Demo Deposit Options (if insufficient or wants to add) */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Nạp nhanh số dư Demo:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDeposit(50000)}
                className="py-2 px-1 text-xs font-bold rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-800 transition-all font-mono-nums flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3 text-amber-600" />
                <span>+50.000₫</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDeposit(100000)}
                className="py-2 px-1 text-xs font-bold rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-800 transition-all font-mono-nums flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3 text-amber-600" />
                <span>+100.000₫</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDeposit(200000)}
                className="py-2 px-1 text-xs font-bold rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-800 transition-all font-mono-nums flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3 text-amber-600" />
                <span>+200.000₫</span>
              </button>
            </div>
          </div>

          {/* Error Message if any */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Trust reassurance note */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Cam kết hoàn trả 100% về Ví CanteenGo nếu căn tin từ chối tiếp nhận đơn.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
          >
            Quay lại giỏ hàng
          </button>

          <button
            type="button"
            onClick={handleConfirmPayment}
            disabled={!isBalanceSufficient || isProcessing}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span>Đang trừ ví...</span>
            ) : (
              <>
                <span>Xác nhận trừ {amountToPay.toLocaleString('vi-VN')}₫</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
