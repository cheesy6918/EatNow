import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  RotateCcw,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';

export const WalletModal: React.FC = () => {
  const {
    isWalletModalOpen,
    setIsWalletModalOpen,
    currentUser,
    depositWallet,
    transactions,
  } = useApp();

  const [customAmount, setCustomAmount] = useState('');

  if (!isWalletModalOpen || !currentUser) return null;

  const userTransactions = transactions.filter((t) => t.userId === currentUser.id);

  const handleDeposit = (amount: number) => {
    depositWallet(amount);
  };

  const handleCustomDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customAmount.replace(/\D/g, ''), 10);
    if (parsed > 0) {
      depositWallet(parsed);
      setCustomAmount('');
    }
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Ví CanteenGo
              </h3>
              <span className="text-[11px] text-slate-500">
                Thanh toán nội bộ trường học tiện lợi & nhanh chóng
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsWalletModalOpen(false)}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[72vh] overflow-y-auto space-y-6">
          {/* Balance Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-slate-300 font-medium">
                  Số dư khả dụng hiện tại
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  Demo Balance
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono-nums tracking-tight text-white">
                {(currentUser.walletBalance ?? 0).toLocaleString('vi-VN')}₫
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-white/10">
                <span>Chủ ví: <strong>{currentUser.name}</strong></span>
                <span>{currentUser.className || 'Sinh viên'}</span>
              </div>
            </div>
          </div>

          {/* Top-up options */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Nạp thêm số dư thử nghiệm
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Miễn phí nạp demo
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[50000, 100000, 200000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleDeposit(amt)}
                  className="py-2.5 px-2 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-800 font-bold text-xs transition-all font-mono-nums flex items-center justify-center gap-1 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-600" />
                  <span>+{amt.toLocaleString('vi-VN')}₫</span>
                </button>
              ))}
            </div>

            {/* Custom input */}
            <form onSubmit={handleCustomDeposit} className="mt-3 flex gap-2">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Nhập số tiền khác (VNĐ)..."
                min="10000"
                step="5000"
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
              <button
                type="submit"
                disabled={!customAmount}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors disabled:opacity-40"
              >
                Nạp ngay
              </button>
            </form>
          </div>

          {/* Transaction History (US21) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Lịch sử giao dịch gần đây ({userTransactions.length})
            </h4>

            {userTransactions.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                Chưa có giao dịch phát sinh.
              </p>
            ) : (
              <div className="space-y-2.5">
                {userTransactions.map((tx) => {
                  const isDeposit = tx.type === 'deposit';
                  const isRefund = tx.type === 'refund';

                  return (
                    <div
                      key={tx.id}
                      className="p-3 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isDeposit
                              ? 'bg-emerald-100 text-emerald-700'
                              : isRefund
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {isDeposit ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : isRefund ? (
                            <RotateCcw className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate">
                            {tx.description}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {new Date(tx.timestamp).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            · {new Date(tx.timestamp).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`font-bold font-mono-nums shrink-0 ${
                          isDeposit || isRefund
                            ? 'text-emerald-600'
                            : 'text-slate-900'
                        }`}
                      >
                        {isDeposit || isRefund ? '+' : '-'}
                        {tx.amount.toLocaleString('vi-VN')}₫
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setIsWalletModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
