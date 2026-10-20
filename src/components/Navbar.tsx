import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Wallet,
  User,
  Plus,
  ClipboardList,
  UtensilsCrossed,
  ChefHat,
  BarChart3,
  Clock,
  LogOut,
  ChevronDown,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  LogIn,
  UserPlus,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    role,
    currentUser,
    isAuthenticated,
    cartItemCount,
    cartTotal,
    setIsCartOpen,
    setIsWalletModalOpen,
    setIsProfileModalOpen,
    openAuthModal,
    logoutUser,
    activeNavTab,
    setActiveNavTab,
    orders,
    showToast,
  } = useApp();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Pending orders for customer
  const activeOrdersCount = currentUser
    ? orders.filter(
        (o) =>
          o.userId === currentUser.id &&
          (o.status === 'paid_pending_confirm' ||
            o.status === 'preparing' ||
            o.status === 'ready')
      ).length
    : 0;

  // Pending orders for staff
  const staffPendingCount = orders.filter(
    (o) => o.status === 'paid_pending_confirm' || o.status === 'preparing'
  ).length;

  const handleMyOrdersClick = () => {
    if (!isAuthenticated) {
      showToast('Vui lòng đăng nhập để xem lịch sử đơn hàng của bạn!', 'info');
      openAuthModal('login');
      return;
    }
    setActiveNavTab('my-orders');
  };

  const getRoleBadge = (userRole?: string | null) => {
    switch (userRole) {
      case 'lecturer':
        return {
          label: 'Giảng viên',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: <BookOpen className="w-3 h-3 text-emerald-600" />,
        };
      case 'staff':
        return {
          label: 'Nhân viên bếp',
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          icon: <ChefHat className="w-3 h-3 text-blue-600" />,
        };
      case 'admin':
        return {
          label: 'Quản trị viên',
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
          icon: <ShieldCheck className="w-3 h-3 text-purple-600" />,
        };
      case 'customer':
      default:
        return {
          label: 'Sinh viên',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: <GraduationCap className="w-3 h-3 text-amber-600" />,
        };
    }
  };

  const roleBadge = getRoleBadge(role);

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Zone 1: Brand Title */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveNavTab('menu')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-none">
                Eat<span className="text-amber-600">Now</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-0.5">
                Căn tin Thông Minh
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <div className="hidden md:flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveNavTab('menu')}
            className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
              activeNavTab === 'menu'
                ? 'text-amber-800 bg-amber-50/90 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Thực đơn hôm nay
          </button>

          {/* Customer / Lecturer Order Navigation */}
          {(!role || role === 'customer' || role === 'lecturer') && (
            <button
              onClick={handleMyOrdersClick}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                activeNavTab === 'my-orders'
                  ? 'text-amber-800 bg-amber-50/90 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Đơn của tôi</span>
              {activeOrdersCount > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center font-mono-nums">
                  {activeOrdersCount}
                </span>
              )}
            </button>
          )}

          {/* Staff Tab */}
          {role === 'staff' && (
            <button
              onClick={() => setActiveNavTab('staff-orders')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                activeNavTab === 'staff-orders'
                  ? 'text-amber-800 bg-amber-50/90 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>Tiếp nhận & Xử lý đơn bếp</span>
              {staffPendingCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center font-mono-nums animate-pulse">
                  {staffPendingCount}
                </span>
              )}
            </button>
          )}

          {/* Admin Tab */}
          {role === 'admin' && (
            <button
              onClick={() => setActiveNavTab('admin-dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                activeNavTab === 'admin-dashboard'
                  ? 'text-amber-800 bg-amber-50/90 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Bảng Quản Trị & Doanh Thu</span>
            </button>
          )}

          {/* Operating hours */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 px-2.5 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>06:30 – 18:30</span>
          </div>
        </div>

        {/* Zone 3: Primary Actions (Auth State Dependent) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Cart Button (Always visible) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-medium transition-all shadow-sm active:scale-95"
            title="Giỏ hàng"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline font-semibold">
              {cartTotal > 0 ? (
                <span className="font-mono-nums">{cartTotal.toLocaleString('vi-VN')}₫</span>
              ) : (
                'Giỏ hàng'
              )}
            </span>
            {cartItemCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center font-mono-nums">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Case A: NOT Logged in -> Display Login & Register Buttons */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => {
                  setActiveNavTab('login');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm transition-all ${
                  activeNavTab === 'login'
                    ? 'bg-amber-100/90 text-amber-950 border-amber-400 font-bold shadow-2xs'
                    : 'border-slate-300 hover:border-amber-500 hover:bg-amber-50/50 text-slate-700 hover:text-amber-700 font-semibold'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng nhập</span>
              </button>
              <button
                onClick={() => {
                  setActiveNavTab('register');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-sm shadow-amber-500/20 active:scale-95 ${
                  activeNavTab === 'register' ? 'ring-2 ring-amber-500 ring-offset-2' : ''
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Đăng ký</span>
              </button>
            </div>
          ) : (
            /* Case B: LOGGED IN -> Wallet & User Avatar with Dropdown */
            <>
              {/* Wallet Pill */}
              <div className="flex items-center bg-amber-50/90 border border-amber-200 rounded-xl p-1 pr-1.5 sm:pr-2">
                <button
                  onClick={() => setIsWalletModalOpen(true)}
                  className="flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 py-0.5 text-slate-800 hover:text-amber-700 transition-colors"
                  title="Ví CanteenGo"
                >
                  <Wallet className="w-4 h-4 text-amber-600 shrink-0" />
                  <div className="flex flex-col text-left">
                    <span className="text-[9.5px] text-slate-500 uppercase leading-none font-bold">
                      Ví CanteenGo
                    </span>
                    <span className="text-xs sm:text-sm font-bold font-mono-nums text-slate-900 leading-tight">
                      {currentUser?.walletBalance.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setIsWalletModalOpen(true)}
                  className="w-6 h-6 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center justify-center text-xs transition-colors ml-1 shadow-2xs"
                  title="Nạp tiền vào ví"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* User Avatar with Profile Dropdown Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-slate-700 group"
                  title="Menu tài khoản"
                >
                  <div className="relative w-8 h-8 rounded-full bg-slate-100 overflow-hidden border border-slate-300 flex items-center justify-center">
                    {currentUser?.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <User className="w-4 h-4 text-slate-500" />
                    )}
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                  </div>

                  <div className="hidden lg:flex flex-col text-left max-w-[120px]">
                    <span className="text-xs font-bold text-slate-900 leading-none truncate">
                      {currentUser?.name}
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold leading-none mt-1 truncate">
                      {roleBadge.label}
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                      isDropdownOpen ? 'rotate-180 text-amber-600' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* User Summary Card */}
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60 rounded-t-2xl">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300 shrink-0">
                          {currentUser?.avatar ? (
                            <img
                              src={currentUser.avatar}
                              alt={currentUser.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-slate-500 m-2.5" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {currentUser?.name}
                          </p>
                          <div className="mt-1">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${roleBadge.bg}`}
                            >
                              {roleBadge.icon}
                              <span>{roleBadge.label}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Wallet Balance Strip */}
                      <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Số dư ví:</span>
                        <span className="font-bold font-mono-nums text-slate-900">
                          {currentUser?.walletBalance.toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    </div>

                    {/* Menu Actions */}
                    <div className="p-1 space-y-0.5 text-xs text-slate-700">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsProfileModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 font-medium transition-colors text-left"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        <span>Thông tin cá nhân</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsWalletModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 font-medium transition-colors text-left"
                      >
                        <Wallet className="w-4 h-4 text-amber-600" />
                        <span>Lịch sử nạp/rút ví</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setActiveNavTab('my-orders');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 font-medium transition-colors text-left"
                      >
                        <ClipboardList className="w-4 h-4 text-slate-500" />
                        <span>Đơn mua của tôi</span>
                      </button>

                      {role === 'staff' && (
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setActiveNavTab('staff-orders');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-amber-50 hover:text-amber-800 font-semibold transition-colors text-left"
                        >
                          <ChefHat className="w-4 h-4 text-amber-600" />
                          <span>Quản lý Bếp Căn tin</span>
                        </button>
                      )}

                      {role === 'admin' && (
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setActiveNavTab('admin-dashboard');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-800 font-semibold transition-colors text-left"
                        >
                          <BarChart3 className="w-4 h-4 text-purple-600" />
                          <span>Bảng Quản trị & Menu</span>
                        </button>
                      )}
                    </div>

                    {/* Divider & Logout */}
                    <div className="border-t border-slate-100 p-1 mt-1">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logoutUser();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
