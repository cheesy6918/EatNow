import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import {
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  UtensilsCrossed,
  GraduationCap,
  BookOpen,
  ChefHat,
  CheckCircle2,
  Gift,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { registerUser, setActiveNavTab, showToast } = useApp();

  const [name, setName] = useState('');
  const [mssv, setMssv] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [className, setClassName] = useState('');
  const [role, setRole] = useState<Role>('customer');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Vui lòng nhập Họ và tên!', 'error');
      return;
    }
    if (!mssv.trim()) {
      showToast('Vui lòng nhập Mã sinh viên / Mã nhân viên!', 'error');
      return;
    }
    if (!emailOrPhone.trim()) {
      showToast('Vui lòng nhập Email hoặc Số điện thoại!', 'error');
      return;
    }
    if (!password) {
      showToast('Vui lòng nhập mật khẩu!', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Mật khẩu phải có ít nhất 6 ký tự!', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp! Vui lòng kiểm tra lại.', 'error');
      return;
    }

    const success = registerUser({
      name: name.trim(),
      mssv: mssv.trim(),
      emailOrPhone: emailOrPhone.trim(),
      className: className.trim() || undefined,
      role,
      password,
    });

    if (success) {
      // registerUser sets user and redirects to menu/dashboard
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50/70">
      <div className="max-w-xl w-full mx-auto space-y-6">
        {/* Navigation back to home */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveNavTab('menu')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-amber-700 bg-white hover:bg-amber-50 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors shadow-2xs group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Quay lại trang chủ</span>
          </button>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>EatNow Canteen</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-5">
          {/* Card Header */}
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center mx-auto shadow-md shadow-amber-500/20">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Đăng ký tài khoản EatNow
            </h1>
            <p className="text-xs text-slate-500">
              Tạo tài khoản để đặt món nhanh, không cần xếp hàng tại quầy
            </p>
            {/* Promo banner */}
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-50/90 border border-amber-200 px-3.5 py-1.5 rounded-full mt-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Tặng ngay 100.000₫ vào Ví CanteenGo khi đăng ký</span>
            </div>
          </div>

          {/* FORM NHẬP LIỆU Ở VỊ TRÍ CAO NHẤT (TEXTBOX TRÊN CÙNG) */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            {/* Row 1: Name & MSSV */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Họ và tên <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="VD: Nguyễn Văn An"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-slate-900 font-medium"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Mã sinh viên / Mã NV <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={mssv}
                    onChange={(e) => setMssv(e.target.value)}
                    placeholder="VD: 2412890011 hoặc GV-09"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-slate-900 font-medium font-mono"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Email/Phone & Class/Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Số điện thoại / Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="0912 345 678 hoặc email@..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-slate-900 font-medium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Lớp / Khoa / Đơn vị <span className="text-slate-400 font-normal">(Tùy chọn)</span>
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="VD: K22-CNTT hoặc Khoa Kinh tế"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-slate-900 font-medium"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Vai trò của bạn trong trường <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                    role === 'customer'
                      ? 'border-amber-500 bg-amber-50/70 text-amber-900 ring-2 ring-amber-500/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50/50'
                  }`}
                >
                  <GraduationCap className="w-5 h-5 mb-1 text-amber-600" />
                  <span className="text-xs font-bold">Sinh viên</span>
                  <span className="text-[10px] text-slate-500">Khách hàng</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('lecturer')}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                    role === 'lecturer'
                      ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50/50'
                  }`}
                >
                  <BookOpen className="w-5 h-5 mb-1 text-emerald-600" />
                  <span className="text-xs font-bold">Giảng viên</span>
                  <span className="text-[10px] text-slate-500">Cán bộ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('staff')}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                    role === 'staff'
                      ? 'border-blue-500 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50/50'
                  }`}
                >
                  <ChefHat className="w-5 h-5 mb-1 text-blue-600" />
                  <span className="text-xs font-bold">Nhân viên</span>
                  <span className="text-[10px] text-slate-500">Bếp Căn tin</span>
                </button>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Mật khẩu <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-slate-900 font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Xác nhận mật khẩu <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-slate-900 font-medium"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Terms notice */}
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Bằng việc đăng ký, bạn đồng ý với quy định sử dụng Căn tin và hệ thống thanh toán Ví điện tử CanteenGo.
            </p>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <span>Hoàn tất đăng ký & Nhận 100.000₫</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch to Login link */}
          <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
            Đã có tài khoản?{' '}
            <button
              onClick={() => setActiveNavTab('login')}
              className="font-bold text-amber-700 hover:text-amber-800 hover:underline"
            >
              Đăng nhập ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
