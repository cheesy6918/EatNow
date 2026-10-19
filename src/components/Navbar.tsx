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
    quickLoginDemoUser,
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
      setActiveNavTab('login');
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
          label: 'Bếp Căn tin',
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
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Brand Title (Compact & Polished) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveNavTab('menu')}
            className="flex items-center gap-2 text-left group cursor-pointer select-none"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 leading-none">
                Eat<span className="text-amber-600">Now</span>
              </span>
              <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5 hidden xs:inline">
                Căn tin ĐH
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Segmented Navigation Bar (Tidy, Neat, Centered) */}
        <div className="hidden sm:flex items-center bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60 shadow-2xs">
          <button
            onClick={() => setActiveNavTab('menu')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeNavTab === 'menu'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            Thực đơn
          </button>

          {/* Customer / Lecturer Orders */}
          {(!role || role === 'customer' || role === 'lecturer') && (
            <button
              onClick={handleMyOrdersClick}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeNavTab === 'my-orders'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5 text-slate-500" />
              <span>Đơn mua</span>
              {activeOrdersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                  {activeOrdersCount}
                </span>
              )}
            </button>
          )}

          {/* Kitchen Staff Tab */}
          {(role === 'staff' || role === 'admin') && (
            <button
              onClick={() => setActiveNavTab('staff-orders')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeNavTab === 'staff-orders'
                  ? 'bg-white text-blue-900 shadow-2xs'
                  : 'text-blue-700 hover:text-blue-900 hover:bg-blue-100/50'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5 text-blue-600" />
              <span>Bếp</span>
              {staffPendingCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center animate-pulse">
                  {staffPendingCount}
                </span>
              )}
            </button>
          )}

          {/* Admin Management Tab */}
          {role === 'admin' && (
            <button
              onClick={() => setActiveNavTab('admin-dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeNavTab === 'admin-dashboard'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'text-purple-700 hover:text-purple-900 hover:bg-purple-100/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Quản trị</span>
            </button>
          )}
        </div>

        {/* Zone 3: Actions (Cart, Wallet, Auth / User Menu) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
            title="Xem giỏ hàng"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline font-mono-nums text-xs">
              {cartTotal > 0 ? `${cartTotal.toLocaleString('vi-VN')}₫` : 'Giỏ hàng'}
            </span>
            {cartItemCount > 0 && (
              <span className="w-4.5 h-4.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10.5px] flex items-center justify-center font-mono-nums">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Case A: NOT Authenticated */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => quickLoginDemoUser('user-admin-01')}
                className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                title="Bấm để vào nhanh quyền Quản trị viên"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Admin Demo</span>
              </button>

              <button
                onClick={() => {
                  setActiveNavTab('login');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  activeNavTab === 'login'
                    ? 'bg-amber-100 text-amber-950 border-amber-400 shadow-2xs'
                    : 'border-slate-300 hover:border-amber-500 hover:bg-amber-50/60 text-slate-700'
                }`}
              >
                Đăng nhập
              </button>

              <button
                onClick={() => {
                  setActiveNavTab('register');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                Đăng ký
              </button>
            </div>
          ) : (
            /* Case B: Logged In -> Tidy Wallet Pill & User Avatar */
            /* Case B: LOGGED IN -> Wallet & User Avatar with Dropdown */
            <>
              {/* Wallet Pill (Clean, compact, single-line) */}
              <div className="flex items-center bg-amber-50/90 border border-amber-200/90 rounded-xl px-2 py-1 gap-1.5 shadow-2xs">
                <button
                  onClick={() => setIsWalletModalOpen(true)}
                  className="flex items-center gap-1.5 text-slate-800 hover:text-amber-700 transition-colors cursor-pointer"
                  title="Xem số dư Ví CanteenGo"
                >
                  <Wallet className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="text-xs font-bold font-mono-nums text-slate-900 leading-none">
                    {currentUser?.walletBalance.toLocaleString('vi-VN')}₫
                  </span>
                </button>
                <button
                  onClick={() => setIsWalletModalOpen(true)}
                  className="w-5 h-5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  title="Nạp tiền vào ví"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* User Avatar with Profile Dropdown Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-slate-700 group cursor-pointer"
                  title="Menu tài khoản"
                >
                  <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 overflow-hidden border border-slate-300 flex items-center justify-center shrink-0">
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

                  <div className="hidden lg:flex flex-col text-left max-w-[110px]">
                    <span className="text-xs font-bold text-slate-900 leading-none truncate">
                      {currentUser?.name}
                    </span>
                    <span className="text-[9.5px] text-amber-700 font-semibold leading-none mt-1 truncate">
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
                  <div className="absolute right-0 mt-2 w-70 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
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
                          <p className="text-[11px] text-slate-500 font-mono truncate">
                            {currentUser?.mssv ? `Mã: ${currentUser.mssv}` : currentUser?.email}
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
                        <span className="text-slate-500">Số dư ví CanteenGo:</span>
                        <span className="font-bold font-mono-nums text-slate-900">
                          {currentUser?.walletBalance.toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    </div>

                    {/* Quick Role Switcher (Demo 1-Touch) */}
                    <div className="p-2 border-b border-slate-100 bg-slate-50/40 space-y-1.5">
                      <div className="flex items-center justify-between text-[10.5px] font-bold text-slate-500 px-1">
                        <span>CHUYỂN VAI TRÒ NHANH (DEMO)</span>
                        <span className="text-purple-700 font-bold">1 chạm</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            quickLoginDemoUser('user-admin-01');
                            setActiveNavTab('admin-dashboard');
                          }}
                          className={`p-1.5 rounded-lg border text-left flex items-center gap-1.5 transition-colors cursor-pointer ${
                            role === 'admin'
                              ? 'bg-purple-100 border-purple-400 text-purple-950 font-bold ring-1 ring-purple-300'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-purple-50 hover:border-purple-300'
                          }`}
                          title="Chuyển sang Quản trị viên"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span className="text-xs font-bold truncate">👑 Admin</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            quickLoginDemoUser('user-nv-01');
                            setActiveNavTab('staff-orders');
                          }}
                          className={`p-1.5 rounded-lg border text-left flex items-center gap-1.5 transition-colors cursor-pointer ${
                            role === 'staff'
                              ? 'bg-blue-100 border-blue-400 text-blue-950 font-bold ring-1 ring-blue-300'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300'
                          }`}
                          title="Chuyển sang Bếp Căn tin"
                        >
                          <ChefHat className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="text-xs font-bold truncate">🍳 Bếp</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            quickLoginDemoUser('user-sv-01');
                            setActiveNavTab('menu');
                          }}
                          className={`p-1.5 rounded-lg border text-left flex items-center gap-1.5 transition-colors cursor-pointer ${
                            role === 'customer'
                              ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold ring-1 ring-amber-300'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-300'
                          }`}
                          title="Chuyển sang Sinh viên"
                        >
                          <GraduationCap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="text-xs font-bold truncate">🎓 Sinh viên</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            quickLoginDemoUser('user-gv-01');
                            setActiveNavTab('menu');
                          }}
                          className={`p-1.5 rounded-lg border text-left flex items-center gap-1.5 transition-colors cursor-pointer ${
                            role === 'lecturer'
                              ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold ring-1 ring-emerald-300'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300'
                          }`}
                          title="Chuyển sang Giảng viên"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="text-xs font-bold truncate">📚 Giảng viên</span>
                        </button>
                      </div>
                    </div>

                    {/* Menu Actions */}
                    <div className="p-1 space-y-0.5 text-xs text-slate-700">
                      {role === 'admin' && (
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setActiveNavTab('admin-dashboard');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-purple-50 text-purple-900 font-bold hover:bg-purple-100 transition-colors text-left"
                        >
                          <BarChart3 className="w-4 h-4 text-purple-600" />
                          <span>Bảng Quản trị & Menu</span>
                        </button>
                      )}

                      {(role === 'staff' || role === 'admin') && (
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setActiveNavTab('staff-orders');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-900 font-semibold transition-colors text-left"
                        >
                          <ChefHat className="w-4 h-4 text-blue-600" />
                          <span>Quản lý Bếp Căn tin</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsProfileModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 font-medium transition-colors text-left cursor-pointer"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        <span>Thông tin tài khoản & vai trò</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsWalletModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 font-medium transition-colors text-left cursor-pointer"
                      >
                        <Wallet className="w-4 h-4 text-amber-600" />
                        <span>Lịch sử nạp/rút ví CanteenGo</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setActiveNavTab('my-orders');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 font-medium transition-colors text-left cursor-pointer"
                      >
                        <ClipboardList className="w-4 h-4 text-slate-500" />
                        <span>Đơn mua của tôi</span>
                      </button>
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

      {/* Mobile Sub-Navigation Bar (Clean, tidy horizontal strip) */}
      <div className="sm:hidden flex items-center justify-around px-2 py-1.5 bg-slate-50/95 border-t border-slate-200 text-xs">
        <button
          onClick={() => setActiveNavTab('menu')}
          className={`flex-1 py-1 px-1 rounded-lg text-center font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer ${
            activeNavTab === 'menu'
              ? 'bg-amber-100 text-amber-950 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>Thực đơn</span>
        </button>

        {(!role || role === 'customer' || role === 'lecturer') && (
          <button
            onClick={handleMyOrdersClick}
            className={`flex-1 py-1 px-1 rounded-lg text-center font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer relative ${
              activeNavTab === 'my-orders'
                ? 'bg-amber-100 text-amber-950 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Đơn mua</span>
            {activeOrdersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                {activeOrdersCount}
              </span>
            )}
          </button>
        )}

        {(role === 'staff' || role === 'admin') && (
          <button
            onClick={() => setActiveNavTab('staff-orders')}
            className={`flex-1 py-1 px-1 rounded-lg text-center font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer ${
              activeNavTab === 'staff-orders'
                ? 'bg-blue-100 text-blue-950 font-bold'
                : 'text-slate-600 hover:text-blue-700'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Bếp</span>
            {staffPendingCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {staffPendingCount}
              </span>
            )}
          </button>
        )}

        {role === 'admin' && (
          <button
            onClick={() => setActiveNavTab('admin-dashboard')}
            className={`flex-1 py-1 px-1 rounded-lg text-center font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer ${
              activeNavTab === 'admin-dashboard'
                ? 'bg-purple-100 text-purple-950 ring-1 ring-purple-300'
                : 'text-purple-700 hover:text-purple-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Quản trị</span>
          </button>
        )}
      </div>
    </nav>
  );
};
