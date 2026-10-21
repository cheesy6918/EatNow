import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Phone,
  User,
  Search,
  Filter,
  Volume2,
  VolumeX,
  Eye,
  RotateCcw,
  Printer,
  Package,
} from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    setSelectedOrderForDetail,
    setReceiptOrder,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'preparing' | 'ready' | 'history'>('pending');
  const [searchCode, setSearchCode] = useState('');
  const [selectedSlotFilter, setSelectedSlotFilter] = useState('all');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Reject order modal state
  const [rejectingOrder, setRejectingOrder] = useState<Order | null>(null);
  const [rejectReason, setRejectReason] = useState('Hết nguyên liệu món đột xuất');

  // Categorize orders
  const pendingOrders = orders.filter((o) => o.status === 'paid_pending_confirm');
  const preparingOrders = orders.filter((o) => o.status === 'preparing');
  const readyOrders = orders.filter((o) => o.status === 'ready');
  const historyOrders = orders.filter(
    (o) => o.status === 'completed' || o.status === 'cancelled'
  );

  let currentList: Order[] = [];
  if (activeTab === 'pending') currentList = pendingOrders;
  else if (activeTab === 'preparing') currentList = preparingOrders;
  else if (activeTab === 'ready') currentList = readyOrders;
  else currentList = historyOrders;

  // Filter by search and slot
  if (searchCode.trim()) {
    const q = searchCode.toLowerCase().trim();
    currentList = currentList.filter(
      (o) =>
        o.orderCode.toLowerCase().includes(q) ||
        o.userName.toLowerCase().includes(q) ||
        o.userPhone.includes(q)
    );
  }

  if (selectedSlotFilter !== 'all') {
    currentList = currentList.filter((o) => o.pickupTimeSlot === selectedSlotFilter);
  }

  // Handle reject with refund
  const handleConfirmReject = () => {
    if (!rejectingOrder) return;
    updateOrderStatus(rejectingOrder.id, 'cancelled', rejectReason);
    setRejectingOrder(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner / Kitchen Control */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
            <ChefHat className="w-4 h-4" />
            <span>Màn Hình Quản Lý Bếp & Quầy Giao Đồ Ăn</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            Tiếp nhận & Xử lý đơn hàng Căn tin
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Theo dõi đơn mới theo thời gian thực, điều phối chế biến và thông báo sẵn sàng lấy món cho sinh viên.
          </p>
          <div className="mt-2 text-xs text-amber-300 font-medium">
            Nhân viên phụ trách: <strong>Nguyễn Thị Hồng</strong>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              soundEnabled
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Âm báo đơn mới: Bật</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Âm báo: Tắt</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'pending'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>Đơn mới cần duyệt</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-mono-nums ${
                activeTab === 'pending'
                  ? 'bg-slate-950 text-amber-400'
                  : 'bg-slate-100 text-slate-600'
              } ${pendingOrders.length > 0 ? 'animate-pulse' : ''}`}
            >
              {pendingOrders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('preparing')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'preparing'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>Đang nấu trong bếp</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-mono-nums ${
                activeTab === 'preparing'
                  ? 'bg-slate-950 text-amber-400'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {preparingOrders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ready')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'ready'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>Sẵn sàng tại quầy</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-mono-nums ${
                activeTab === 'ready'
                  ? 'bg-slate-950 text-amber-400'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {readyOrders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>Lịch sử đã xong</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-mono-nums ${
                activeTab === 'history'
                  ? 'bg-slate-800 text-amber-300'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {historyOrders.length}
            </span>
          </button>
        </div>

        {/* Search & Slot Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm mã đơn hoặc tên SV..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 w-44 sm:w-56"
            />
          </div>
        </div>
      </div>

      {/* Orders Grid / Kanban */}
      {currentList.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 p-8 flex flex-col items-center justify-center">
          <ChefHat className="w-12 h-12 text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            Hiện không có đơn nào ở trạng thái này
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Nhà bếp đã chuẩn bị kịp tiến độ. Hãy chờ các sinh viên đặt món tiếp theo!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentList.map((order) => {
            const isPending = order.status === 'paid_pending_confirm';
            const isPreparing = order.status === 'preparing';
            const isReady = order.status === 'ready';
            const isCancelled = order.status === 'cancelled';
            const isCompleted = order.status === 'completed';

            return (
              <div
                key={order.id}
                className={`bg-white rounded-3xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                  isPending
                    ? 'border-amber-300 ring-2 ring-amber-400/20'
                    : isPreparing
                    ? 'border-blue-200'
                    : isReady
                    ? 'border-emerald-300 ring-1 ring-emerald-500/30'
                    : 'border-slate-200'
                }`}
              >
                {/* Header of card */}
                <div
                  className={`p-4 border-b flex items-center justify-between ${
                    isPending
                      ? 'bg-amber-50/70 border-amber-200/60'
                      : isPreparing
                      ? 'bg-blue-50/50 border-blue-100'
                      : isReady
                      ? 'bg-emerald-50/70 border-emerald-200/60'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold font-mono-nums text-slate-900">
                      #{order.orderCode}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-[11px] text-slate-500 font-mono-nums">
                      {new Date(order.createdAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white border border-slate-200 shadow-2xs">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Hẹn: {order.pickupTimeSlot}</span>
                  </div>
                </div>

                {/* Student Info */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/40 text-xs space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-bold text-slate-800 truncate">
                        {order.userName}
                      </span>
                    </div>
                    <a
                      href={`tel:${order.userPhone}`}
                      className="flex items-center gap-1 text-slate-600 hover:text-amber-600 font-medium shrink-0 font-mono-nums"
                    >
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{order.userPhone}</span>
                    </a>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 font-semibold border border-amber-200/60">
                      {order.diningOption === 'dine_in'
                        ? '🍽️ Ăn tại căn tin'
                        : '🥡 Đóng hộp mang đi'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setReceiptOrder(order)}
                      className="flex items-center gap-1 text-slate-600 hover:text-amber-700 font-bold"
                    >
                      <Printer className="w-3 h-3" />
                      <span>In phiếu bếp</span>
                    </button>
                  </div>
                </div>

                {/* Items in order */}
                <div className="p-4 flex-1 space-y-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Danh sách món đặt ({order.items.reduce((s, i) => s + i.quantity, 0)} suất)
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between gap-2 text-xs p-2 rounded-xl bg-slate-50 border border-slate-100"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center justify-center font-mono-nums shrink-0">
                            {item.quantity}
                          </span>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate">
                              {item.name}
                            </span>
                            {item.note && (
                              <span className="text-[11px] text-amber-700 italic block">
                                Ghi chú: {item.note}
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="font-mono-nums font-semibold text-slate-700 shrink-0">
                          {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-between text-xs text-slate-500">
                    <span>Tổng tiền thu qua ví:</span>
                    <strong className="text-slate-900 font-mono-nums">
                      {order.totalAmount.toLocaleString('vi-VN')}₫
                    </strong>
                  </div>

                  {order.cancelReason && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                      <strong>Đã hủy:</strong> {order.cancelReason}
                    </div>
                  )}
                </div>

                {/* Action buttons on card */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
                  {isPending && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setRejectingOrder(order)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Từ chối</span>
                      </button>

                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="flex-[2] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-all shadow-xs active:scale-95"
                      >
                        <ChefHat className="w-4 h-4" />
                        <span>Xác nhận & Nấu ngay</span>
                      </button>
                    </div>
                  )}

                  {isPreparing && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-sm active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Báo "Đã Sẵn Sàng" tại quầy</span>
                    </button>
                  )}

                  {isReady && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-all shadow-sm active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Sinh viên đã nhận món (Hoàn tất)</span>
                    </button>
                  )}

                  {(isCompleted || isCancelled) && (
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Trạng thái: <strong>{isCompleted ? 'Đã hoàn tất' : 'Đã hủy'}</strong></span>
                      <button
                        onClick={() => setSelectedOrderForDetail(order)}
                        className="text-amber-600 hover:underline font-semibold flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Hóa đơn</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Order Modal (US24: Từ chối đơn kèm lý do & tự động hoàn tiền) */}
      {rejectingOrder && (
        <div className="fixed inset-0 z-70 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900">
                Từ chối tiếp nhận đơn #{rejectingOrder.orderCode}?
              </h3>
            </div>

            <p className="text-xs text-slate-600">
              Khi từ chối, hệ thống sẽ <strong>tự động hoàn lại 100% ({rejectingOrder.totalAmount.toLocaleString('vi-VN')}₫)</strong> vào Ví CanteenGo của sinh viên {rejectingOrder.userName}.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Chọn lý do từ chối:
              </label>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              >
                <option value="Hết nguyên liệu món đột xuất">Hết nguyên liệu món đột xuất</option>
                <option value="Bếp đang quá tải vào giờ cao điểm">Bếp đang quá tải vào giờ cao điểm</option>
                <option value="Khung giờ nhận không kịp chuẩn bị">Khung giờ nhận không kịp chuẩn bị</option>
                <option value="Mất điện / Sự cố kỹ thuật thiết bị">Mất điện / Sự cố kỹ thuật thiết bị</option>
                <option value="Lý do khác">Lý do khác</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingOrder(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Xác nhận từ chối & Hoàn tiền
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
