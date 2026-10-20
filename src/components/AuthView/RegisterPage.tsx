import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { registerUser, setActiveNavTab, showToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Vui lòng nhập Họ và tên!', 'error');
      return;
    }
    if (!email.trim()) {
      showToast('Vui lòng nhập Địa chỉ email!', 'error');
      return;
    }
    if (!password) {
      showToast('Vui lòng nhập Mật khẩu!', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Mật khẩu tối thiểu phải từ 6 ký tự!', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp! Vui lòng kiểm tra lại.', 'error');
      return;
    }
    if (!phone.trim()) {
      showToast('Vui lòng nhập Số điện thoại!', 'error');
      return;
    }

    registerUser({
      name: name.trim(),
      emailOrPhone: email.trim(),
      password,
      phone: phone.trim(),
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-10 px-4 sm:px-6 bg-[#faf6f0]">
      <div className="max-w-[420px] w-full mx-auto space-y-4">
        {/* Navigation back to menu */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveNavTab('menu')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-orange-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại trang chủ</span>
          </button>
        </div>

        {/* Card Component */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-7 sm:p-9 space-y-5">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight">
              Tạo tài khoản
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => setActiveNavTab('login')}
                className="text-orange-500 hover:text-orange-600 font-semibold cursor-pointer underline-offset-2 hover:underline"
              >
                Đăng nhập ngay!
              </button>
            </p>
          </div>

          {/* Form matching Image 1 layout exactly */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            {/* Field 1: Họ và tên */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-900">
                Họ và tên
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900 placeholder:text-slate-400 font-medium transition-all"
                required
                autoFocus
              />
            </div>

            {/* Field 2: Địa chỉ email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-900">
                Địa chỉ email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sinhvien@st.edu.vn"
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900 placeholder:text-slate-400 font-medium transition-all"
                required
              />
              <p className="text-xs text-slate-500 pt-0.5">
                Sinh viên: @st.edu.vn • Giảng viên: @edu.vn
              </p>
            </div>

            {/* Field 3: Mật khẩu */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-900">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900 placeholder:text-slate-400 font-medium transition-all"
                required
              />
            </div>

            {/* Field 4: Xác nhận mật khẩu */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-900">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900 placeholder:text-slate-400 font-medium transition-all"
                required
              />
            </div>

            {/* Field 5: Số điện thoại */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-900">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0901234567"
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900 placeholder:text-slate-400 font-medium transition-all"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Đăng ký →</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
