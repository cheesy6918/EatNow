import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, User, Phone, Mail, LogOut } from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    currentUser,
    updateUserProfile,
    logoutUser,
    setActiveNavTab,
  } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setPhone(currentUser.phone);
    }
  }, [currentUser]);

  if (!isProfileModalOpen || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim(),
      phone: phone.trim(),
      className: currentUser.department || currentUser.className || '',
    });
    setIsProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Thông tin cá nhân
              </h3>
              <span className="text-[11px] text-slate-500">
                Quản lý thông tin tài khoản & liên hệ nhận món
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsProfileModalOpen(false)}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body with balanced spacing */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Email (Readonly) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Email đăng nhập <span className="text-slate-400 font-normal">(Cố định)</span>
            </label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600 font-medium">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{currentUser.email}</span>
            </div>
          </div>

          {/* Họ và tên */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Họ và tên <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập họ và tên của bạn"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          {/* Số điện thoại */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Số điện thoại nhận thông báo đơn <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại liên hệ"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsProfileModalOpen(false);
                logoutUser();
                setActiveNavTab('login');
              }}
              className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
