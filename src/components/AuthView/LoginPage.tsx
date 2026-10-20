import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginUser, setActiveNavTab, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Vui lòng nhập Địa chỉ email!', 'error');
      return;
    }
    if (!password) {
      showToast('Vui lòng nhập mật khẩu!', 'error');
      return;
    }
    loginUser(email.trim(), password);
  };

  const fillTestAccount = (testEmail: string, testPw: string = '123456') => {
    setEmail(testEmail);
    setPassword(testPw);
    showToast(`Đã chọn tài khoản: ${testEmail}`, 'info');
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
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-7 sm:p-9 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight">
              Chào mừng trở lại!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Bạn mới đến với EatNow?{' '}
              <button
                type="button"
                onClick={() => setActiveNavTab('register')}
                className="text-orange-500 hover:text-orange-600 font-semibold cursor-pointer underline-offset-2 hover:underline"
              >
                Tham gia cùng chúng tôi tại đây!
              </button>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            {/* Field: Địa chỉ email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-900">
                Địa chỉ email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900 placeholder:text-slate-400 font-medium transition-all"
                required
                autoFocus
              />
            </div>

            {/* Field: Mật khẩu */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-900">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu của bạn"
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900 placeholder:text-slate-400 font-medium transition-all"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Đăng nhập →</span>
            </button>
          </form>

          {/* Test Accounts Dotted Box */}
          <div className="border border-dashed border-slate-300 rounded-2xl bg-[#fafafa] p-4 text-xs text-slate-600 space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Tài khoản kiểm thử (Nhấp để chọn nhanh):
            </div>
            <div
              onClick={() => fillTestAccount('sinhvien@st.edu.vn', '123456')}
              className="hover:text-orange-600 hover:bg-orange-50/60 p-1 rounded-md transition-colors cursor-pointer select-none"
              title="Nhấp để điền nhanh tài khoản Sinh viên"
            >
              <span className="font-semibold text-slate-800">Sinh viên:</span> sinhvien@st.edu.vn / 123456
            </div>
            <div
              onClick={() => fillTestAccount('giangvien@edu.vn', '123456')}
              className="hover:text-orange-600 hover:bg-orange-50/60 p-1 rounded-md transition-colors cursor-pointer select-none"
              title="Nhấp để điền nhanh tài khoản Giảng viên"
            >
              <span className="font-semibold text-slate-800">Giảng viên:</span> giangvien@edu.vn / 123456
            </div>
            <div
              onClick={() => fillTestAccount('nhanvien@canteen.vn', '123456')}
              className="hover:text-orange-600 hover:bg-orange-50/60 p-1 rounded-md transition-colors cursor-pointer select-none"
              title="Nhấp để điền nhanh tài khoản Nhân viên"
            >
              <span className="font-semibold text-slate-800">Nhân viên:</span> nhanvien@canteen.vn / 123456
            </div>
            <div
              onClick={() => fillTestAccount('admin@eatnow.vn', '123456')}
              className="hover:text-orange-600 hover:bg-orange-50/60 p-1 rounded-md transition-colors cursor-pointer select-none"
              title="Nhấp để điền nhanh tài khoản Quản trị viên"
            >
              <span className="font-semibold text-slate-800">Admin:</span> admin@eatnow.vn / 123456
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
