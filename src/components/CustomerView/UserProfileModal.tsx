import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, User, Phone, BookOpen, Mail, Shield, LogOut } from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    currentUser,
    updateUserProfile,
    setIsAuthModalOpen,
  } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [className, setClassName] = useState(currentUser?.department || currentUser?.className || '');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setPhone(currentUser.phone);
      setClassName(currentUser.department || currentUser.className || '');
    }
  }, [currentUser]);

  if (!isProfileModalOpen || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, phone, className });
    setIsProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Thông tin tài khoản
              </h3>
              <span className="text-[11px] text-slate-500">
                Cập nhật thông tin nhận món & liên hệ (US03)
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email đăng nhập (Không thể thay đổi)
            </label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>{currentUser.email}</span>
            </div>
          </div>

          {currentUser.mssv && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mã số sinh viên (MSSV)
              </label>
              <div className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-amber-800">
                {currentUser.mssv}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Vai trò hệ thống
            </label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 font-semibold">
              <Shield className="w-4 h-4 text-amber-600" />
              <span>
                {currentUser.role === 'customer'
                  ? 'Sinh viên / Khách hàng'
                  : currentUser.role === 'staff'
                  ? 'Nhân viên Căn tin (Bếp & Quầy)'
                  : 'Quản trị viên (Admin)'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Số điện thoại nhận thông báo đơn
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Lớp học / Đơn vị công tác
            </label>
            <div className="relative">
              <BookOpen className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Ví dụ: K21-CNTT01, Giảng viên Khoa Kinh Tế..."
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setIsProfileModalOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đổi tài khoản</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-semibold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs"
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
