import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Utensils,
  ChevronRight,
  RotateCcw,
  Printer,
  Star,
  Package,
  UtensilsCrossed,
  Tag,
} from 'lucide-react';

export const MyOrdersView: React.FC = () => {
  const {
    orders,
    currentUser,
    setSelectedOrderForDetail,
    setActiveNavTab,
    receiptOrder,
    setReceiptOrder,
    reviewingOrder,
    setReviewingOrder,
    openAuthModal,
  } = useApp();
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
            Đăng nhập để xem Đơn của tôi
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            Bạn cần đăng nhập để theo dõi trạng thái đơn hàng theo thời gian thực, xem mã nhận món và nhận hóa đơn thanh toán.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openAuthModal('login')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition-all"
            >
              Đăng nhập ngay
            </button>
            <button
              onClick={() => setActiveNavTab('menu')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition-all"
            >
              Xem thực đơn căn tin
            </button>
          </div>
        </div>
      </div>
    );
  }

  const myOrders = orders.filter((o) => o.userId === currentUser.id);

  const filteredOrders = myOrders.filter((order) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') {
      return (
        order.status === 'paid_pending_confirm' ||
        order.status === 'preparing' ||
        order.status === 'ready'
      );
    }
    if (filterStatus === 'completed') return order.status === 'completed';
    if (filterStatus === 'cancelled') return order.status === 'cancelled';
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'paid_pending_confirm':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Chờ xác nhận</span>
          </span>
        );
      case 'preparing':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 flex items-center gap-1">
            <Utensils className="w-3.5 h-3.5" />
            <span>Đang chế biến</span>
          </span>
        );
      case 'ready':
        return (
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500 text-white flex items-center gap-1 animate-pulse">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Đã sẵn sàng nhận</span>
          </span>
        );
      case 'completed':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Đã nhận món</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Đã hủy</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Title & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-amber-600" />
            <span>Lịch sử & Tiến độ đơn đặt món</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi thời gian thực quá trình chuẩn bị món ăn tại căn tin
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterStatus === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả ({myOrders.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterStatus === 'active'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đang phục vụ
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterStatus === 'completed'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đã hoàn tất
          </button>
          <button
            onClick={() => setFilterStatus('cancelled')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterStatus === 'cancelled'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đã hủy
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 p-8 flex flex-col items-center justify-center">
          <ClipboardList className="w-12 h-12 text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            Chưa có đơn hàng nào trong mục này
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Bạn chưa đặt món nào hoặc các đơn đã được lọc. Khám phá ngay thực đơn hấp dẫn hôm nay nhé!
          </p>
          <button
            onClick={() => setActiveNavTab('menu')}
            className="mt-4 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Xem thực đơn ngay
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-bold font-mono-nums text-slate-900">
                    #{order.orderCode}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500">
                    {new Date(order.createdAt).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    ngày{' '}
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                  {getStatusBadge(order.status)}
                </div>

                {/* Items Summary */}
                <div className="text-sm font-semibold text-slate-800">
                  {order.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1 font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Hẹn lấy món: {order.pickupTimeSlot}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium text-slate-700">
                    {order.diningOption === 'dine_in' ? `🍽️ Ăn tại chỗ (${order.tableNumber || 'Khu A1'})` : '🥡 Mang đi'}
                  </span>
                  {order.discountAmount && order.discountAmount > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium">
                      🏷️ -{order.discountAmount.toLocaleString('vi-VN')}₫
                    </span>
                  )}
                  <span>·</span>
                  <span>
                    Tổng tiền:{' '}
                    <strong className="text-slate-900 font-mono-nums">
                      {order.totalAmount.toLocaleString('vi-VN')}₫
                    </strong>
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {order.status === 'completed' && (
                  <button
                    onClick={() => setReviewingOrder(order)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-200 transition-colors"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                    <span>Đánh giá</span>
                  </button>
                )}

                <button
                  onClick={() => setReceiptOrder(order)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  title="In phiếu nhận món"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>In vé</span>
                </button>

                <button
                  onClick={() => setSelectedOrderForDetail(order)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                >
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>Chi tiết</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
