import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, User, Phone, BookOpen, Mail, Shield, LogOut, ChefHat } from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    currentUser,
    updateUserProfile,
    quickLoginDemoUser,
    logoutUser,
    setActiveNavTab,
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Vai trò hệ thống (Bấm để chuyển nhanh vai trò)
              </label>
              <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                1 chạm chuyển đổi
              </span>
            </div>
            
            {/* Clickable Role Pills Grid - Allows user to click Admin directly! */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  quickLoginDemoUser('user-admin-01');
                  setIsProfileModalOpen(false);
                  setActiveNavTab('admin-dashboard');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                  currentUser.role === 'admin'
                    ? 'bg-purple-100 border-purple-400 text-purple-950 font-bold ring-2 ring-purple-400/40'
                    : 'bg-purple-50/70 border-purple-200 text-purple-800 hover:bg-purple-100 hover:border-purple-300'
                }`}
                title="Bấm để vào chế độ Quản trị viên (Admin)"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold leading-tight flex items-center gap-1">
                    <span>Quản trị viên</span>
                    {currentUser.role === 'admin' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    )}
                  </div>
                  <div className="text-[10px] text-purple-700 font-medium">Bảng Admin & Quản lý</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  quickLoginDemoUser('user-nv-01');
                  setIsProfileModalOpen(false);
                  setActiveNavTab('staff-orders');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                  currentUser.role === 'staff'
                    ? 'bg-blue-100 border-blue-400 text-blue-950 font-bold ring-2 ring-blue-400/40'
                    : 'bg-blue-50/70 border-blue-200 text-blue-800 hover:bg-blue-100 hover:border-blue-300'
                }`}
                title="Bấm để chuyển sang Bếp Căn tin"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <ChefHat className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold leading-tight flex items-center gap-1">
                    <span>Bếp Căn tin</span>
                    {currentUser.role === 'staff' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <div className="text-[10px] text-blue-700 font-medium">Xử lý & bàn giao đơn</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  quickLoginDemoUser('user-sv-01');
                  setIsProfileModalOpen(false);
                  setActiveNavTab('menu');
                }}
                className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                  currentUser.role === 'customer'
                    ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold ring-2 ring-amber-400/40'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-300'
                }`}
              >
                <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 text-xs font-bold">
                  SV
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold leading-tight">Sinh viên</div>
                  <div className="text-[10px] text-slate-500">Đặt món & ví</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  quickLoginDemoUser('user-gv-01');
                  setIsProfileModalOpen(false);
                  setActiveNavTab('menu');
                }}
                className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                  currentUser.role === 'lecturer'
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold ring-2 ring-emerald-400/40'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300'
                }`}
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  GV
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold leading-tight">Giảng viên</div>
                  <div className="text-[10px] text-slate-500">Ưu tiên phục vụ</div>
                </div>
              </button>
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

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsProfileModalOpen(false);
                logoutUser();
                setActiveNavTab('login');
              }}
              className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất / Đổi tài khoản</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs cursor-pointer"
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
