import React, { useRef } from 'react';
import { Order } from '../../types';
import {
  Printer,
  X,
  CheckCircle2,
  Clock,
  MapPin,
  UtensilsCrossed,
  Receipt,
  Download,
  Share2,
} from 'lucide-react';

interface OrderReceiptModalProps {
  order: Order;
  onClose: () => void;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({
  order,
  onClose,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const lines = [
      '========================================',
      '      CANTEEN EATNOW - PHIẾU NHẬN MÓN    ',
      '========================================',
      `Mã đơn hàng: #${order.orderCode}`,
      `Thời gian đặt: ${new Date(order.createdAt).toLocaleString('vi-VN')}`,
      `Khách hàng: ${order.userName}`,
      `Số điện thoại: ${order.userPhone}`,
      order.userClass ? `Lớp: ${order.userClass}` : '',
      `Hình thức: ${order.diningOption === 'dine_in' ? `Ăn tại chỗ (${order.tableNumber || 'Khu quầy A1'})` : 'Đóng hộp mang đi'}`,
      `Khung giờ hẹn nhận món: ${order.pickupTimeSlot}`,
      '----------------------------------------',
      'CHI TIẾT MÓN ĂN:',
      ...order.items.map(
        (item, idx) =>
          `${idx + 1}. ${item.name} x${item.quantity} - ${(item.price * item.quantity).toLocaleString('vi-VN')}₫ ${item.note ? `[Ghi chú: ${item.note}]` : ''}`
      ),
      '----------------------------------------',
      `Tạm tính: ${order.items.reduce((s, i) => s + i.price * i.quantity, 0).toLocaleString('vi-VN')}₫`,
      order.discountAmount ? `Giảm giá Voucher (${order.voucherCode || ''}): -${order.discountAmount.toLocaleString('vi-VN')}₫` : '',
      `TỔNG THANH TOÁN: ${order.totalAmount.toLocaleString('vi-VN')}₫`,
      `Trạng thái: ĐÃ THANH TOÁN QUA VÍ CANTEENGO`,
      '========================================',
      'Quý khách vui lòng xuất trình phiếu này',
      'hoặc đọc mã đơn hàng tại quầy để nhận món.',
      'Cảm ơn quý khách và chúc ngon miệng!',
      '========================================',
    ].filter(Boolean).join('\n');

    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HoaDon_EatNow_${order.orderCode}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-70 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Container with print styles */}
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Vé nhận món & Hóa đơn #{order.orderCode}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Receipt Paper */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100/60 print:bg-white print:p-0">
          <div
            ref={receiptRef}
            id="printable-receipt"
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 mx-auto text-slate-900 font-sans print:border-none print:shadow-none print:p-2"
            style={{ maxWidth: '380px' }}
          >
            {/* Header Canteen */}
            <div className="text-center pb-4 border-b border-dashed border-slate-300">
              <div className="flex items-center justify-center gap-1.5 font-bold text-base text-slate-900">
                <div className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                </div>
                <span>EATNOW CANTEEN</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Hệ thống đặt món Căn tin Trường Đại học
              </p>
              <p className="text-[10px] text-slate-400">
                Quầy A1 & B2 · Hotline: (024) 3869 2345
              </p>
            </div>

            {/* Big Order Code Banner */}
            <div className="py-4 text-center border-b border-dashed border-slate-300">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Mã nhận món
              </span>
              <div className="text-2xl font-black font-mono-nums text-slate-900 tracking-wider">
                #{order.orderCode}
              </div>
              <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                <Clock className="w-3 h-3 text-amber-700" />
                <span>Hẹn nhận: {order.pickupTimeSlot}</span>
              </div>
            </div>

            {/* Customer & Dining Info */}
            <div className="py-3 border-b border-dashed border-slate-300 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Khách hàng:</span>
                <span className="font-semibold text-slate-900">{order.userName}</span>
              </div>
              {order.userPhone && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Số điện thoại:</span>
                  <span className="font-mono-nums">{order.userPhone}</span>
                </div>
              )}
              {order.userClass && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Lớp:</span>
                  <span>{order.userClass}</span>
                </div>
              )}
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">Hình thức:</span>
                <span className="font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                  {order.diningOption === 'dine_in'
                    ? '🍽️ Ăn tại căn tin'
                    : '🥡 Đóng hộp mang đi'}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                <span>Thời gian đặt:</span>
                <span>
                  {new Date(order.createdAt).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  - {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>

            {/* Items Table */}
            <div className="py-3 border-b border-dashed border-slate-300">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Chi tiết món ăn
              </div>
              <div className="space-y-2 text-xs">
                {order.items.map((item, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-800">
                        {item.name}{' '}
                        <strong className="text-amber-700 font-bold">
                          x{item.quantity}
                        </strong>
                      </span>
                      <span className="font-mono-nums text-slate-900">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                    {item.note && (
                      <div className="text-[10px] text-slate-500 italic pl-2">
                        * Ghi chú: {item.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="py-3 border-b border-dashed border-slate-300 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Tạm tính:</span>
                <span className="font-mono-nums">
                  {order.items
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toLocaleString('vi-VN')}
                  ₫
                </span>
              </div>
              {order.discountAmount && order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Giảm giá Voucher ({order.voucherCode}):</span>
                  <span className="font-mono-nums">
                    -{order.discountAmount.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Phí dịch vụ & bao bì:</span>
                <span className="text-emerald-600">0₫ (Miễn phí)</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-200">
                <span>TỔNG THANH TOÁN:</span>
                <span className="text-base font-extrabold font-mono-nums text-amber-600">
                  {order.totalAmount.toLocaleString('vi-VN')}₫
                </span>
              </div>
            </div>

            {/* Payment Method Badge */}
            <div className="mt-3 p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>ĐÃ THANH TOÁN QUA VÍ CANTEENGO</span>
              </div>
              <span className="text-[10px] text-emerald-600 block mt-0.5">
                Giao dịch số thực hiện thành công
              </span>
            </div>

            {/* Barcode Mock Visual */}
            <div className="mt-4 pt-3 border-t border-dashed border-slate-300 text-center">
              <div className="inline-block p-1 bg-white border border-slate-300 rounded">
                {/* SVG Mock 1D Barcode */}
                <svg className="w-48 h-8" viewBox="0 0 200 40">
                  <rect x="0" y="0" width="200" height="40" fill="#fff" />
                  <g fill="#000">
                    <rect x="10" y="5" width="2" height="30" />
                    <rect x="14" y="5" width="4" height="30" />
                    <rect x="22" y="5" width="2" height="30" />
                    <rect x="26" y="5" width="6" height="30" />
                    <rect x="36" y="5" width="2" height="30" />
                    <rect x="42" y="5" width="4" height="30" />
                    <rect x="50" y="5" width="2" height="30" />
                    <rect x="56" y="5" width="8" height="30" />
                    <rect x="68" y="5" width="2" height="30" />
                    <rect x="74" y="5" width="6" height="30" />
                    <rect x="84" y="5" width="2" height="30" />
                    <rect x="90" y="5" width="4" height="30" />
                    <rect x="98" y="5" width="6" height="30" />
                    <rect x="108" y="5" width="2" height="30" />
                    <rect x="114" y="5" width="8" height="30" />
                    <rect x="126" y="5" width="4" height="30" />
                    <rect x="134" y="5" width="2" height="30" />
                    <rect x="140" y="5" width="6" height="30" />
                    <rect x="150" y="5" width="2" height="30" />
                    <rect x="156" y="5" width="4" height="30" />
                    <rect x="164" y="5" width="6" height="30" />
                    <rect x="174" y="5" width="2" height="30" />
                    <rect x="180" y="5" width="4" height="30" />
                    <rect x="188" y="5" width="2" height="30" />
                  </g>
                </svg>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                *{order.orderCode}*
              </div>
              <p className="text-[10px] text-slate-500 mt-2">
                Quét mã hoặc đọc mã tại quầy nhận món. Chúc bạn một bữa ăn ngon miệng!
              </p>
            </div>
          </div>
        </div>

        {/* Footer Action Buttons (Hidden when printing) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 print:hidden">
          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải file .txt</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In vé / In hóa đơn</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
