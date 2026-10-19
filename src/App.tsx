import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/CustomerView/HeroBanner';
import { MenuFilter } from './components/CustomerView/MenuFilter';
import { FoodGrid } from './components/CustomerView/FoodGrid';
import { FoodDetailModal } from './components/CustomerView/FoodDetailModal';
import { CartDrawer } from './components/CustomerView/CartDrawer';
import { OrderDetailModal } from './components/CustomerView/OrderDetailModal';
import { MyOrdersView } from './components/CustomerView/MyOrdersView';
import { WalletModal } from './components/CustomerView/WalletModal';
import { UserProfileModal } from './components/CustomerView/UserProfileModal';
import { StaffDashboard } from './components/StaffView/StaffDashboard';
import { AdminDashboard } from './components/AdminView/AdminDashboard';
import { LoginPage } from './components/AuthView/LoginPage';
import { RegisterPage } from './components/AuthView/RegisterPage';
import { ToastContainer } from './components/ToastContainer';
import { OrderReceiptModal } from './components/CustomerView/OrderReceiptModal';
import { FoodReviewModal } from './components/CustomerView/FoodReviewModal';
import { MarqueeBanner } from './components/CustomerView/MarqueeBanner';
import {
  UtensilsCrossed,
  Clock,
  ShieldCheck,
  HeartHandshake,
  PhoneCall,
  MapPin,
  ChefHat,
  BarChart3,
  Lock,
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    role,
    isAuthenticated,
    activeNavTab,
    selectedFood,
    selectedOrderForDetail,
    setSelectedOrderForDetail,
    receiptOrder,
    setReceiptOrder,
    reviewingOrder,
    setReviewingOrder,
    openAuthModal,
    setActiveNavTab,
    quickLoginDemoUser,
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">
      {/* 1. Primary Navigation (Role Switcher bar removed per requirement 1) */}
      <Navbar />

      {/* 2. Main Body Content */}
      <main className="flex-1 pb-16">
        {/* Render View by Nav Tab */}
        {activeNavTab === 'menu' && (
          <div className="space-y-6">
            {/* Announcement Marquee Bar right above Hero Banner */}
            <MarqueeBanner />
            <HeroBanner />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <MenuFilter />
              <FoodGrid />

              {/* Service Commitments Strip */}
              <section className="mt-12 p-8 rounded-3xl bg-white border border-slate-200">
                <div className="max-w-2xl">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
                    Tiêu chuẩn phục vụ
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Bữa ăn chất lượng, an toàn và đúng hẹn
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                    EatNow giúp căn tin tối ưu quy trình nấu nướng và đóng gói trước giờ nghỉ trưa, đảm bảo đồ ăn luôn nóng hổi khi đến tay sinh viên và giảng viên.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100 text-xs">
                  <div className="space-y-1.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Clock className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Chuẩn bị trước 10 phút
                    </h4>
                    <p className="text-slate-500 leading-relaxed">
                      Món ăn chỉ bắt đầu được hâm nóng và chia suất 10 phút trước khung giờ bạn hẹn đến lấy.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Bảo vệ số dư Ví 100%
                    </h4>
                    <p className="text-slate-500 leading-relaxed">
                      Nếu món hết đột xuất hoặc bếp từ chối, tiền được hoàn tự động về Ví CanteenGo tức thì.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Vệ sinh an toàn thực phẩm
                    </h4>
                    <p className="text-slate-500 leading-relaxed">
                      Nguyên liệu tươi nhập mỗi sớm, nguồn gốc rõ ràng, đạt chứng nhận ATTP trường học.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {activeNavTab === 'my-orders' && <MyOrdersView />}

        {activeNavTab === 'staff-orders' &&
          (role === 'staff' || role === 'admin' ? (
            <StaffDashboard />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
                <ChefHat className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Khu vực Quản lý Bếp Căn tin
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Trang này dành riêng cho nhân viên căn tin tiếp nhận và xử lý đơn món. Vui lòng đăng nhập với tài khoản nhân viên.
              </p>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={() => quickLoginDemoUser('user-nv-01')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChefHat className="w-4 h-4" />
                  <span>Đăng nhập Bếp (1 chạm)</span>
                </button>
                <button
                  onClick={() => setActiveNavTab('login')}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
                >
                  Đến trang Đăng nhập
                </button>
                <button
                  onClick={() => setActiveNavTab('menu')}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Về thực đơn
                </button>
              </div>
            </div>
          ))}

        {activeNavTab === 'admin-dashboard' &&
          (role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 mx-auto flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Khu vực Quản trị viên
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Trang này dành cho quản trị viên hệ thống quản lý thực đơn, duyệt đơn hàng, người dùng và xuất báo cáo dữ liệu.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <button
                  onClick={() => quickLoginDemoUser('user-admin-01')}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Đăng nhập Admin (1 chạm)</span>
                </button>
                <button
                  onClick={() => setActiveNavTab('login')}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
                >
                  Đến trang Đăng nhập
                </button>
                <button
                  onClick={() => setActiveNavTab('menu')}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Về thực đơn
                </button>
              </div>
            </div>
          ))}

        {/* 4. Dedicated Authentication Views (Separate Pages) */}
        {activeNavTab === 'login' && <LoginPage />}
        {activeNavTab === 'register' && <RegisterPage />}
      </main>

      {/* 3. Quiet Editorial Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                <UtensilsCrossed className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-bold text-slate-900">
                Eat<span className="text-amber-600">Now</span> Canteen System
              </span>
            </div>
            <p className="text-slate-400 max-w-sm">
              Hệ thống đặt món trực tuyến tại căn tin trường đại học. Giảm tải xếp hàng, thanh toán thông minh và tối ưu vận hành nhà bếp.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-slate-700 block">Thời gian phục vụ</span>
              <div>Thứ Hai – Thứ Bảy: 06:30 – 18:30</div>
              <div>Chủ Nhật: 07:00 – 14:00</div>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-700 block">Liên hệ & Hỗ trợ</span>
              <div className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                <span>Hotline Quầy Bếp: (024) 3869 2345</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Tầng 1, Tòa nhà Căn tin Trung tâm</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
          <div>
            © {new Date().getFullYear()} EatNow Platform. Toàn quyền bảo lưu.
          </div>
          <div className="flex items-center gap-4">
            <span>Chính sách hoàn tiền Ví CanteenGo</span>
            <span>·</span>
            <span>Tiêu chuẩn an toàn thực phẩm</span>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      {selectedFood && <FoodDetailModal />}
      <CartDrawer />
      {selectedOrderForDetail && (
        <OrderDetailModal
          order={selectedOrderForDetail}
          onClose={() => setSelectedOrderForDetail(null)}
        />
      )}
      <WalletModal />
      <UserProfileModal />
      {receiptOrder && (
        <OrderReceiptModal
          order={receiptOrder}
          onClose={() => setReceiptOrder(null)}
        />
      )}
      {reviewingOrder && (
        <FoodReviewModal
          order={reviewingOrder}
          onClose={() => setReviewingOrder(null)}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
