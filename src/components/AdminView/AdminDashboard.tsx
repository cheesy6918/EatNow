import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodItem, Category, Voucher, Order, OrderStatus, Role } from '../../types';
import { generateMySQLScript } from '../../utils/mysqlExport';
import {
  BarChart3,
  Utensils,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  Search,
  CheckCircle2,
  AlertTriangle,
  X,
  Database,
  Download,
  Copy,
  Tag,
  Code,
  Table,
  Check,
  ShoppingBag,
  Layers,
  Wallet,
  KeyRound,
  Clock,
  Shield,
  ChefHat,
  Filter,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  RefreshCw,
  Sliders,
  Settings,
  Megaphone,
  FileText,
  PlayCircle,
  RotateCcw,
  GitBranch,
  ExternalLink,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    foods,
    categories,
    orders,
    reviews,
    users,
    transactions,
    vouchers,
    switchUser,
    createOrder,
    adminAddFood,
    adminUpdateFood,
    adminDeleteFood,
    adminToggleFoodAvailability,
    adminAddVoucher,
    adminDeleteVoucher,
    adminAddCategory,
    adminUpdateCategory,
    adminDeleteCategory,
    adminAdjustUserWallet,
    adminUpdateUserRole,
    adminResetUserPassword,
    updateOrderStatus,
    cancelOrder,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'menu' | 'categories' | 'users' | 'vouchers' | 'reviews' | 'database' | 'settings'
  >('overview');
  const [foodSearch, setFoodSearch] = useState('');
  const [foodCategoryFilter, setFoodCategoryFilter] = useState('all');

  // Operations & Settings States
  const [announcementInput, setAnnouncementInput] = useState<string>(() => {
    return (
      localStorage.getItem('eatnow_announcement') ||
      '🎉 Chào mừng đến với Căn tin EatNow! Đặt trước nhận ngay — Giảm 10% cho đơn hàng đầu tiên qua Ví CanteenGo | Thực đơn trưa phục vụ từ 10:30 đến 13:30 mỗi ngày | Chúc bạn một bữa ăn ngon miệng! 🍱🥤'
    );
  });
  const [isCanteenOpen, setIsCanteenOpen] = useState<boolean>(() => {
    return localStorage.getItem('eatnow_canteen_open') !== 'false';
  });
  const [maxOrdersPerSlot, setMaxOrdersPerSlot] = useState<number>(() => {
    return Number(localStorage.getItem('eatnow_max_slot')) || 45;
  });
  const [canteenHours, setCanteenHours] = useState({ open: '06:30', close: '18:30' });

  // Orders Management States
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrderForAdmin, setSelectedOrderForAdmin] = useState<Order | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [cancelReasonInput, setCancelReasonInput] = useState('');

  // Categories Management States
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    icon: 'Utensils',
    description: '',
  });

  // Users & Wallet Management States
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [targetUserForWallet, setTargetUserForWallet] = useState<{ id: string; name: string; balance: number } | null>(null);
  const [walletAmountInput, setWalletAmountInput] = useState<number>(50000);
  const [walletNoteInput, setWalletNoteInput] = useState('');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [targetUserForRole, setTargetUserForRole] = useState<{ id: string; name: string; role: Role } | null>(null);
  const [selectedRoleInput, setSelectedRoleInput] = useState<Role>('customer');

  // Database Tab States
  const [selectedTable, setSelectedTable] = useState<'users' | 'categories' | 'foods' | 'vouchers' | 'orders' | 'wallet_transactions' | 'reviews'>('foods');
  const [dbSubTab, setDbSubTab] = useState<'data' | 'schema' | 'queries' | 'raw_sql'>('data');
  const [copiedSql, setCopiedSql] = useState(false);

  // Voucher Form States
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [voucherForm, setVoucherForm] = useState<{
    code: string;
    title: string;
    description: string;
    discountType: 'fixed' | 'percent';
    discountValue: number;
    minOrderValue: number;
    maxDiscount?: number;
  }>({
    code: '',
    title: '',
    description: '',
    discountType: 'fixed',
    discountValue: 10000,
    minOrderValue: 35000,
  });

  // Food Form Modal (Add / Edit)
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    categoryId: categories[0]?.id || 'mon-man',
    price: 35000,
    originalPrice: 40000,
    image: '',
    description: '',
    stockQuantity: 20,
    prepTimeMinutes: 10,
    calories: 500,
    protein: 25,
    carbs: 60,
    fat: 15,
    fiber: 3.5,
    sodiumMg: 750,
    allergens: '',
    dietaryTags: '',
    tags: 'Món mới, Thơm ngon',
    isAvailable: true,
  });

  // Calculate Overview Metrics (US28, US29, US30)
  const completedOrders = orders.filter((o) => o.status === 'completed');
  const activeOrders = orders.filter(
    (o) =>
      o.status === 'paid_pending_confirm' ||
      o.status === 'preparing' ||
      o.status === 'ready'
  );
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Calculate best-selling dishes (US30)
  const itemCounts: Record<string, { name: string; count: number; revenue: number; image: string }> = {};
  orders.forEach((o) => {
    if (o.status !== 'cancelled') {
      o.items.forEach((item) => {
        if (!itemCounts[item.foodId]) {
          itemCounts[item.foodId] = {
            name: item.name,
            count: 0,
            revenue: 0,
            image: item.image,
          };
        }
        itemCounts[item.foodId].count += item.quantity;
        itemCounts[item.foodId].revenue += item.price * item.quantity;
      });
    }
  });

  const bestSellers = Object.entries(itemCounts)
    .map(([id, val]) => ({ id, ...val }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  const handleOpenAdd = () => {
    setEditingFood(null);
    setFormData({
      name: '',
      categoryId: categories[0]?.id || 'mon-man',
      price: 35000,
      originalPrice: 40000,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      description: 'Món ăn mới chuẩn vị, tươi ngon mỗi ngày phục vụ sinh viên và giảng viên.',
      stockQuantity: 30,
      prepTimeMinutes: 10,
      calories: 520,
      protein: 26,
      carbs: 65,
      fat: 16,
      fiber: 3.5,
      sodiumMg: 750,
      allergens: '',
      dietaryTags: 'Nóng hổi, Giàu năng lượng',
      tags: 'Món mới, Nóng hổi',
      isAvailable: true,
    });
    setIsFoodModalOpen(true);
  };

  const handleOpenEdit = (food: FoodItem) => {
    setEditingFood(food);
    const n = food.nutrition;
    setFormData({
      name: food.name,
      categoryId: food.categoryId,
      price: food.price,
      originalPrice: food.originalPrice || food.price,
      image: food.image,
      description: food.description,
      stockQuantity: food.stockQuantity,
      prepTimeMinutes: food.prepTimeMinutes,
      calories: food.calories || n?.calories || 450,
      protein: n?.protein || 24,
      carbs: n?.carbs || 60,
      fat: n?.fat || 15,
      fiber: n?.fiber || 3,
      sodiumMg: n?.sodiumMg || 700,
      allergens: food.allergens ? food.allergens.join(', ') : '',
      dietaryTags: food.dietaryTags ? food.dietaryTags.join(', ') : '',
      tags: food.tags.join(', '),
      isAvailable: food.isAvailable,
    });
    setIsFoodModalOpen(true);
  };

  const handleSaveFood = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === formData.categoryId);
    const parsedTags = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const parsedAllergens = formData.allergens
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);
    const parsedDietary = formData.dietaryTags
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);

    const nutritionData = {
      calories: Number(formData.calories),
      protein: Number(formData.protein),
      carbs: Number(formData.carbs),
      fat: Number(formData.fat),
      fiber: Number(formData.fiber),
      sodiumMg: Number(formData.sodiumMg),
    };

    if (editingFood) {
      adminUpdateFood(editingFood.id, {
        name: formData.name,
        categoryId: formData.categoryId,
        categoryName: cat ? cat.name : 'Khác',
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        image: formData.image || editingFood.image,
        description: formData.description,
        stockQuantity: Number(formData.stockQuantity),
        prepTimeMinutes: Number(formData.prepTimeMinutes),
        calories: Number(formData.calories),
        nutrition: nutritionData,
        allergens: parsedAllergens,
        dietaryTags: parsedDietary,
        tags: parsedTags,
        isAvailable: formData.isAvailable,
      });
    } else {
      adminAddFood({
        name: formData.name,
        categoryId: formData.categoryId,
        categoryName: cat ? cat.name : 'Món mặn',
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        image:
          formData.image ||
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        description: formData.description,
        stockQuantity: Number(formData.stockQuantity),
        prepTimeMinutes: Number(formData.prepTimeMinutes),
        calories: Number(formData.calories),
        nutrition: nutritionData,
        allergens: parsedAllergens,
        dietaryTags: parsedDietary,
        tags: parsedTags,
        isAvailable: formData.isAvailable,
      });
    }
    setIsFoodModalOpen(false);
  };

  // Filter foods in admin table
  const filteredFoods = foods.filter((f) => {
    if (foodCategoryFilter !== 'all' && f.categoryId !== foodCategoryFilter) {
      return false;
    }
    if (foodSearch.trim()) {
      const q = foodSearch.toLowerCase();
      return f.name.toLowerCase().includes(q) || f.categoryName.toLowerCase().includes(q);
    }
    return true;
  });

  // Filter orders in admin table
  const filteredOrders = orders.filter((o) => {
    const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const term = orderSearch.trim().toLowerCase();
    const matchSearch =
      !term ||
      o.orderCode.toLowerCase().includes(term) ||
      o.userName.toLowerCase().includes(term) ||
      o.userPhone.includes(term) ||
      (o.userClass && o.userClass.toLowerCase().includes(term)) ||
      o.items.some((it) => it.name.toLowerCase().includes(term));
    return matchStatus && matchSearch;
  });

  // Filter users in admin table
  const filteredUsers = users.filter((u) => {
    const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const term = userSearch.trim().toLowerCase();
    const matchSearch =
      !term ||
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.phone.includes(term) ||
      (u.mssv && u.mssv.toLowerCase().includes(term)) ||
      (u.className && u.className.toLowerCase().includes(term)) ||
      (u.department && u.department.toLowerCase().includes(term));
    return matchRole && matchSearch;
  });

  // Category Form Handlers
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      slug: '',
      icon: 'Utensils',
      description: '',
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || 'Utensils',
      description: cat.description || '',
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      showToast('Vui lòng nhập tên danh mục!', 'error');
      return;
    }
    const slug = categoryForm.slug.trim() || categoryForm.name.toLowerCase().replace(/\s+/g, '-');
    if (editingCategory) {
      adminUpdateCategory(editingCategory.id, {
        name: categoryForm.name.trim(),
        slug,
        icon: categoryForm.icon,
        description: categoryForm.description.trim(),
      });
    } else {
      adminAddCategory({
        name: categoryForm.name.trim(),
        slug,
        icon: categoryForm.icon,
        description: categoryForm.description.trim(),
      });
    }
    setIsCategoryModalOpen(false);
  };

  // Order Cancel & Refund Handler
  const handleConfirmCancelOrder = () => {
    if (!orderToCancel) return;
    const reason = cancelReasonInput.trim() || 'Admin căn tin hủy đơn & hoàn tiền vào Ví CanteenGo';
    cancelOrder(orderToCancel.id, reason);
    setIsCancelModalOpen(false);
    setOrderToCancel(null);
    setCancelReasonInput('');
  };

  // Wallet Adjustment Handler
  const handleSaveWalletAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserForWallet) return;
    if (walletAmountInput <= 0) {
      showToast('Số tiền điều chỉnh phải lớn hơn 0!', 'error');
      return;
    }
    adminAdjustUserWallet(
      targetUserForWallet.id,
      walletAmountInput,
      walletNoteInput || 'Admin nạp ví trực tiếp'
    );
    setIsWalletModalOpen(false);
    setTargetUserForWallet(null);
    setWalletNoteInput('');
  };

  // Role Change Handler
  const handleSaveRoleChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserForRole) return;
    adminUpdateUserRole(targetUserForRole.id, selectedRoleInput);
    setIsRoleModalOpen(false);
    setTargetUserForRole(null);
  };

  // Operations: Save Marquee Announcement
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementInput.trim()) {
      showToast('Nội dung thông báo không được để trống!', 'error');
      return;
    }
    localStorage.setItem('eatnow_announcement', announcementInput.trim());
    window.dispatchEvent(new Event('eatnow_announcement_updated'));
    showToast('Đã cập nhật thông báo toàn hệ thống thành công!', 'success');
  };

  // Operations: Toggle Canteen Status
  const handleToggleCanteenOpen = () => {
    const nextState = !isCanteenOpen;
    setIsCanteenOpen(nextState);
    localStorage.setItem('eatnow_canteen_open', String(nextState));
    showToast(
      nextState
        ? 'Căn tin đã MỞ CỬA nhận đơn bình thường!'
        : 'Căn tin đã TẠM DỪNG nhận đơn (Thông báo bếp quá tải)',
      nextState ? 'success' : 'info'
    );
  };

  // Operations: Save Capacity
  const handleSaveCapacity = () => {
    localStorage.setItem('eatnow_max_slot', String(maxOrdersPerSlot));
    showToast(`Đã lưu công suất bếp: tối đa ${maxOrdersPerSlot} suất / 15 phút`, 'success');
  };

  // Export: Orders to CSV / Excel
  const exportOrdersToCSV = () => {
    try {
      const headers = [
        'Mã Đơn Hàng',
        'Khách Hàng',
        'Mã SV / ID',
        'Số Điện Thoại',
        'Danh Sách Món',
        'Khung Giờ Hẹn Lấy',
        'Hình Thức Ăn',
        'Vị Trí / Bàn',
        'Voucher',
        'Tổng Tiền (VNĐ)',
        'Trạng Thái Đơn',
        'Thời Gian Đặt',
      ];

      const rows = orders.map((o) => [
        o.orderCode,
        `"${o.userName.replace(/"/g, '""')}"`,
        o.userId,
        o.userPhone,
        `"${o.items.map((i) => `${i.name} (SL: ${i.quantity})`).join('; ')}"`,
        o.pickupTimeSlot,
        o.diningOption === 'dine_in' ? 'Ăn tại chỗ' : 'Mang về',
        o.tableNumber || 'N/A',
        o.voucherCode || 'Không có',
        o.totalAmount,
        o.status,
        `"${new Date(o.createdAt).toLocaleString('vi-VN')}"`,
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `EatNow_BaoCao_DonHang_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Đã xuất file Excel/CSV Đơn hàng thành công!', 'success');
    } catch {
      showToast('Không thể xuất file CSV!', 'error');
    }
  };

  // Export: Users & Wallet Balances to CSV
  const exportUsersToCSV = () => {
    try {
      const headers = [
        'Mã Người Dùng',
        'Họ Và Tên',
        'MSSV / Mã Cán Bộ',
        'Email',
        'Số Điện Thoại',
        'Vai Trò',
        'Số Dư Ví CanteenGo (VNĐ)',
        'Lớp / Khoa',
      ];

      const rows = users.map((u) => [
        u.id,
        `"${u.name.replace(/"/g, '""')}"`,
        u.mssv || 'N/A',
        u.email,
        u.phone,
        u.role,
        u.walletBalance,
        `"${(u.department || u.className || '').replace(/"/g, '""')}"`,
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `EatNow_BaoCao_NguoiDung_Vi_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Đã xuất file Excel/CSV Tài khoản & Ví thành công!', 'success');
    } catch {
      showToast('Không thể xuất file CSV người dùng!', 'error');
    }
  };

  // Operations: Create Instant Mock Order for testing Kitchen & Admin
  const handleCreateMockOrder = () => {
    const student = users.find((u) => u.role === 'customer') || users[0];
    const availableFoods = foods.filter((f) => f.isAvailable && f.stockQuantity > 0);
    const selectedDish = availableFoods[Math.floor(Math.random() * availableFoods.length)] || foods[0];
    const drinks = foods.filter((f) => f.categoryId === 'do-uong') || [];
    const selectedDrink = drinks[0] || foods[1];

    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    const mockOrder: Order = {
      id: `ord-mock-${Date.now()}`,
      orderCode: `EN-${orderNumber}`,
      userId: student.id,
      userName: student.name,
      userPhone: student.phone,
      userClass: student.className || 'K21-CNTT01',
      items: [
        {
          foodId: selectedDish.id,
          name: selectedDish.name,
          price: selectedDish.price,
          quantity: 1,
          image: selectedDish.image,
          note: 'Làm nóng giúp em, ít cay',
        },
        {
          foodId: selectedDrink.id,
          name: selectedDrink.name,
          price: selectedDrink.price,
          quantity: 1,
          image: selectedDrink.image,
          note: 'Ít đá, 50% đường',
        },
      ],
      totalAmount: selectedDish.price + selectedDrink.price,
      discountAmount: 0,
      paymentMethod: 'wallet',
      paymentStatus: 'paid',
      status: 'paid_pending_confirm',
      pickupTimeSlot: '11:45 - 12:00',
      diningOption: 'takeaway',
      createdAt: new Date().toISOString(),
    };

    // Add to orders in state via localStorage & context
    const currentOrders = JSON.parse(localStorage.getItem('eatnow_orders') || '[]');
    const nextOrders = [mockOrder, ...currentOrders];
    localStorage.setItem('eatnow_orders', JSON.stringify(nextOrders));
    window.location.reload();
  };

  // Operations: Top up +100k to all demo accounts
  const handleTopupAllWallets = () => {
    users.forEach((u) => {
      adminAdjustUserWallet(u.id, 100000, 'Admin tặng 100k hỗ trợ ăn trưa sinh viên');
    });
    showToast('Đã nạp thành công 100.000₫ vào ví của toàn bộ người dùng!', 'success');
  };

  // Operations: Reset demo database
  const handleResetDemoData = () => {
    if (window.confirm('Bạn có chắc chắn muốn đặt lại toàn bộ dữ liệu mẫu về mặc định?')) {
      localStorage.removeItem('eatnow_foods_v7');
      localStorage.removeItem('eatnow_categories_v2');
      localStorage.removeItem('eatnow_orders');
      localStorage.removeItem('eatnow_users_v6');
      localStorage.removeItem('eatnow_vouchers');
      localStorage.removeItem('eatnow_reviews_v6');
      localStorage.removeItem('eatnow_transactions');
      localStorage.removeItem('eatnow_announcement');
      localStorage.removeItem('eatnow_canteen_open');
      showToast('Đang khôi phục dữ liệu gốc...', 'info');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const getOrderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending_payment':
        return {
          label: 'Chờ thanh toán',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-400',
        };
      case 'paid_pending_confirm':
        return {
          label: 'Chờ xác nhận',
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          dot: 'bg-blue-500 animate-pulse',
        };
      case 'preparing':
        return {
          label: 'Đang nấu',
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          dot: 'bg-amber-500',
        };
      case 'ready':
        return {
          label: 'Sẵn sàng lấy',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
        };
      case 'completed':
        return {
          label: 'Đã hoàn tất',
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
        };
      case 'cancelled':
        return {
          label: 'Đã hủy & hoàn ví',
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
        };
      default:
        return {
          label: status,
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
            <BarChart3 className="w-4 h-4" />
            <span>Trung Tâm Quản Trị & Báo Cáo EatNow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            Quản trị căn tin & Phân tích kinh doanh
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Quản lý toàn bộ danh mục thực đơn, số lượng tồn kho đầu ngày, giám sát doanh thu và phản hồi từ sinh viên.
          </p>
          <div className="mt-2 text-xs text-amber-300 font-medium">
            Quản trị viên phụ trách: <strong>Ngô Thị Hồng Thu (MSSV: 2374820182)</strong> · Bộ phận: <strong>Ban Quản Trị Hệ Thống Căn Tin EatNow</strong>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <a
            href="https://github.com/cheesy6918/EatNow"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
            title="Kho mã nguồn dự án trên GitHub (cheesy6918/EatNow)"
          >
            <GitBranch className="w-4 h-4 text-amber-400" />
            <span>GitHub (cheesy6918/EatNow)</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm món ăn mới</span>
          </button>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Báo cáo & Tổng quan</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-amber-400" />
          <span>Quản lý đơn hàng ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'menu'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Utensils className="w-4 h-4 text-amber-500" />
          <span>Quản lý thực đơn ({foods.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4 text-blue-500" />
          <span>Danh mục ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-500" />
          <span>Tài khoản & Ví ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('vouchers')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'vouchers'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Tag className="w-4 h-4 text-rose-500" />
          <span>Mã giảm giá ({vouchers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'reviews'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Đánh giá ({reviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'database'
              ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold'
              : 'text-slate-700 hover:bg-slate-100 bg-amber-50/70 border border-amber-200'
          }`}
        >
          <Database className="w-4 h-4 text-amber-700" />
          <span>CSDL MySQL & Xuất .SQL</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-orange-600 text-white shadow-xs font-extrabold'
              : 'text-orange-800 hover:bg-orange-100/70 bg-orange-50 border border-orange-200 font-bold'
          }`}
        >
          <Sliders className="w-4 h-4 text-orange-600" />
          <span>Vận hành & Cài đặt</span>
        </button>
      </div>

      {/* Tab 1: Overview & Analytics (US28, US29, US30) */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Tổng doanh thu qua ví
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold font-mono-nums text-slate-900">
                {totalRevenue.toLocaleString('vi-VN')}₫
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                +18.5% so với tuần trước
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Đơn hàng thành công
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold font-mono-nums text-slate-900">
                {completedOrders.length} đơn
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {activeOrders.length} đơn đang xử lý
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Món ăn đang phục vụ
                </span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Utensils className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold font-mono-nums text-slate-900">
                {foods.filter((f) => f.isAvailable).length} / {foods.length} món
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Phân bổ trong 4 danh mục
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Mức độ hài lòng
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
              </div>
              <div className="text-2xl font-extrabold font-mono-nums text-slate-900 flex items-baseline gap-1">
                <span>{averageRating}</span>
                <span className="text-sm text-slate-400 font-normal">/ 5.0</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Từ {reviews.length} đánh giá
              </span>
            </div>
          </div>

          {/* Best Sellers Leaderboard & Hourly distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top bán chạy (US30) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Món bán chạy nhất (Top Best Sellers)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Thống kê số lượng suất đã bán để điều chỉnh lượng chuẩn bị bếp
                  </p>
                </div>
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>

              <div className="space-y-3">
                {bestSellers.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-extrabold flex items-center justify-center font-mono-nums">
                        {idx + 1}
                      </span>
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';
                        }}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 block truncate">
                          {item.name}
                        </span>
                        <span className="text-slate-500 font-mono-nums">
                          Doanh thu: {item.revenue.toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-extrabold font-mono-nums text-slate-900 text-sm block">
                        {item.count}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase">
                        suất đã bán
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time slot distribution */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Phân bố giờ cao điểm căn tin
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Số lượng đơn hẹn lấy theo khung giờ hôm nay
                  </p>
                </div>
                <Package className="w-5 h-5 text-amber-600" />
              </div>

              <div className="space-y-2 pt-2">
                {[
                  { slot: '11:00 - 11:15', percent: 25, count: 8 },
                  { slot: '11:15 - 11:30', percent: 65, count: 24 },
                  { slot: '11:30 - 11:45', percent: 90, count: 35 },
                  { slot: '11:45 - 12:00', percent: 75, count: 28 },
                  { slot: '12:00 - 12:15', percent: 45, count: 16 },
                ].map((item) => (
                  <div key={item.slot} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-700">{item.slot}</span>
                      <span className="font-mono-nums text-slate-900">
                        {item.count} đơn hẹn
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>Khung giờ đông nhất: <strong>11:30 - 11:45</strong></span>
                <span className="text-emerald-700 font-semibold">Năng lực bếp: 45 suất/15p</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Orders Management (Admin Master Order Control) */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-6 animate-in fade-in duration-200">
          {/* Header & Stats */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Quản lý đơn hàng căn tin thời gian thực
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Theo dõi toàn bộ đơn đặt trước của sinh viên & giảng viên, duyệt đơn, bàn giao và hỗ trợ hủy hoàn tiền tự động vào ví CanteenGo.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-bold">
                {orders.length} tổng số đơn
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                {orders.filter((o) => o.status === 'completed').length} hoàn tất
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Chờ bếp nhận & nấu</span>
              <span className="text-lg font-bold font-mono-nums text-blue-700">
                {orders.filter((o) => o.status === 'paid_pending_confirm' || o.status === 'preparing').length} đơn
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Đã sẵn sàng tại quầy</span>
              <span className="text-lg font-bold font-mono-nums text-emerald-700">
                {orders.filter((o) => o.status === 'ready').length} đơn
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Doanh thu đã thu về</span>
              <span className="text-lg font-bold font-mono-nums text-slate-900">
                {orders
                  .filter((o) => o.status === 'completed')
                  .reduce((sum, o) => sum + o.totalAmount, 0)
                  .toLocaleString('vi-VN')}₫
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Đã hủy hoàn ví 100%</span>
              <span className="text-lg font-bold font-mono-nums text-rose-600">
                {orders.filter((o) => o.status === 'cancelled').length} đơn
              </span>
            </div>
          </div>

          {/* Search and Status Filter */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {[
                { id: 'all', label: 'Tất cả', count: orders.length },
                {
                  id: 'paid_pending_confirm',
                  label: 'Chờ xác nhận',
                  count: orders.filter((o) => o.status === 'paid_pending_confirm').length,
                },
                {
                  id: 'preparing',
                  label: 'Đang nấu',
                  count: orders.filter((o) => o.status === 'preparing').length,
                },
                {
                  id: 'ready',
                  label: 'Sẵn sàng',
                  count: orders.filter((o) => o.status === 'ready').length,
                },
                {
                  id: 'completed',
                  label: 'Hoàn tất',
                  count: orders.filter((o) => o.status === 'completed').length,
                },
                {
                  id: 'cancelled',
                  label: 'Đã hủy',
                  count: orders.filter((o) => o.status === 'cancelled').length,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setOrderStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                    orderStatusFilter === tab.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                      orderStatusFilter === tab.id
                        ? 'bg-slate-800 text-amber-400'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Tìm mã đơn, tên SV, SĐT..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Mã đơn & Giờ đặt</th>
                  <th className="p-3.5">Khách hàng</th>
                  <th className="p-3.5">Khung giờ nhận</th>
                  <th className="p-3.5">Món ăn đã đặt</th>
                  <th className="p-3.5 font-mono-nums">Tổng tiền</th>
                  <th className="p-3.5">Trạng thái</th>
                  <th className="p-3.5 text-right">Thao tác Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      Không tìm thấy đơn hàng nào phù hợp với bộ lọc hiện tại.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => {
                    const badge = getOrderStatusBadge(ord.status);
                    return (
                      <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Order Code & Date */}
                        <td className="p-3.5">
                          <button
                            onClick={() => setSelectedOrderForAdmin(ord)}
                            className="font-bold font-mono text-amber-700 hover:text-amber-800 hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <span>#{ord.orderCode}</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {new Date(ord.createdAt).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            · {new Date(ord.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                        </td>

                        {/* Customer Info */}
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{ord.userName}</div>
                          <div className="text-[11px] text-slate-500 font-mono-nums">{ord.userPhone}</div>
                          {ord.userClass && (
                            <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                              {ord.userClass}
                            </div>
                          )}
                        </td>

                        {/* Pickup Slot & Dining */}
                        <td className="p-3.5">
                          <div className="font-semibold text-slate-800 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                            <span>{ord.pickupTimeSlot}</span>
                          </div>
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                            {ord.diningOption === 'dine_in'
                              ? `Ăn tại chỗ ${ord.tableNumber ? `(Bàn ${ord.tableNumber})` : ''}`
                              : 'Mang về (Hộp giấy)'}
                          </span>
                        </td>

                        {/* Items Preview */}
                        <td className="p-3.5">
                          <div className="space-y-0.5 max-w-[200px]">
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="text-slate-700 truncate text-[11px]">
                                <span className="font-bold font-mono-nums">{it.quantity}x</span>{' '}
                                <span>{it.name}</span>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Total Amount & Payment */}
                        <td className="p-3.5">
                          <div className="font-bold font-mono-nums text-slate-900">
                            {ord.totalAmount.toLocaleString('vi-VN')}₫
                          </div>
                          <span
                            className={`inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                              ord.paymentStatus === 'refunded'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {ord.paymentStatus === 'refunded' ? 'Đã hoàn tiền' : 'Ví CanteenGo'}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="p-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${badge.bg}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                            <span>{badge.label}</span>
                          </span>
                          {ord.cancelReason && (
                            <p className="text-[10px] text-rose-600 italic mt-1 max-w-[130px] truncate" title={ord.cancelReason}>
                              Lý do: {ord.cancelReason}
                            </p>
                          )}
                        </td>

                        {/* Admin Action Buttons */}
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Step Status Buttons */}
                            {ord.status === 'paid_pending_confirm' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'preparing')}
                                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-2xs transition-colors cursor-pointer"
                                title="Chuyển sang chế biến trong bếp"
                              >
                                Bếp nấu
                              </button>
                            )}

                            {ord.status === 'preparing' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'ready')}
                                className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] shadow-2xs transition-colors cursor-pointer"
                                title="Đã nấu xong, gọi sinh viên đến lấy"
                              >
                                Đã xong
                              </button>
                            )}

                            {ord.status === 'ready' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'completed')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs transition-colors cursor-pointer"
                                title="Sinh viên đã nhận món thành công"
                              >
                                Hoàn tất
                              </button>
                            )}

                            {/* View Details */}
                            <button
                              onClick={() => setSelectedOrderForAdmin(ord)}
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                              title="Xem chi tiết đơn"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Cancel / Refund Button (Available for incomplete orders) */}
                            {ord.status !== 'completed' && ord.status !== 'cancelled' && (
                              <button
                                onClick={() => {
                                  setOrderToCancel(ord);
                                  setCancelReasonInput('Căn tin hết nguyên liệu đột xuất / Khách yêu cầu hủy');
                                  setIsCancelModalOpen(true);
                                }}
                                className="px-2 py-1 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-700 font-bold text-[11px] transition-colors cursor-pointer"
                                title="Hủy đơn và hoàn tiền 100% về Ví CanteenGo"
                              >
                                Hủy & Hoàn ví
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Menu Management (US10, US11) */}
      {activeTab === 'menu' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Danh sách thực đơn căn tin
              </h3>
              <p className="text-xs text-slate-500">
                Thêm món mới, điều chỉnh giá, cập nhật số lượng tồn kho hoặc tạm ẩn khỏi thực đơn
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Tìm món ăn..."
                  value={foodSearch}
                  onChange={(e) => setFoodSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 w-40 sm:w-52"
                />
              </div>

              <select
                value={foodCategoryFilter}
                onChange={(e) => setFoodCategoryFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-xl px-2.5 py-1.5 bg-white text-slate-700"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Món ăn</th>
                  <th className="p-3.5">Danh mục</th>
                  <th className="p-3.5 font-mono-nums">Đơn giá</th>
                  <th className="p-3.5 font-mono-nums">Tồn kho</th>
                  <th className="p-3.5">Trạng thái bán</th>
                  <th className="p-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFoods.map((food) => (
                  <tr key={food.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <img
                          src={food.image}
                          alt={food.name}
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';
                          }}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{food.name}</div>
                          <div className="text-[11px] text-slate-400">
                            {food.prepTimeMinutes} phút · {food.rating}★ ({food.reviewCount})
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap text-slate-600 font-medium">
                      {food.categoryName}
                    </td>

                    <td className="p-3.5 whitespace-nowrap font-bold font-mono-nums text-slate-900">
                      {food.price.toLocaleString('vi-VN')}₫
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span
                        className={`font-bold font-mono-nums px-2 py-0.5 rounded-md ${
                          food.stockQuantity > 0
                            ? 'bg-slate-100 text-slate-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {food.stockQuantity} suất
                      </span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <button
                        onClick={() => adminToggleFoodAvailability(food.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          food.isAvailable && food.stockQuantity > 0
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        {food.isAvailable && food.stockQuantity > 0 ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Đang mở bán</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Tạm ẩn/Hết</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="p-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(food)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                          title="Chỉnh sửa món"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => adminDeleteFood(food.id)}
                          className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors"
                          title="Xóa món"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Categories Management */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Quản lý Danh mục thực đơn ({categories.length})
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Phân loại món ăn theo danh mục giúp sinh viên dễ dàng lọc món (món mặn, món chay, đồ uống, ăn vặt...).
              </p>
            </div>

            <button
              onClick={handleOpenAddCategory}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Thêm danh mục mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const dishCount = foods.filter((f) => f.categoryId === cat.id).length;
              return (
                <div
                  key={cat.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-mono">
                        {cat.slug}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        {dishCount} món ăn
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{cat.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {cat.description || 'Chưa có mô tả cho danh mục này.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-end gap-2 text-xs">
                    <button
                      onClick={() => handleOpenEditCategory(cat)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Sửa</span>
                    </button>
                    <button
                      onClick={() => {
                        if (dishCount > 0) {
                          showToast(`Không thể xóa danh mục "${cat.name}" vì đang có ${dishCount} món ăn thuộc danh mục này!`, 'error');
                          return;
                        }
                        adminDeleteCategory(cat.id);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Reviews (US32) */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4 animate-in fade-in duration-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Phản hồi & Đánh giá từ sinh viên
            </h3>
            <p className="text-xs text-slate-500">
              Ý kiến trực tiếp từ thực khách sau khi nhận món để cải thiện chất lượng phục vụ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{rev.foodName}</span>
                  <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{rev.rating}</span>
                  </div>
                </div>
                <p className="text-slate-700 italic bg-white p-3 rounded-xl border border-slate-100">
                  "{rev.comment}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Người đánh giá: <strong>{rev.userName}</strong></span>
                  <span>{new Date(rev.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Users & Wallets Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-6 animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Quản lý tài khoản & Số dư Ví CanteenGo
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Quản lý quyền hạn (Sinh viên, Giảng viên, Bếp, Admin), nạp tiền thủ công vào ví sinh viên và đặt lại mật khẩu.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold">
                {users.length} tài khoản
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold font-mono-nums">
                Tổng ví: {users.reduce((s, u) => s + (u.walletBalance || 0), 0).toLocaleString('vi-VN')}₫
              </span>
            </div>
          </div>

          {/* Search & Role Filter Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {[
                { id: 'all', label: 'Tất cả', count: users.length },
                { id: 'customer', label: 'Sinh viên', count: users.filter((u) => u.role === 'customer').length },
                { id: 'lecturer', label: 'Giảng viên', count: users.filter((u) => u.role === 'lecturer').length },
                { id: 'staff', label: 'Bếp Căn tin', count: users.filter((u) => u.role === 'staff').length },
                { id: 'admin', label: 'Quản trị viên', count: users.filter((u) => u.role === 'admin').length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setUserRoleFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                    userRoleFilter === tab.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                      userRoleFilter === tab.id
                        ? 'bg-slate-800 text-amber-400'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Tìm tên, email, MSSV, SĐT..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Họ và tên & MSSV</th>
                  <th className="p-3.5">Lớp / Khoa phòng</th>
                  <th className="p-3.5">Email & SĐT</th>
                  <th className="p-3.5">Vai trò</th>
                  <th className="p-3.5 font-mono-nums">Số dư Ví CanteenGo</th>
                  <th className="p-3.5 text-right">Thao tác Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      Không tìm thấy tài khoản nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{u.name}</div>
                        {u.mssv && (
                          <div className="text-[11px] text-amber-700 font-mono font-semibold">
                            MSSV: {u.mssv}
                          </div>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-700 font-medium">
                        {u.department || u.className || '—'}
                      </td>
                      <td className="p-3.5">
                        <div className="text-slate-600 font-mono text-[11px]">{u.email}</div>
                        <div className="text-slate-500 font-mono-nums text-[11px]">{u.phone}</div>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            u.role === 'customer'
                              ? 'bg-amber-100 text-amber-800'
                              : u.role === 'lecturer'
                              ? 'bg-emerald-100 text-emerald-800'
                              : u.role === 'staff'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {u.role === 'customer'
                            ? 'Sinh viên'
                            : u.role === 'lecturer'
                            ? 'Giảng viên'
                            : u.role === 'staff'
                            ? 'Nhân viên Bếp'
                            : 'Quản trị viên'}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold font-mono-nums text-slate-900 text-sm">
                        {u.walletBalance.toLocaleString('vi-VN')}₫
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Top-up Wallet Button */}
                          <button
                            onClick={() => {
                              setTargetUserForWallet({
                                id: u.id,
                                name: u.name,
                                balance: u.walletBalance,
                              });
                              setWalletAmountInput(50000);
                              setWalletNoteInput('Admin nạp tiền hỗ trợ sinh viên');
                              setIsWalletModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                            title="Nạp tiền vào ví cho tài khoản này"
                          >
                            <Wallet className="w-3 h-3" />
                            <span>Nạp ví</span>
                          </button>

                          {/* Change Role Button */}
                          <button
                            onClick={() => {
                              setTargetUserForRole({ id: u.id, name: u.name, role: u.role });
                              setSelectedRoleInput(u.role);
                              setIsRoleModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-[11px] transition-colors cursor-pointer"
                            title="Thay đổi vai trò hệ thống"
                          >
                            Đổi quyền
                          </button>

                          {/* Reset Password */}
                          <button
                            onClick={() => {
                              if (confirm(`Đặt lại mật khẩu cho "${u.name}" về 123456?`)) {
                                adminResetUserPassword(u.id);
                              }
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                            title="Reset mật khẩu về mặc định 123456"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          {/* Switch User Test */}
                          <button
                            onClick={() => switchUser(u.id)}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
                            title="Đăng nhập và chuyển giao diện sang tài khoản này"
                          >
                            Chuyển ngay
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Vouchers Management */}
      {activeTab === 'vouchers' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-600" />
                <span>Chương trình Khuyến mãi & Voucher sinh viên</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Quản lý các mã giảm giá áp dụng trực tiếp khi sinh viên thanh toán qua Ví CanteenGo
              </p>
            </div>

            <button
              onClick={() => setIsVoucherModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Tạo mã ưu đãi mới</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Mã Voucher</th>
                  <th className="py-3 px-4">Tên chương trình</th>
                  <th className="py-3 px-4">Mức giảm</th>
                  <th className="py-3 px-4">Đơn tối thiểu</th>
                  <th className="py-3 px-4">Giảm tối đa</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vouchers.map((v) => (
                  <tr key={v.code} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-300/50">
                        {v.code}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{v.title}</div>
                      <div className="text-[11px] text-slate-500">{v.description}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold font-mono-nums text-emerald-600">
                        {v.discountType === 'percent'
                          ? `Giảm ${v.discountValue}%`
                          : `Giảm ${v.discountValue.toLocaleString('vi-VN')}₫`}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono-nums text-slate-700">
                      {v.minOrderValue.toLocaleString('vi-VN')}₫
                    </td>
                    <td className="py-3 px-4 font-mono-nums text-slate-500">
                      {v.maxDiscount ? `${v.maxDiscount.toLocaleString('vi-VN')}₫` : 'Không giới hạn'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => adminDeleteVoucher(v.code)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Xóa mã giảm giá"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: MySQL Database Studio & SQL Export */}
      {activeTab === 'database' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-lg space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                  <Database className="w-4 h-4" />
                  <span>CSDL Quan Hệ MySQL · Đồ Án Căn Tin EatNow</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">
                  Quản lý CSDL & Trình xuất tệp SQL (.sql)
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  Hệ thống thiết kế theo chuẩn CSDL quan hệ với 7 bảng (Users, Categories, Foods, Orders, Order_Items, Transactions, Reviews). Khóa chính (PK), Khóa ngoại (FK) và dữ liệu thực tế sẵn sàng import vào phpMyAdmin / MySQL Workbench.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                <button
                  onClick={() => {
                    const script = generateMySQLScript({
                      users,
                      categories,
                      foods,
                      orders,
                      transactions,
                      vouchers,
                      reviews,
                    });
                    navigator.clipboard.writeText(script);
                    setCopiedSql(true);
                    showToast('Đã sao chép toàn bộ mã nguồn SQL vào Clipboard!', 'success');
                    setTimeout(() => setCopiedSql(false), 2000);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all active:scale-95"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Đã sao chép SQL</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-amber-400" />
                      <span>Sao chép SQL</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    const script = generateMySQLScript({
                      users,
                      categories,
                      foods,
                      orders,
                      transactions,
                      vouchers,
                      reviews,
                    });
                    const blob = new Blob([script], { type: 'text/sql;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'EatNow_MySQL_Database.sql';
                    a.click();
                    URL.revokeObjectURL(url);
                    showToast('Đã tải xuống file EatNow_MySQL_Database.sql!', 'success');
                  }}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-md transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải file EatNow_MySQL.sql</span>
                </button>
              </div>
            </div>

            {/* Sub-Tabs */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 overflow-x-auto text-xs">
              <button
                onClick={() => setDbSubTab('data')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
                  dbSubTab === 'data' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Xem dữ liệu các bảng</span>
              </button>
              <button
                onClick={() => setDbSubTab('schema')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
                  dbSubTab === 'schema' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Cấu trúc lược đồ (Schema & Keys)</span>
              </button>
              <button
                onClick={() => setDbSubTab('queries')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
                  dbSubTab === 'queries' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Truy vấn báo cáo mẫu (Queries)</span>
              </button>
              <button
                onClick={() => setDbSubTab('raw_sql')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
                  dbSubTab === 'raw_sql' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>Mã SQL hoàn chỉnh (.sql)</span>
              </button>
            </div>
          </div>

          {/* Subtab 1: Data Viewer */}
          {dbSubTab === 'data' && (
            <div className="space-y-4">
              {/* Select Table Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'foods', label: 'foods', count: foods.length },
                  { id: 'orders', label: 'orders', count: orders.length },
                  { id: 'users', label: 'users', count: users.length },
                  { id: 'categories', label: 'categories', count: categories.length },
                  { id: 'vouchers', label: 'vouchers', count: vouchers.length },
                  { id: 'wallet_transactions', label: 'wallet_transactions', count: transactions.length },
                  { id: 'reviews', label: 'reviews', count: reviews.length },
                ].map((tbl) => (
                  <button
                    key={tbl.id}
                    onClick={() => setSelectedTable(tbl.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 border ${
                      selectedTable === tbl.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="font-mono">{tbl.label}</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                      {tbl.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Data Table Container */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-xs max-h-[500px]">
                {selectedTable === 'foods' && (
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">id (PK)</th>
                        <th className="py-2.5 px-3">category_id (FK)</th>
                        <th className="py-2.5 px-3">name</th>
                        <th className="py-2.5 px-3">price</th>
                        <th className="py-2.5 px-3">stock_qty</th>
                        <th className="py-2.5 px-3">rating</th>
                        <th className="py-2.5 px-3">calories</th>
                        <th className="py-2.5 px-3">status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {foods.map((f) => (
                        <tr key={f.id} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 text-amber-700 font-bold">{f.id}</td>
                          <td className="py-2 px-3 text-indigo-700">{f.categoryId}</td>
                          <td className="py-2 px-3 font-sans font-medium text-slate-900">{f.name}</td>
                          <td className="py-2 px-3">{f.price.toLocaleString('vi-VN')}₫</td>
                          <td className="py-2 px-3">{f.stockQuantity}</td>
                          <td className="py-2 px-3">⭐ {f.rating}</td>
                          <td className="py-2 px-3">{f.calories || f.nutrition?.calories || '-'} kcal</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] ${f.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                              {f.isAvailable ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {selectedTable === 'orders' && (
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">id (PK)</th>
                        <th className="py-2.5 px-3">order_code</th>
                        <th className="py-2.5 px-3">user_name</th>
                        <th className="py-2.5 px-3">total_amount</th>
                        <th className="py-2.5 px-3">pickup_slot</th>
                        <th className="py-2.5 px-3">dining_option</th>
                        <th className="py-2.5 px-3">status</th>
                        <th className="py-2.5 px-3">created_at</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 text-amber-700 font-bold">{o.id}</td>
                          <td className="py-2 px-3 text-slate-900 font-bold">#{o.orderCode}</td>
                          <td className="py-2 px-3 font-sans font-medium">{o.userName}</td>
                          <td className="py-2 px-3 text-emerald-600 font-bold">{o.totalAmount.toLocaleString('vi-VN')}₫</td>
                          <td className="py-2 px-3">{o.pickupTimeSlot}</td>
                          <td className="py-2 px-3 font-sans">{o.diningOption === 'dine_in' ? 'Ăn tại chỗ' : 'Mang đi'}</td>
                          <td className="py-2 px-3">
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-900 font-bold">
                              {o.status}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-[11px] text-slate-400">{new Date(o.createdAt).toLocaleString('vi-VN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {selectedTable === 'users' && (
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">id (PK)</th>
                        <th className="py-2.5 px-3">name</th>
                        <th className="py-2.5 px-3">mssv</th>
                        <th className="py-2.5 px-3">email</th>
                        <th className="py-2.5 px-3">phone</th>
                        <th className="py-2.5 px-3">role</th>
                        <th className="py-2.5 px-3">wallet_balance</th>
                        <th className="py-2.5 px-3">class_name</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 text-amber-700 font-bold">{u.id}</td>
                          <td className="py-2 px-3 font-sans font-medium">{u.name}</td>
                          <td className="py-2 px-3">{u.mssv || 'NULL'}</td>
                          <td className="py-2 px-3 text-slate-500">{u.email}</td>
                          <td className="py-2 px-3">{u.phone}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.role === 'admin' ? 'bg-purple-100 text-purple-800' : u.role === 'staff' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-amber-600 font-bold">{u.walletBalance.toLocaleString('vi-VN')}₫</td>
                          <td className="py-2 px-3 font-sans text-slate-500">{u.className || u.department || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {selectedTable === 'wallet_transactions' && (
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">id (PK)</th>
                        <th className="py-2.5 px-3">user_id (FK)</th>
                        <th className="py-2.5 px-3">type</th>
                        <th className="py-2.5 px-3">amount</th>
                        <th className="py-2.5 px-3">description</th>
                        <th className="py-2.5 px-3">timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactions.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 text-amber-700 font-bold">{t.id}</td>
                          <td className="py-2 px-3 text-indigo-700">{t.userId}</td>
                          <td className="py-2 px-3 font-bold">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${t.type === 'deposit' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                              {t.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-bold">{t.type === 'deposit' ? '+' : '-'}{t.amount.toLocaleString('vi-VN')}₫</td>
                          <td className="py-2 px-3 font-sans text-slate-700">{t.description}</td>
                          <td className="py-2 px-3 text-[11px] text-slate-400">{new Date(t.timestamp).toLocaleString('vi-VN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {selectedTable === 'categories' && (
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">id (PK)</th>
                        <th className="py-2.5 px-3">name</th>
                        <th className="py-2.5 px-3">slug</th>
                        <th className="py-2.5 px-3">description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {categories.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 text-amber-700 font-bold">{c.id}</td>
                          <td className="py-2 px-3 font-sans font-bold text-slate-900">{c.name}</td>
                          <td className="py-2 px-3 text-slate-500">{c.slug}</td>
                          <td className="py-2 px-3 font-sans text-slate-600">{c.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {selectedTable === 'vouchers' && (
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">code (PK)</th>
                        <th className="py-2.5 px-3">title</th>
                        <th className="py-2.5 px-3">discount_type</th>
                        <th className="py-2.5 px-3">discount_value</th>
                        <th className="py-2.5 px-3">min_order_value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {vouchers.map((v) => (
                        <tr key={v.code} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 text-amber-800 font-bold">{v.code}</td>
                          <td className="py-2 px-3 font-sans font-medium text-slate-900">{v.title}</td>
                          <td className="py-2 px-3">{v.discountType}</td>
                          <td className="py-2 px-3 text-emerald-600 font-bold">{v.discountValue}</td>
                          <td className="py-2 px-3">{v.minOrderValue.toLocaleString('vi-VN')}₫</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {selectedTable === 'reviews' && (
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">id (PK)</th>
                        <th className="py-2.5 px-3">food_id (FK)</th>
                        <th className="py-2.5 px-3">user_name</th>
                        <th className="py-2.5 px-3">rating</th>
                        <th className="py-2.5 px-3">comment</th>
                        <th className="py-2.5 px-3">created_at</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reviews.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 text-amber-700 font-bold">{r.id}</td>
                          <td className="py-2 px-3 text-indigo-700">{r.foodId}</td>
                          <td className="py-2 px-3 font-sans font-medium">{r.userName}</td>
                          <td className="py-2 px-3 text-amber-500 font-bold">⭐ {r.rating}</td>
                          <td className="py-2 px-3 font-sans text-slate-700">{r.comment}</td>
                          <td className="py-2 px-3 text-[11px] text-slate-400">{new Date(r.createdAt).toLocaleString('vi-VN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Subtab 2: Schema definitions */}
          {dbSubTab === 'schema' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 font-mono flex items-center gap-1.5">
                  <Table className="w-4 h-4 text-amber-600" />
                  <span>TABLE: foods</span>
                </h4>
                <div className="space-y-1 font-mono text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div>• <strong>id</strong>: VARCHAR(50) [PK, NOT NULL]</div>
                  <div>• <strong>category_id</strong>: VARCHAR(50) [FK &rarr; categories.id]</div>
                  <div>• <strong>name</strong>: VARCHAR(150) [NOT NULL]</div>
                  <div>• <strong>price</strong>: DECIMAL(12,2) [NOT NULL]</div>
                  <div>• <strong>is_available</strong>: TINYINT(1) [DEFAULT 1]</div>
                  <div>• <strong>stock_quantity</strong>: INT [DEFAULT 0]</div>
                  <div>• <strong>rating</strong>: DECIMAL(3,1) [DEFAULT 5.0]</div>
                  <div>• <strong>calories</strong>: INT NULL</div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 font-mono flex items-center gap-1.5">
                  <Table className="w-4 h-4 text-indigo-600" />
                  <span>TABLE: orders</span>
                </h4>
                <div className="space-y-1 font-mono text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div>• <strong>id</strong>: VARCHAR(50) [PK, NOT NULL]</div>
                  <div>• <strong>order_code</strong>: VARCHAR(20) [UNIQUE]</div>
                  <div>• <strong>user_id</strong>: VARCHAR(50) [FK &rarr; users.id]</div>
                  <div>• <strong>total_amount</strong>: DECIMAL(12,2) [NOT NULL]</div>
                  <div>• <strong>pickup_time_slot</strong>: VARCHAR(50)</div>
                  <div>• <strong>dining_option</strong>: ENUM('dine_in', 'takeaway')</div>
                  <div>• <strong>status</strong>: ENUM(...)</div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 font-mono flex items-center gap-1.5">
                  <Table className="w-4 h-4 text-emerald-600" />
                  <span>TABLE: users</span>
                </h4>
                <div className="space-y-1 font-mono text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div>• <strong>id</strong>: VARCHAR(50) [PK, NOT NULL]</div>
                  <div>• <strong>name</strong>: VARCHAR(100) [NOT NULL]</div>
                  <div>• <strong>mssv</strong>: VARCHAR(20) NULL</div>
                  <div>• <strong>email</strong>: VARCHAR(100) [UNIQUE]</div>
                  <div>• <strong>role</strong>: ENUM('customer', 'staff', 'admin')</div>
                  <div>• <strong>wallet_balance</strong>: DECIMAL(14,2)</div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 font-mono flex items-center gap-1.5">
                  <Table className="w-4 h-4 text-purple-600" />
                  <span>TABLE: wallet_transactions</span>
                </h4>
                <div className="space-y-1 font-mono text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div>• <strong>id</strong>: VARCHAR(50) [PK, NOT NULL]</div>
                  <div>• <strong>user_id</strong>: VARCHAR(50) [FK &rarr; users.id]</div>
                  <div>• <strong>type</strong>: ENUM('deposit', 'payment', 'refund')</div>
                  <div>• <strong>amount</strong>: DECIMAL(12,2) [NOT NULL]</div>
                  <div>• <strong>timestamp</strong>: DATETIME [DEFAULT CURRENT_TIMESTAMP]</div>
                </div>
              </div>
            </div>
          )}

          {/* Subtab 3: Sample Queries for Professor Review */}
          {dbSubTab === 'queries' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">
                    Query 1: Thống kê Doanh thu và Số đơn hàng hoàn tất
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("SELECT COUNT(id) AS total_orders, SUM(total_amount) AS total_revenue FROM orders WHERE status = 'completed';");
                      showToast('Đã sao chép truy vấn 1', 'success');
                    }}
                    className="text-[11px] font-bold text-amber-700 hover:underline"
                  >
                    Sao chép
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-amber-300 rounded-xl font-mono text-xs overflow-x-auto">
{`SELECT 
    COUNT(id) AS total_orders, 
    SUM(total_amount) AS total_revenue_vnd
FROM orders 
WHERE status = 'completed';`}
                </pre>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">
                    Query 2: Thống kê Top 5 món bán chạy nhất bằng JOIN và GROUP BY
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`SELECT oi.food_id, f.name, SUM(oi.quantity) AS qty, SUM(oi.quantity * oi.price) AS revenue FROM order_items oi JOIN foods f ON oi.food_id = f.id JOIN orders o ON oi.order_id = o.id WHERE o.status != 'cancelled' GROUP BY oi.food_id, f.name ORDER BY qty DESC LIMIT 5;`);
                      showToast('Đã sao chép truy vấn 2', 'success');
                    }}
                    className="text-[11px] font-bold text-amber-700 hover:underline"
                  >
                    Sao chép
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-amber-300 rounded-xl font-mono text-xs overflow-x-auto">
{`SELECT 
    oi.food_id, 
    f.name AS food_name, 
    SUM(oi.quantity) AS total_quantity_sold, 
    SUM(oi.quantity * oi.price) AS total_revenue
FROM order_items oi 
JOIN foods f ON oi.food_id = f.id 
JOIN orders o ON oi.order_id = o.id 
WHERE o.status != 'cancelled' 
GROUP BY oi.food_id, f.name 
ORDER BY total_quantity_sold DESC 
LIMIT 5;`}
                </pre>
              </div>
            </div>
          )}

          {/* Subtab 4: Raw SQL */}
          {dbSubTab === 'raw_sql' && (
            <div className="space-y-2">
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    const script = generateMySQLScript({
                      users,
                      categories,
                      foods,
                      orders,
                      transactions,
                      vouchers,
                      reviews,
                    });
                    navigator.clipboard.writeText(script);
                    showToast('Đã sao chép SQL', 'success');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold"
                >
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sao chép toàn bộ</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={18}
                value={generateMySQLScript({
                  users,
                  categories,
                  foods,
                  orders,
                  transactions,
                  vouchers,
                  reviews,
                })}
                className="w-full p-4 bg-slate-900 text-emerald-300 font-mono text-xs rounded-2xl border border-slate-800 focus:outline-none"
              />
            </div>
          )}
        </div>
      )}

      {/* Tab: Operations & System Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Vận hành & Cài đặt hệ thống căn tin
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Quản lý đóng/mở quầy phục vụ, phát thông báo chạy chữ, tải báo cáo Excel và công cụ kiểm thử.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Trạng thái quầy:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                    isCanteenOpen
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-rose-50 text-rose-800 border-rose-300'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isCanteenOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                    }`}
                  />
                  <span>{isCanteenOpen ? 'Đang mở cửa nhận đơn' : 'Tạm dừng nhận đơn'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Grid 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 1: Canteen Open/Close & Kitchen Capacity */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Khung giờ nhận đơn & Công suất bếp
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Kiểm soát tải của căn tin trong các giờ cao điểm
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                {/* Switch Canteen Open */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">
                      Cổng nhận đơn trực tuyến
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      {isCanteenOpen
                        ? 'Sinh viên và giảng viên có thể đặt món bình thường.'
                        : 'Khách hàng sẽ thấy thông báo tạm ngưng nhận đơn do bếp quá tải.'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleCanteenOpen}
                    className={`px-3.5 py-2 rounded-xl font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer whitespace-nowrap ${
                      isCanteenOpen
                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {isCanteenOpen ? 'Tạm dừng nhận đơn' : 'Mở lại cổng nhận đơn'}
                  </button>
                </div>

                {/* Operating hours display */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 text-[11px] block">Giờ mở cửa phục vụ</span>
                    <span className="font-bold font-mono text-slate-900 text-sm">06:30 Sáng</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 text-[11px] block">Giờ ngưng nhận đơn</span>
                    <span className="font-bold font-mono text-slate-900 text-sm">18:30 Chiều</span>
                  </div>
                </div>

                {/* Capacity Setting */}
                <div className="space-y-1.5 pt-2">
                  <label className="block font-bold text-slate-700 text-xs">
                    Công suất tối đa mỗi khung giờ (15 phút)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="10"
                      max="200"
                      value={maxOrdersPerSlot}
                      onChange={(e) => setMaxOrdersPerSlot(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                    <button
                      type="button"
                      onClick={handleSaveCapacity}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs whitespace-nowrap cursor-pointer"
                    >
                      Lưu công suất
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Khi đạt giới hạn, hệ thống sẽ tự động khóa khung giờ đó để tránh dồn ứ đơn tại quầy lấy món.
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Marquee Banner Announcement Editor */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Thông báo chạy chữ toàn trường (Marquee Banner)
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Nội dung hiển thị chạy chữ liên tục trên đầu trang web cho sinh viên
                  </span>
                </div>
              </div>

              <form onSubmit={handleSaveAnnouncement} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 text-xs mb-1">
                    Nội dung thông báo phát thanh
                  </label>
                  <textarea
                    rows={4}
                    value={announcementInput}
                    onChange={(e) => setAnnouncementInput(e.target.value)}
                    placeholder="Nhập thông báo gửi toàn trường..."
                    className="w-full p-3 rounded-2xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 leading-relaxed font-medium"
                  />
                </div>

                {/* Quick Templates */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 block">Mẫu nhanh:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setAnnouncementInput(
                          '🎉 Chào mừng đến với Căn tin EatNow! Đặt trước nhận ngay — Giảm 10% cho đơn hàng đầu tiên qua Ví CanteenGo | Thực đơn trưa phục vụ từ 10:30 đến 13:30 mỗi ngày | Chúc bạn một bữa ăn ngon miệng! 🍱🥤'
                        )
                      }
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10.5px] cursor-pointer"
                    >
                      Mặc định
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAnnouncementInput(
                          '📢 THÔNG BÁO KHẨN: Giờ cao điểm từ 11:30 - 12:15, các bạn sinh viên vui lòng kiểm tra mã lấy món trên app trước khi vào quầy A1 để nhận món nhanh nhất!'
                        )
                      }
                      className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[10.5px] cursor-pointer"
                    >
                      Cảnh báo giờ cao điểm
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAnnouncementInput(
                          '🌿 HÔM NAY CÓ THỰC ĐƠN MÓN CHAY THANH ĐẠM: Đậu hũ sốt nấm hương, Canh chua bông điên điển và Trà sen vàng hạt chia. Mời quý thầy cô và sinh viên thưởng thức!'
                        )
                      }
                      className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10.5px] cursor-pointer"
                    >
                      Thực đơn món chay
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Megaphone className="w-3.5 h-3.5" />
                    <span>Cập nhật bảng tin ngay</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Card 3: Data Export Center (Excel & CSV) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Trung tâm xuất báo cáo dữ liệu (Excel / CSV)
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Xuất file bảng tính hỗ trợ tiếng Việt đầy đủ chuẩn UTF-8 BOM
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">
                      Báo cáo toàn bộ đơn hàng căn tin
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Bao gồm {orders.length} đơn hàng, chi tiết tên món, mã đơn, khách hàng, tổng tiền ví.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={exportOrdersToCSV}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-auto"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải Excel Đơn hàng (.csv)</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">
                      Báo cáo Tài khoản & Số dư Ví CanteenGo
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Danh sách {users.length} người dùng (Sinh viên, Giảng viên, Bếp) kèm số dư ví thực tế.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={exportUsersToCSV}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-auto"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải Excel Tài khoản & Ví</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 4: Quick Testing & Operations Playground */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <PlayCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Công cụ Kiểm thử & Demo Vận hành
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Phím tắt dành riêng cho Quản trị viên để kiểm tra quy trình nhanh chóng
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-blue-950 block text-xs">
                      Tạo đơn hàng mẫu tự động (Mock Order)
                    </span>
                    <span className="text-blue-700 text-[11px]">
                      Tự động tạo 1 đơn mới với món ngẫu nhiên để kiểm thử quy trình duyệt và bàn giao tại bếp.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateMockOrder}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs whitespace-nowrap cursor-pointer"
                  >
                    Tạo đơn ngay
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-amber-950 block text-xs">
                      Nạp +100.000₫ vào tất cả tài khoản
                    </span>
                    <span className="text-amber-700 text-[11px]">
                      Cộng thêm số dư vào ví toàn bộ tài khoản demo để thoải mái kiểm thử đặt món.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleTopupAllWallets}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs whitespace-nowrap cursor-pointer"
                  >
                    Bơm ví (+100k)
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-200 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-rose-950 block text-xs">
                      Đặt lại dữ liệu gốc (Reset Database)
                    </span>
                    <span className="text-rose-700 text-[11px]">
                      Xóa toàn bộ đơn test và khôi phục thực đơn, tài khoản chuẩn từ ban đầu.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetDemoData}
                    className="px-3.5 py-2 rounded-xl border border-rose-300 hover:bg-rose-100 text-rose-800 font-bold text-xs whitespace-nowrap cursor-pointer"
                  >
                    Khôi phục gốc
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Voucher Modal */}
      {isVoucherModalOpen && (
        <div className="fixed inset-0 z-70 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                Tạo mã giảm giá / Voucher mới
              </h3>
              <button
                onClick={() => setIsVoucherModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!voucherForm.code.trim() || !voucherForm.title.trim()) {
                  showToast('Vui lòng nhập đầy đủ mã và tiêu đề voucher', 'error');
                  return;
                }
                adminAddVoucher({
                  code: voucherForm.code.trim().toUpperCase(),
                  title: voucherForm.title.trim(),
                  description: voucherForm.description.trim() || 'Ưu đãi đặt món sinh viên',
                  discountType: voucherForm.discountType,
                  discountValue: Number(voucherForm.discountValue),
                  minOrderValue: Number(voucherForm.minOrderValue),
                  maxDiscount: voucherForm.discountType === 'percent' ? Number(voucherForm.maxDiscount || 20000) : undefined,
                });
                setIsVoucherModalOpen(false);
                setVoucherForm({
                  code: '',
                  title: '',
                  description: '',
                  discountType: 'fixed',
                  discountValue: 10000,
                  minOrderValue: 35000,
                });
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mã khuyến mãi (Code)
                </label>
                <input
                  type="text"
                  required
                  value={voucherForm.code}
                  onChange={(e) => setVoucherForm({ ...voucherForm, code: e.target.value.toUpperCase() })}
                  placeholder="Ví dụ: BANTHANG10, GIAM20K..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tiêu đề chương trình
                </label>
                <input
                  type="text"
                  required
                  value={voucherForm.title}
                  onChange={(e) => setVoucherForm({ ...voucherForm, title: e.target.value })}
                  placeholder="Ví dụ: Giảm giá ngày hội sinh viên..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Loại giảm giá
                  </label>
                  <select
                    value={voucherForm.discountType}
                    onChange={(e) => setVoucherForm({ ...voucherForm, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none"
                  >
                    <option value="fixed">Số tiền cố định (VNĐ)</option>
                    <option value="percent">Phần trăm (%)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Giá trị giảm ({voucherForm.discountType === 'percent' ? '%' : 'VNĐ'})
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={voucherForm.discountValue}
                    onChange={(e) => setVoucherForm({ ...voucherForm, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono-nums focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Giá trị đơn hàng tối thiểu (VNĐ)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={voucherForm.minOrderValue}
                  onChange={(e) => setVoucherForm({ ...voucherForm, minOrderValue: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono-nums focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mô tả ngắn gọn
                </label>
                <input
                  type="text"
                  value={voucherForm.description}
                  onChange={(e) => setVoucherForm({ ...voucherForm, description: e.target.value })}
                  placeholder="Áp dụng cho mọi sinh viên..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-xs"
                >
                  Tạo Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Food Modal */}
      {isFoodModalOpen && (
        <div className="fixed inset-0 z-70 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {editingFood ? 'Chỉnh sửa thông tin món ăn' : 'Thêm món ăn mới vào thực đơn'}
              </h3>
              <button
                onClick={() => setIsFoodModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFood} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tên món ăn
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Cơm gà sốt nấm..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Danh mục
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Đơn giá (VNĐ)
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="1000"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono-nums focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Số lượng chuẩn bị
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockQuantity: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono-nums focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Thời gian nấu (phút)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.prepTimeMinutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prepTimeMinutes: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono-nums focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        calories: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono-nums focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Đường dẫn hình ảnh (URL)
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mô tả món ăn
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Đặc điểm dinh dưỡng & Thông tin (cách nhau dấu phẩy)
                </label>
                <div className="grid grid-cols-5 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">
                      Đạm (g)
                    </label>
                    <input
                      type="number"
                      value={formData.protein}
                      onChange={(e) =>
                        setFormData({ ...formData, protein: Number(e.target.value) })
                      }
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded-lg bg-white font-mono-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">
                      Carbs (g)
                    </label>
                    <input
                      type="number"
                      value={formData.carbs}
                      onChange={(e) =>
                        setFormData({ ...formData, carbs: Number(e.target.value) })
                      }
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded-lg bg-white font-mono-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">
                      Béo (g)
                    </label>
                    <input
                      type="number"
                      value={formData.fat}
                      onChange={(e) =>
                        setFormData({ ...formData, fat: Number(e.target.value) })
                      }
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded-lg bg-white font-mono-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">
                      Chất xơ (g)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.fiber}
                      onChange={(e) =>
                        setFormData({ ...formData, fiber: Number(e.target.value) })
                      }
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded-lg bg-white font-mono-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">
                      Natri (mg)
                    </label>
                    <input
                      type="number"
                      value={formData.sodiumMg}
                      onChange={(e) =>
                        setFormData({ ...formData, sodiumMg: Number(e.target.value) })
                      }
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded-lg bg-white font-mono-nums"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Cảnh báo chất gây dị ứng (Allergens, cách nhau bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  value={formData.allergens}
                  onChange={(e) =>
                    setFormData({ ...formData, allergens: e.target.value })
                  }
                  placeholder="Ví dụ: Trứng, Đậu nành, Sữa bò, Gluten, Hải sản..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Để trống nếu món không chứa các chất gây dị ứng phổ biến.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Thẻ / Đặc điểm nổi bật (cách nhau bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Bán chạy, Giàu đạm, Giòn tan..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="modalIsAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) =>
                    setFormData({ ...formData, isAvailable: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-amber-600 border-slate-300 focus:ring-amber-500"
                />
                <label
                  htmlFor="modalIsAvailable"
                  className="font-medium text-slate-700 cursor-pointer"
                >
                  Công khai và mở bán ngay trên thực đơn
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsFoodModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-xs cursor-pointer"
                >
                  {editingFood ? 'Lưu thay đổi' : 'Thêm món ăn'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 1: Cancel Order with Instant Wallet Refund */}
      {isCancelModalOpen && orderToCancel && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-rose-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    Hủy đơn hàng #{orderToCancel.orderCode}
                  </h3>
                  <span className="text-[11px] text-rose-600 font-semibold">
                    Tiền sẽ được hoàn 100% về Ví CanteenGo tức thì
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsCancelModalOpen(false);
                  setOrderToCancel(null);
                }}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Khách hàng:</span>
                  <span className="font-bold text-slate-900">{orderToCancel.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Số tiền hoàn trả:</span>
                  <span className="font-bold font-mono-nums text-rose-600 text-sm">
                    {orderToCancel.totalAmount.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lý do hủy đơn <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={cancelReasonInput}
                  onChange={(e) => setCancelReasonInput(e.target.value)}
                  placeholder="Nhập lý do (ví dụ: Hết món đột xuất, sự cố nhà bếp, yêu cầu của khách...)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500/30 resize-none font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCancelModalOpen(false);
                    setOrderToCancel(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancelOrder}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Xác nhận hủy & hoàn tiền
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Admin Order Detail Modal */}
      {selectedOrderForAdmin && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    Chi tiết đơn #{selectedOrderForAdmin.orderCode}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Đặt lúc: {new Date(selectedOrderForAdmin.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrderForAdmin(null)}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
              {/* Customer summary */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Khách hàng</span>
                  <span className="font-bold text-slate-900">{selectedOrderForAdmin.userName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Số điện thoại</span>
                  <span className="font-mono-nums text-slate-800">{selectedOrderForAdmin.userPhone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Khung giờ hẹn lấy</span>
                  <span className="font-semibold text-amber-800">{selectedOrderForAdmin.pickupTimeSlot}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Hình thức dùng bữa</span>
                  <span className="font-semibold text-slate-800">
                    {selectedOrderForAdmin.diningOption === 'dine_in'
                      ? `Ăn tại chỗ ${selectedOrderForAdmin.tableNumber ? `(Bàn ${selectedOrderForAdmin.tableNumber})` : ''}`
                      : 'Mang về (Takeaway)'}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                  Danh sách món đã đặt
                </h4>
                <div className="space-y-2">
                  {selectedOrderForAdmin.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center font-mono-nums">
                          {item.quantity}x
                        </span>
                        <div>
                          <div className="font-bold text-slate-900">{item.name}</div>
                          {item.note && (
                            <div className="text-[11px] text-amber-700 italic">
                              Ghi chú: {item.note}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="font-bold font-mono-nums text-slate-900">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1.5 font-semibold">
                {selectedOrderForAdmin.voucherCode && (
                  <div className="flex justify-between text-emerald-700 text-xs">
                    <span>Voucher áp dụng ({selectedOrderForAdmin.voucherCode}):</span>
                    <span>-{(selectedOrderForAdmin.discountAmount || 0).toLocaleString('vi-VN')}₫</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-900 text-sm font-bold pt-1 border-t border-amber-200/60">
                  <span>Tổng thanh toán Ví CanteenGo:</span>
                  <span className="text-amber-800 font-mono-nums">
                    {selectedOrderForAdmin.totalAmount.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrderForAdmin(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Add / Edit Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingCategory ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục mới'}
                </h3>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên danh mục <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="Ví dụ: Món ăn vặt đặc biệt..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Slug đường dẫn (Tùy chọn)
                </label>
                <input
                  type="text"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  placeholder="mon-an-vat (tự sinh nếu để trống)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mô tả ngắn
                </label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Mô tả danh mục này cho sinh viên..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer shadow-xs"
                >
                  {editingCategory ? 'Lưu thay đổi' : 'Tạo danh mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Top-up / Adjust User Wallet Balance */}
      {isWalletModalOpen && targetUserForWallet && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    Nạp / Điều chỉnh Ví CanteenGo
                  </h3>
                  <span className="text-[11px] text-emerald-800 font-medium">
                    Tài khoản: {targetUserForWallet.name}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsWalletModalOpen(false);
                  setTargetUserForWallet(null);
                }}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveWalletAdjustment} className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-500">Số dư hiện tại:</span>
                <span className="text-sm font-bold font-mono-nums text-slate-900">
                  {targetUserForWallet.balance.toLocaleString('vi-VN')}₫
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Số tiền nạp thêm (VNĐ) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="5000"
                  step="5000"
                  value={walletAmountInput}
                  onChange={(e) => setWalletAmountInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold font-mono-nums text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[20000, 50000, 100000, 200000, 500000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setWalletAmountInput(amt)}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-700 font-semibold font-mono-nums text-[10px] transition-colors cursor-pointer"
                    >
                      +{amt.toLocaleString('vi-VN')}₫
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ghi chú điều chỉnh
                </label>
                <input
                  type="text"
                  value={walletNoteInput}
                  onChange={(e) => setWalletNoteInput(e.target.value)}
                  placeholder="Ví dụ: Nạp tiền trực tiếp tại quầy căn tin..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsWalletModalOpen(false);
                    setTargetUserForWallet(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-xs"
                >
                  Xác nhận nạp tiền
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Change User Role */}
      {isRoleModalOpen && targetUserForRole && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    Phân quyền hệ thống
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Người dùng: {targetUserForRole.name}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsRoleModalOpen(false);
                  setTargetUserForRole(null);
                }}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRoleChange} className="p-6 space-y-4 text-xs">
              <div className="space-y-2">
                {[
                  { id: 'customer', title: 'Sinh viên / Khách hàng', desc: 'Đặt món trước, thanh toán ví CanteenGo, đánh giá món.' },
                  { id: 'lecturer', title: 'Giảng viên', desc: 'Ưu tiên gọi món, đặt phần ăn giảng viên.' },
                  { id: 'staff', title: 'Nhân viên Căn tin (Bếp)', desc: 'Xử lý đơn theo thời gian thực, cập nhật trạng thái nấu & sẵn sàng.' },
                  { id: 'admin', title: 'Quản trị viên (Admin)', desc: 'Toàn quyền cấu hình thực đơn, quản lý tài khoản, xem doanh thu và xuất SQL.' },
                ].map((r) => (
                  <label
                    key={r.id}
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-colors ${
                      selectedRoleInput === r.id
                        ? 'border-purple-500 bg-purple-50/60 ring-1 ring-purple-300'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="userRole"
                      value={r.id}
                      checked={selectedRoleInput === r.id}
                      onChange={() => setSelectedRoleInput(r.id as Role)}
                      className="mt-0.5 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">{r.title}</span>
                      <span className="text-slate-500 text-[11px] mt-0.5 block">{r.desc}</span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsRoleModalOpen(false);
                    setTargetUserForRole(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer shadow-xs"
                >
                  Lưu phân quyền
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
