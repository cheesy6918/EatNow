import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  UtensilsCrossed,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  ChefHat,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginUser, quickLoginDemoUser, setActiveNavTab, showToast, users } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      showToast('Vui lòng nhập Email, Mã sinh viên hoặc Số điện thoại!', 'error');
      return;
    }
    const success = loginUser(identifier, password);
    if (success) {
      // loginUser in AppContext will redirect to respective role dashboard or menu
    }
  };

  const handleForgotPassword = () => {
    showToast(
      'Mẹo kiểm thử: Mật khẩu mặc định của tất cả tài khoản demo là 123456. Bạn cũng có thể chọn nhanh tài khoản demo bên dưới!',
      'info'
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50/70">
      <div className="max-w-md w-full mx-auto space-y-6">
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
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-6">
          {/* Card Header */}
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center mx-auto shadow-md shadow-amber-500/20">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Đăng nhập EatNow
            </h1>
            <p className="text-xs text-slate-500">
              Nhập mã sinh viên, email hoặc số điện thoại để vào hệ thống
            </p>
          </div>

          {/* 1. FORM NHẬP LIỆU Ở VỊ TRÍ CAO NHẤT (TEXTBOX TRÊN CÙNG) */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input 1: Identifier */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Mã sinh viên / Email / Số điện thoại <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="VD: 2374820028 hoặc linhchi@eatnow.edu.vn"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Input 2: Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Mật khẩu <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[11px] font-semibold text-amber-600 hover:text-amber-700 hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu (Mặc định: 123456)"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
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

            {/* Remember me option */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded-md border-slate-300 focus:ring-amber-500"
                />
                <span className="text-xs text-slate-600 font-medium">Ghi nhớ đăng nhập</span>
              </label>
              <span className="text-[11px] text-slate-400">Demo PIN: 123456</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <span>Đăng nhập ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch to Register link */}
          <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
            Chưa có tài khoản căn tin?{' '}
            <button
              onClick={() => setActiveNavTab('register')}
              className="font-bold text-amber-700 hover:text-amber-800 hover:underline inline-flex items-center gap-1"
            >
              <span>Đăng ký ngay</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-bold">
                +100k vào Ví
              </span>
            </button>
          </div>

          {/* 2. KHỐI ĐĂNG NHẬP NHANH VỚI TÀI KHOẢN DEMO (ĐẶT Ở DƯỚI CÙNG, GỌN GÀNG) */}
          <div className="pt-4 border-t border-dashed border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>Đăng nhập nhanh với tài khoản Demo</span>
              </span>
              <span className="text-[10px] text-slate-400">1 chạm vào ngay</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Sinh viên */}
              <button
                type="button"
                onClick={() => quickLoginDemoUser('user-sv-01')}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/60 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-amber-100 shrink-0 border border-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="Sinh viên"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-900 truncate group-hover:text-amber-800">
                      Nguyễn Linh Chi
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <span className="font-semibold text-amber-700 bg-amber-100/80 px-1 rounded">
                      Sinh viên
                    </span>
                    <span>· Ví: 150k</span>
                  </div>
                </div>
              </button>

              {/* Giảng viên */}
              <button
                type="button"
                onClick={() => quickLoginDemoUser('user-gv-01')}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 bg-slate-50 hover:bg-emerald-50/60 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-emerald-100 shrink-0 border border-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                    alt="Giảng viên"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-800">
                      ThS. Trần H. Nam
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <span className="font-semibold text-emerald-700 bg-emerald-100/80 px-1 rounded">
                      Giảng viên
                    </span>
                    <span>· Ví: 320k</span>
                  </div>
                </div>
              </button>

              {/* Nhân viên Căn tin */}
              <button
                type="button"
                onClick={() => quickLoginDemoUser('user-nv-01')}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/60 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-100 shrink-0 border border-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
                    alt="Nhân viên Bếp"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-800">
                      Nguyễn Thị Hồng
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <span className="font-semibold text-blue-700 bg-blue-100/80 px-1 rounded">
                      Bếp Căn tin
                    </span>
                    <span>· Xử lý đơn</span>
                  </div>
                </div>
              </button>

              {/* Quản trị viên */}
              <button
                type="button"
                onClick={() => quickLoginDemoUser('user-ad-01')}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:border-purple-400 bg-slate-50 hover:bg-purple-50/60 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-purple-100 shrink-0 border border-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                    alt="Quản trị viên"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-900 truncate group-hover:text-purple-800">
                      Ngô Thị Hồng Thu
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <span className="font-semibold text-purple-700 bg-purple-100/80 px-1 rounded">
                      Admin
                    </span>
                    <span>· Quản trị</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
