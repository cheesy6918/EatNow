import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Category,
  FoodItem,
  Order,
  OrderStatus,
  Role,
  User,
  WalletTransaction,
  Review,
  CartItem,
  Voucher,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_FOODS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_TRANSACTIONS,
  INITIAL_USERS,
  AVAILABLE_PICKUP_SLOTS,
  INITIAL_VOUCHERS,
} from '../data/initialData';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface RegisterData {
  name: string;
  emailOrPhone: string;
  password: string;
  mssv?: string;
  phone?: string;
  role?: Role;
  className?: string;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  role: Role | null;
  isAuthenticated: boolean;
  switchRole: (newRole: Role) => void;
  categories: Category[];
  foods: FoodItem[];
  cart: CartItem[];
  orders: Order[];
  transactions: WalletTransaction[];
  reviews: Review[];
  pickupSlots: string[];

  // Filters & Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (catId: string) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  sortBy: 'popular' | 'price-asc' | 'price-desc' | 'rating';
  setSortBy: (sort: 'popular' | 'price-asc' | 'price-desc' | 'rating') => void;
  priceFilter: 'all' | 'under30' | '30to45' | 'above45';
  setPriceFilter: (filter: 'all' | 'under30' | '30to45' | 'above45') => void;
  healthyOnly: boolean;
  setHealthyOnly: (val: boolean) => void;

  // Modals & Navigation
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  selectedFood: FoodItem | null;
  setSelectedFood: (food: FoodItem | null) => void;
  selectedOrderForDetail: Order | null;
  setSelectedOrderForDetail: (order: Order | null) => void;
  receiptOrder: Order | null;
  setReceiptOrder: (order: Order | null) => void;
  reviewingOrder: Order | null;
  setReviewingOrder: (order: Order | null) => void;
  activeNavTab: 'menu' | 'my-orders' | 'staff-orders' | 'admin-dashboard' | 'login' | 'register';
  setActiveNavTab: (tab: 'menu' | 'my-orders' | 'staff-orders' | 'admin-dashboard' | 'login' | 'register') => void;

  // Vouchers & Dining
  vouchers: Voucher[];
  appliedVoucher: Voucher | null;
  applyVoucher: (code: string) => { success: boolean; message: string };
  removeVoucher: () => void;
  voucherDiscount: number;
  diningOption: 'dine_in' | 'takeaway';
  setDiningOption: (option: 'dine_in' | 'takeaway') => void;
  tableNumber: string;
  setTableNumber: (table: string) => void;

  // Actions
  addToCart: (food: FoodItem, quantity?: number, note?: string) => void;
  updateCartQuantity: (foodId: string, quantity: number) => void;
  removeFromCart: (foodId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  finalCartTotal: number;
  cartItemCount: number;

  createOrder: (pickupSlot: string) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  cancelOrder: (orderId: string, reason?: string) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, cancelReason?: string) => void;

  depositWallet: (amount: number) => void;
  addReview: (orderId: string, foodId: string, rating: number, comment: string) => void;
  updateUserProfile: (data: Partial<User>) => void;

  switchUser: (userId: string) => void;
  loginUser: (identifier: string, password?: string) => boolean;
  quickLoginDemoUser: (userId: string) => void;
  registerUser: (data: RegisterData) => boolean;
  logoutUser: () => void;

  // Admin Operations
  adminAddFood: (foodData: Omit<FoodItem, 'id' | 'rating' | 'reviewCount'>) => void;
  adminUpdateFood: (foodId: string, updates: Partial<FoodItem>) => void;
  adminDeleteFood: (foodId: string) => void;
  adminToggleFoodAvailability: (foodId: string) => void;
  adminAddVoucher: (voucher: Voucher) => void;
  adminDeleteVoucher: (code: string) => void;
  adminAddCategory: (categoryData: Omit<Category, 'id'>) => void;
  adminUpdateCategory: (catId: string, updates: Partial<Category>) => void;
  adminDeleteCategory: (catId: string) => void;
  adminAdjustUserWallet: (userId: string, amount: number, note: string) => void;
  adminUpdateUserRole: (userId: string, newRole: Role) => void;
  adminResetUserPassword: (userId: string, newPassword?: string) => void;

  // Toasts
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load users list with localStorage support
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('eatnow_users_v6');
    if (!saved) return INITIAL_USERS;
    try {
      const parsed: User[] = JSON.parse(saved);
      const mapped = INITIAL_USERS.map((initial) => {
        const found = parsed.find((p) => p.id === initial.id || p.email === initial.email);
        return found ? { ...initial, ...found } : initial;
      });
      const initialIds = new Set(INITIAL_USERS.map((u) => u.id));
      const extraUsers = parsed.filter((p) => !initialIds.has(p.id));
      return [...mapped, ...extraUsers];
    } catch {
      return INITIAL_USERS;
    }
  });

  useEffect(() => {
    localStorage.setItem('eatnow_users_v6', JSON.stringify(users));
  }, [users]);

  // Current logged in user: default null (Guest / not logged in) unless stored in localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('eatnow_auth_user');
    if (!saved) return null;
    try {
      const parsed: User = JSON.parse(saved);
      const found = INITIAL_USERS.find((u) => u.id === parsed.id || u.email === parsed.email);
      return found ? { ...found, ...parsed } : parsed;
    } catch {
      return null;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('eatnow_categories_v2');
    if (!saved) return INITIAL_CATEGORIES;
    try {
      const parsed: Category[] = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  useEffect(() => {
    localStorage.setItem('eatnow_categories_v2', JSON.stringify(categories));
  }, [categories]);

  const [foods, setFoods] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem('eatnow_foods_v7');
    if (!saved) return INITIAL_FOODS;
    try {
      const parsed: FoodItem[] = JSON.parse(saved);
      const mapped = parsed.map((item) => {
        const initial = INITIAL_FOODS.find((f) => f.id === item.id);
        return {
          ...item,
          image: initial?.image || item.image,
          nutrition: item.nutrition || initial?.nutrition,
          allergens: item.allergens || initial?.allergens,
          dietaryTags: item.dietaryTags || initial?.dietaryTags,
        };
      });
      const existingIds = new Set(mapped.map((f) => f.id));
      const newlyAdded = INITIAL_FOODS.filter((f) => !existingIds.has(f.id));
      return [...mapped, ...newlyAdded];
    } catch {
      return INITIAL_FOODS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('eatnow_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('eatnow_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem('eatnow_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('eatnow_reviews_v6');
    if (!saved) return INITIAL_REVIEWS;
    try {
      const parsed: Review[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map((r) => r.id));
      const newlyAdded = INITIAL_REVIEWS.filter((r) => !existingIds.has(r.id));
      return [...parsed, ...newlyAdded];
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under30' | '30to45' | 'above45'>('all');
  const [healthyOnly, setHealthyOnly] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [reviewingOrder, setReviewingOrder] = useState<Order | null>(null);
  const [activeNavTab, setActiveNavTab] = useState<
    'menu' | 'my-orders' | 'staff-orders' | 'admin-dashboard' | 'login' | 'register'
  >(() => {
    if (typeof window === 'undefined') return 'menu';
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path === '/login' || hash === '#login') return 'login';
    if (path === '/register' || hash === '#register') return 'register';
    if (path === '/staff-orders' || hash === '#staff-orders') return 'staff-orders';
    if (path === '/admin-dashboard' || hash === '#admin-dashboard') return 'admin-dashboard';
    if (path === '/my-orders' || hash === '#my-orders') return 'my-orders';
    return 'menu';
  });

  // Keep browser URL pathname in sync with activeNavTab
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (activeNavTab === 'login') {
      if (window.location.pathname !== '/login') {
        window.history.pushState({}, '', '/login');
      }
    } else if (activeNavTab === 'register') {
      if (window.location.pathname !== '/register') {
        window.history.pushState({}, '', '/register');
      }
    } else if (activeNavTab === 'menu') {
      if (window.location.pathname === '/login' || window.location.pathname === '/register') {
        window.history.pushState({}, '', '/');
      }
    }
  }, [activeNavTab]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/login' || hash === '#login') setActiveNavTab('login');
      else if (path === '/register' || hash === '#register') setActiveNavTab('register');
      else if (path === '/staff-orders' || hash === '#staff-orders') setActiveNavTab('staff-orders');
      else if (path === '/admin-dashboard' || hash === '#admin-dashboard') setActiveNavTab('admin-dashboard');
      else if (path === '/my-orders' || hash === '#my-orders') setActiveNavTab('my-orders');
      else setActiveNavTab('menu');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Vouchers & Dining
  const [vouchers, setVouchers] = useState<Voucher[]>(() => {
    const saved = localStorage.getItem('eatnow_vouchers');
    return saved ? JSON.parse(saved) : INITIAL_VOUCHERS;
  });
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [diningOption, setDiningOption] = useState<'dine_in' | 'takeaway'>('takeaway');
  const [tableNumber, setTableNumber] = useState<string>('Khu A1 - Bàn 04');

  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('eatnow_vouchers', JSON.stringify(vouchers));
  }, [vouchers]);

  useEffect(() => {
    localStorage.setItem('eatnow_users_v6', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('eatnow_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('eatnow_auth_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('eatnow_foods_v7', JSON.stringify(foods));
  }, [foods]);

  useEffect(() => {
    localStorage.setItem('eatnow_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('eatnow_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('eatnow_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('eatnow_reviews_v6', JSON.stringify(reviews));
  }, [reviews]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(false);
    setActiveNavTab(mode);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Role Switcher
  const switchRole = (newRole: Role) => {
    const matchedUser = users.find((u) => u.role === newRole);
    if (matchedUser) {
      setCurrentUser(matchedUser);
      localStorage.setItem('eatnow_auth_user', JSON.stringify(matchedUser));
      const roleText =
        newRole === 'customer'
          ? 'Sinh viên'
          : newRole === 'lecturer'
          ? 'Giảng viên'
          : newRole === 'staff'
          ? 'Nhân viên Căn tin'
          : 'Quản trị viên';
      showToast(`Đã chuyển sang vai trò: ${roleText}`, 'info');
      if (newRole === 'staff') {
        setActiveNavTab('staff-orders');
      } else if (newRole === 'admin') {
        setActiveNavTab('admin-dashboard');
      } else {
        setActiveNavTab('menu');
      }
    }
  };

  // Direct User Switcher for Team Members/Admin
  const switchUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem('eatnow_auth_user', JSON.stringify(found));
      const roleTitle =
        found.role === 'customer'
          ? 'Sinh viên'
          : found.role === 'lecturer'
          ? 'Giảng viên'
          : found.role === 'staff'
          ? 'Nhân viên Căn tin'
          : 'Quản trị viên';
      showToast(`Đã chuyển sang tài khoản: ${found.name} (${roleTitle})`, 'info');
      if (found.role === 'staff') {
        setActiveNavTab('staff-orders');
      } else if (found.role === 'admin') {
        setActiveNavTab('admin-dashboard');
      } else {
        setActiveNavTab('menu');
      }
    }
  };

  // Login handler
  const loginUser = (identifier: string, password?: string): boolean => {
    const term = identifier.trim().toLowerCase();
    if (!term) {
      showToast('Vui lòng nhập Email, Mã sinh viên hoặc tên đăng nhập!', 'error');
      return false;
    }

    // Direct check for Admin aliases
    const isAdminTrigger =
      term === 'admin' ||
      term === 'administrator' ||
      term === 'quantri' ||
      term === 'quan tri' ||
      term === 'admin@eatnow.edu.vn' ||
      term === 'admin@eatnow.vn' ||
      term === 'hongthu' ||
      term === '2374820182' ||
      term === 'user-admin-01' ||
      term === 'user-ad-01' ||
      term.includes('admin');

    let found: User | undefined;

    if (isAdminTrigger) {
      found = users.find((u) => u.role === 'admin' || u.id === 'user-admin-01') || INITIAL_USERS.find((u) => u.role === 'admin');
    } else {
      found = users.find(
        (u) =>
          u.email.toLowerCase() === term ||
          (u.mssv && u.mssv.toLowerCase() === term) ||
          u.phone.replace(/\s+/g, '') === term.replace(/\s+/g, '') ||
          u.id.toLowerCase() === term
      );

      // Other role aliases
      if (!found) {
        if (
          term === 'staff' ||
          term === 'bep' ||
          term === 'nhanvien' ||
          term === '2374820071' ||
          term === 'user-nv-01' ||
          term === 'nhanvien@canteen.vn'
        ) {
          found = users.find((u) => u.role === 'staff') || INITIAL_USERS.find((u) => u.role === 'staff');
        } else if (
          term === 'gv' ||
          term === 'giangvien' ||
          term === 'nam.th' ||
          term === 'gv-2024' ||
          term === 'user-gv-01' ||
          term === 'giangvien@edu.vn'
        ) {
          found = users.find((u) => u.role === 'lecturer') || INITIAL_USERS.find((u) => u.role === 'lecturer');
        } else if (
          term === 'sv' ||
          term === 'sinhvien' ||
          term === 'linhchi' ||
          term === '2374820028' ||
          term === 'user-sv-01' ||
          term === 'sinhvien@st.edu.vn'
        ) {
          found = users.find((u) => u.role === 'customer') || INITIAL_USERS.find((u) => u.role === 'customer');
        }
      }
    }

    if (!found) {
      showToast('Tài khoản không tồn tại trong hệ thống. Vui lòng thử tài khoản Admin hoặc Demo!', 'error');
      return false;
    }

    // Password validation - forgiving for test environments
    if (password !== undefined && password.trim() !== '') {
      const expectedPw = found.password || '123456';
      const cleanPw = password.trim();
      const isAccepted =
        cleanPw === expectedPw ||
        cleanPw === '123456' ||
        cleanPw === 'admin' ||
        cleanPw === 'admin123' ||
        found.role === 'admin'; // Admin password always accepted in demo
      if (!isAccepted) {
        showToast('Mật khẩu không chính xác! (Mật khẩu mặc định là 123456)', 'error');
        return false;
      }
    }

    setCurrentUser(found);
    localStorage.setItem('eatnow_auth_user', JSON.stringify(found));
    setIsAuthModalOpen(false);

    const roleName =
      found.role === 'customer'
        ? 'Sinh viên'
        : found.role === 'lecturer'
        ? 'Giảng viên'
        : found.role === 'staff'
        ? 'Nhân viên Căn tin'
        : 'Quản trị viên';

    showToast(`Đăng nhập thành công! Xin chào, ${found.name} (${roleName})`, 'success');

    if (found.role === 'staff') {
      setActiveNavTab('staff-orders');
    } else if (found.role === 'admin') {
      setActiveNavTab('admin-dashboard');
    } else {
      setActiveNavTab('menu');
    }
    return true;
  };

  // Quick Demo Login
  const quickLoginDemoUser = (userId: string) => {
    let found: User | undefined;

    if (
      userId === 'user-admin-01' ||
      userId === 'user-ad-01' ||
      userId === 'admin' ||
      userId === 'quantri' ||
      userId.includes('admin')
    ) {
      found = users.find((u) => u.role === 'admin' || u.id === 'user-admin-01') || INITIAL_USERS.find((u) => u.role === 'admin');
    } else if (userId === 'user-nv-01' || userId === 'staff' || userId === 'bep') {
      found = users.find((u) => u.role === 'staff' || u.id === 'user-nv-01') || INITIAL_USERS.find((u) => u.role === 'staff');
    } else if (userId === 'user-gv-01' || userId === 'lecturer' || userId === 'gv') {
      found = users.find((u) => u.role === 'lecturer' || u.id === 'user-gv-01') || INITIAL_USERS.find((u) => u.role === 'lecturer');
    } else if (userId === 'user-sv-01' || userId === 'customer' || userId === 'sv') {
      found = users.find((u) => u.role === 'customer' || u.id === 'user-sv-01') || INITIAL_USERS.find((u) => u.role === 'customer');
    } else {
      found = users.find((u) => u.id === userId);
    }

    if (found) {
      setCurrentUser(found);
      localStorage.setItem('eatnow_auth_user', JSON.stringify(found));
      setIsAuthModalOpen(false);

      const roleName =
        found.role === 'customer'
          ? 'Sinh viên'
          : found.role === 'lecturer'
          ? 'Giảng viên'
          : found.role === 'staff'
          ? 'Nhân viên Căn tin'
          : 'Quản trị viên';

      showToast(`Đăng nhập thành công: ${found.name} (${roleName})`, 'success');

      if (found.role === 'staff') {
        setActiveNavTab('staff-orders');
      } else if (found.role === 'admin') {
        setActiveNavTab('admin-dashboard');
      } else {
        setActiveNavTab('menu');
      }
    } else {
      showToast('Không tìm thấy tài khoản tương ứng!', 'error');
    }
  };

  // Register handler
  const registerUser = (data: RegisterData): boolean => {
    const { name, mssv, emailOrPhone, password, phone, role: inputRole, className } = data;

    if (!name.trim()) {
      showToast('Vui lòng nhập Họ và tên!', 'error');
      return false;
    }
    if (!emailOrPhone.trim()) {
      showToast('Vui lòng nhập Địa chỉ email!', 'error');
      return false;
    }
    if (!password || password.length < 6) {
      showToast('Mật khẩu tối thiểu phải từ 6 ký tự!', 'error');
      return false;
    }

    const isEmail = emailOrPhone.includes('@');
    const userEmail = isEmail ? emailOrPhone.trim().toLowerCase() : `${emailOrPhone.trim()}@st.edu.vn`;
    const userPhone = phone?.trim() || (!isEmail ? emailOrPhone.trim() : '09' + Math.floor(10000000 + Math.random() * 90000000));

    // Determine role from email domain or inputRole
    let detectedRole: Role = inputRole || 'customer';
    if (!inputRole) {
      if (userEmail.endsWith('@st.edu.vn')) {
        detectedRole = 'customer';
      } else if (userEmail.endsWith('@edu.vn')) {
        detectedRole = 'lecturer';
      } else if (userEmail.endsWith('@canteen.vn')) {
        detectedRole = 'staff';
      } else if (userEmail.endsWith('@eatnow.vn')) {
        detectedRole = 'admin';
      }
    }

    // Effective MSSV / Code
    const effectiveMssv =
      mssv?.trim() ||
      (detectedRole === 'customer'
        ? (userEmail.split('@')[0].toUpperCase().slice(0, 10) || `SV${Math.floor(100000 + Math.random() * 900000)}`)
        : detectedRole === 'lecturer'
        ? `GV-${Math.floor(1000 + Math.random() * 9000)}`
        : `NV-${Math.floor(100 + Math.random() * 900)}`);

    const existingEmail = users.find((u) => u.email.toLowerCase() === userEmail.toLowerCase());
    if (existingEmail) {
      showToast(`Email "${userEmail}" đã được sử dụng!`, 'error');
      return false;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      mssv: effectiveMssv,
      email: userEmail,
      phone: userPhone,
      password,
      role: detectedRole,
      walletBalance: 100000, // Tặng ngay 100.000₫ vào Ví CanteenGo
      className: className?.trim() || (detectedRole === 'customer' ? 'K22-CNTT' : detectedRole === 'lecturer' ? 'Khoa CNTT' : 'Nhân sự Căn tin'),
      department: detectedRole === 'staff' ? 'Nhân viên Quầy Căn tin' : detectedRole === 'admin' ? 'Ban Quản trị' : undefined,
      avatar: detectedRole === 'lecturer'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    localStorage.setItem('eatnow_auth_user', JSON.stringify(newUser));
    setIsAuthModalOpen(false);

    // Initial gift transaction
    const tx: WalletTransaction = {
      id: `tx-gift-${Date.now()}`,
      userId: newUser.id,
      type: 'deposit',
      amount: 100000,
      timestamp: new Date().toISOString(),
      description: 'Quà tặng thành viên mới Ví CanteenGo (+100.000₫)',
      status: 'success',
    };
    setTransactions((prev) => [tx, ...prev]);

    showToast(`Đăng ký thành công! Tặng ngay 100.000₫ vào Ví CanteenGo cho bạn.`, 'success');

    if (detectedRole === 'staff') {
      setActiveNavTab('staff-orders');
    } else if (detectedRole === 'admin') {
      setActiveNavTab('admin-dashboard');
    } else {
      setActiveNavTab('menu');
    }
    return true;
  };

  // Logout handler
  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('eatnow_auth_user');
    setActiveNavTab('menu');
    showToast('Đã đăng xuất khỏi tài khoản!', 'info');
  };

  // Cart operations
  const addToCart = (food: FoodItem, quantity: number = 1, note: string = '') => {
    if (!currentUser) {
      showToast('Vui lòng đăng nhập để chọn món và thêm vào giỏ hàng!', 'info');
      openAuthModal('login');
      return;
    }

    if (!food.isAvailable || food.stockQuantity <= 0) {
      showToast('Món ăn hiện đã hết hàng, vui lòng chọn món khác!', 'error');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.foodItem.id === food.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > food.stockQuantity) {
          showToast(`Chỉ còn ${food.stockQuantity} suất cho món ${food.name}!`, 'error');
          return prev;
        }
        showToast(`Đã tăng số lượng ${food.name} lên ${newQty}`, 'success');
        return prev.map((item) =>
          item.foodItem.id === food.id ? { ...item, quantity: newQty, note: note || item.note } : item
        );
      } else {
        if (quantity > food.stockQuantity) {
          showToast(`Chỉ còn ${food.stockQuantity} suất cho món ${food.name}!`, 'error');
          return prev;
        }
        showToast(`Đã thêm ${food.name} vào giỏ hàng`, 'success');
        return [...prev, { foodItem: food, quantity, note }];
      }
    });
  };

  const updateCartQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    const food = foods.find((f) => f.id === foodId);
    if (food && quantity > food.stockQuantity) {
      showToast(`Số lượng vượt quá số lượng còn lại (${food.stockQuantity} suất)`, 'error');
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.foodItem.id === foodId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (foodId: string) => {
    setCart((prev) => prev.filter((item) => item.foodItem.id !== foodId));
    showToast('Đã xóa món khỏi giỏ hàng', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.foodItem.price * item.quantity,
    0
  );

  let voucherDiscount = 0;
  if (appliedVoucher) {
    if (cartTotal < appliedVoucher.minOrderValue) {
      voucherDiscount = 0;
    } else if (appliedVoucher.discountType === 'percent') {
      const raw = Math.round((cartTotal * appliedVoucher.discountValue) / 100);
      voucherDiscount = appliedVoucher.maxDiscount ? Math.min(raw, appliedVoucher.maxDiscount) : raw;
    } else {
      voucherDiscount = Math.min(cartTotal, appliedVoucher.discountValue);
    }
  }

  const finalCartTotal = Math.max(0, cartTotal - voucherDiscount);

  const applyVoucher = (code: string) => {
    const found = vouchers.find((v) => v.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      showToast(`Mã giảm giá "${code}" không tồn tại hoặc đã hết hạn`, 'error');
      return { success: false, message: 'Mã không tồn tại' };
    }
    if (cartTotal < found.minOrderValue) {
      const msg = `Mã này áp dụng cho đơn từ ${found.minOrderValue.toLocaleString('vi-VN')}₫ (Giỏ hiện tại: ${cartTotal.toLocaleString('vi-VN')}₫)`;
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
    setAppliedVoucher(found);
    showToast(`Áp dụng mã ${found.code} thành công: ${found.title}!`, 'success');
    return { success: true, message: 'Thành công' };
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    showToast('Đã gỡ mã giảm giá', 'info');
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wallet operations
  const depositWallet = (amount: number) => {
    if (!currentUser) {
      showToast('Vui lòng đăng nhập để nạp tiền vào Ví!', 'info');
      openAuthModal('login');
      return;
    }
    if (amount <= 0) return;
    const newBalance = currentUser.walletBalance + amount;
    const updatedUser = { ...currentUser, walletBalance: newBalance };
    setCurrentUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? updatedUser : u))
    );

    const tx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      userId: currentUser.id,
      type: 'deposit',
      amount,
      timestamp: new Date().toISOString(),
      description: `Nạp tiền số dư Demo Ví CanteenGo (+${amount.toLocaleString('vi-VN')}₫)`,
      status: 'success',
    };
    setTransactions((prev) => [tx, ...prev]);
    showToast(`Nạp tiền thành công! Số dư mới: ${newBalance.toLocaleString('vi-VN')}₫`, 'success');
  };

  // Order Placement
  const createOrder = async (pickupSlot: string): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    if (!currentUser) {
      showToast('Vui lòng đăng nhập để tiến hành đặt món!', 'info');
      openAuthModal('login');
      return { success: false, error: 'Chưa đăng nhập' };
    }

    if (cart.length === 0) {
      return { success: false, error: 'Giỏ hàng đang trống!' };
    }

    // Check inventory stock
    for (const item of cart) {
      const currentFood = foods.find((f) => f.id === item.foodItem.id);
      if (!currentFood || !currentFood.isAvailable || currentFood.stockQuantity < item.quantity) {
        const errorMsg = `Món "${item.foodItem.name}" hiện không đủ số lượng (${currentFood ? currentFood.stockQuantity : 0} suất còn lại). Vui lòng cập nhật giỏ hàng.`;
        showToast(errorMsg, 'error');
        return { success: false, error: errorMsg };
      }
    }

    // Check wallet balance against final discounted total
    if (currentUser.walletBalance < finalCartTotal) {
      const errorMsg = `Số dư Ví CanteenGo không đủ (${currentUser.walletBalance.toLocaleString('vi-VN')}₫ / Cần ${finalCartTotal.toLocaleString('vi-VN')}₫). Vui lòng nạp thêm tiền!`;
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }

    // Deduct stock
    setFoods((prev) =>
      prev.map((f) => {
        const cartItem = cart.find((c) => c.foodItem.id === f.id);
        if (cartItem) {
          const remaining = f.stockQuantity - cartItem.quantity;
          return {
            ...f,
            stockQuantity: remaining,
            isAvailable: remaining > 0,
          };
        }
        return f;
      })
    );

    // Deduct wallet balance
    const newBalance = currentUser.walletBalance - finalCartTotal;
    const updatedUser = { ...currentUser, walletBalance: newBalance };
    setCurrentUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? updatedUser : u))
    );

    const orderId = `ord-${Date.now()}`;
    const orderCode = `EN-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create wallet transaction
    const tx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      userId: currentUser.id,
      orderId,
      orderCode,
      type: 'payment',
      amount: finalCartTotal,
      timestamp: new Date().toISOString(),
      description: `Thanh toán đơn hàng #${orderCode} qua Ví CanteenGo${appliedVoucher ? ` (Giảm ${voucherDiscount.toLocaleString('vi-VN')}₫)` : ''}`,
      status: 'success',
    };
    setTransactions((prev) => [tx, ...prev]);

    // Create order object
    const newOrder: Order = {
      id: orderId,
      orderCode,
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      userClass: currentUser.className,
      items: cart.map((c) => ({
        foodId: c.foodItem.id,
        name: c.foodItem.name,
        price: c.foodItem.price,
        quantity: c.quantity,
        note: c.note,
        image: c.foodItem.image,
      })),
      totalAmount: finalCartTotal,
      pickupTimeSlot: pickupSlot,
      diningOption: diningOption,
      tableNumber: diningOption === 'dine_in' ? tableNumber : undefined,
      voucherCode: appliedVoucher?.code,
      discountAmount: voucherDiscount,
      status: 'paid_pending_confirm',
      createdAt: new Date().toISOString(),
      paymentMethod: 'wallet',
      paymentStatus: 'paid',
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedVoucher(null);
    setIsCartOpen(false);

    showToast(`Đặt món thành công! Mã đơn: #${orderCode}. Khung giờ nhận: ${pickupSlot}`, 'success');
    setSelectedOrderForDetail(newOrder);

    return { success: true, orderId };
  };

  // Order cancellation and refund
  const cancelOrder = (orderId: string, reason: string = 'Khách hàng hủy đơn') => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    if (order.status === 'completed' || order.status === 'cancelled') {
      showToast('Không thể hủy đơn hàng này!', 'error');
      return;
    }

    // Restore stock
    setFoods((prev) =>
      prev.map((f) => {
        const item = order.items.find((i) => i.foodId === f.id);
        if (item) {
          const newStock = f.stockQuantity + item.quantity;
          return {
            ...f,
            stockQuantity: newStock,
            isAvailable: true,
          };
        }
        return f;
      })
    );

    // Refund wallet if paid
    if (order.paymentStatus === 'paid') {
      const orderUser = users.find((u) => u.id === order.userId);
      if (orderUser) {
        const refundedBalance = orderUser.walletBalance + order.totalAmount;
        const updatedOrderUser = { ...orderUser, walletBalance: refundedBalance };

        setUsers((prev) =>
          prev.map((u) => (u.id === order.userId ? updatedOrderUser : u))
        );

        if (currentUser && currentUser.id === order.userId) {
          setCurrentUser(updatedOrderUser);
        }

        const refundTx: WalletTransaction = {
          id: `tx-ref-${Date.now()}`,
          userId: order.userId,
          orderId: order.id,
          orderCode: order.orderCode,
          type: 'refund',
          amount: order.totalAmount,
          timestamp: new Date().toISOString(),
          description: `Hoàn tiền 100% cho đơn #${order.orderCode} (${reason})`,
          status: 'success',
        };
        setTransactions((prev) => [refundTx, ...prev]);
      }
    }

    // Update order status
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'cancelled',
              cancelReason: reason,
              paymentStatus: 'refunded',
            }
          : o
      )
    );

    if (selectedOrderForDetail?.id === orderId) {
      setSelectedOrderForDetail((prev) =>
        prev
          ? {
              ...prev,
              status: 'cancelled',
              cancelReason: reason,
              paymentStatus: 'refunded',
            }
          : null
      );
    }

    showToast(`Đã hủy đơn #${order.orderCode}. Đã hoàn ${order.totalAmount.toLocaleString('vi-VN')}₫ vào Ví CanteenGo.`, 'info');
  };

  // Staff / Kitchen updates order status
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, cancelReason?: string) => {
    if (newStatus === 'cancelled') {
      cancelOrder(orderId, cancelReason || 'Căn tin từ chối đơn do bếp quá tải');
      return;
    }

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated = {
            ...o,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : o.completedAt,
          };
          if (selectedOrderForDetail?.id === orderId) {
            setSelectedOrderForDetail(updated);
          }
          return updated;
        }
        return o;
      })
    );

    const statusTexts: Record<OrderStatus, string> = {
      pending_payment: 'Chờ thanh toán',
      paid_pending_confirm: 'Đã thanh toán - Chờ xác nhận',
      preparing: 'Đang chế biến trong bếp',
      ready: 'Đã sẵn sàng tại quầy',
      completed: 'Đã hoàn tất',
      cancelled: 'Đã hủy',
    };
    showToast(`Đơn hàng #${orders.find((o) => o.id === orderId)?.orderCode} chuyển sang: ${statusTexts[newStatus]}`, 'success');
  };

  // Add review
  const addReview = (orderId: string, foodId: string, rating: number, comment: string) => {
    if (!currentUser) {
      showToast('Vui lòng đăng nhập để đánh giá món ăn!', 'info');
      openAuthModal('login');
      return;
    }

    const food = foods.find((f) => f.id === foodId);
    if (!food) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      foodId,
      foodName: food.name,
      userId: currentUser.id,
      userName: currentUser.name,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [newRev, ...prev]);

    // Recalculate food rating
    setFoods((prev) =>
      prev.map((f) => {
        if (f.id === foodId) {
          const newCount = f.reviewCount + 1;
          const newRating = Number(((f.rating * f.reviewCount + rating) / newCount).toFixed(1));
          return {
            ...f,
            rating: newRating,
            reviewCount: newCount,
          };
        }
        return f;
      })
    );

    // Update order with rating
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, rating, reviewComment: comment } : o
      )
    );

    if (selectedOrderForDetail?.id === orderId) {
      setSelectedOrderForDetail((prev) =>
        prev ? { ...prev, rating, reviewComment: comment } : null
      );
    }

    showToast('Cảm ơn bạn đã gửi đánh giá món ăn!', 'success');
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? updated : u))
    );
    showToast('Cập nhật thông tin thành công!', 'success');
  };

  // Admin Food Management
  const adminAddFood = (foodData: Omit<FoodItem, 'id' | 'rating' | 'reviewCount'>) => {
    const newFood: FoodItem = {
      ...foodData,
      id: `food-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
    };
    setFoods((prev) => [newFood, ...prev]);
    showToast(`Đã thêm món "${newFood.name}" vào thực đơn`, 'success');
  };

  const adminUpdateFood = (foodId: string, updates: Partial<FoodItem>) => {
    setFoods((prev) =>
      prev.map((f) => (f.id === foodId ? { ...f, ...updates } : f))
    );
    showToast('Cập nhật thông tin món ăn thành công', 'success');
  };

  const adminDeleteFood = (foodId: string) => {
    const food = foods.find((f) => f.id === foodId);
    setFoods((prev) => prev.filter((f) => f.id !== foodId));
    showToast(`Đã xóa món "${food?.name || ''}" khỏi thực đơn`, 'info');
  };

  const adminToggleFoodAvailability = (foodId: string) => {
    setFoods((prev) =>
      prev.map((f) => {
        if (f.id === foodId) {
          const next = !f.isAvailable;
          showToast(`Món "${f.name}" hiện: ${next ? 'Đang mở bán' : 'Tạm ẩn/hết hàng'}`, 'info');
          return { ...f, isAvailable: next };
        }
        return f;
      })
    );
  };

  const adminAddVoucher = (voucher: Voucher) => {
    setVouchers((prev) => {
      const exists = prev.some((v) => v.code.toUpperCase() === voucher.code.toUpperCase());
      if (exists) {
        showToast(`Mã voucher ${voucher.code} đã tồn tại!`, 'error');
        return prev;
      }
      showToast(`Đã thêm mã ưu đãi ${voucher.code} thành công`, 'success');
      return [voucher, ...prev];
    });
  };

  const adminDeleteVoucher = (code: string) => {
    setVouchers((prev) => prev.filter((v) => v.code !== code));
    showToast(`Đã xóa mã voucher ${code}`, 'info');
  };

  const adminAddCategory = (catData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Đã thêm danh mục "${newCat.name}" thành công`, 'success');
  };

  const adminUpdateCategory = (catId: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, ...updates } : c))
    );
    showToast('Cập nhật thông tin danh mục thành công', 'success');
  };

  const adminDeleteCategory = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    showToast(`Đã xóa danh mục "${cat?.name || ''}"`, 'info');
  };

  const adminAdjustUserWallet = (userId: string, amount: number, note: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newBal = Math.max(0, (u.walletBalance || 0) + amount);
          const updatedUser = { ...u, walletBalance: newBal };
          if (currentUser && currentUser.id === userId) {
            setCurrentUser(updatedUser);
            localStorage.setItem('eatnow_auth_user', JSON.stringify(updatedUser));
          }
          return updatedUser;
        }
        return u;
      })
    );

    const targetUser = users.find((u) => u.id === userId);
    const newTx: WalletTransaction = {
      id: `tx-admin-${Date.now()}`,
      userId,
      type: amount >= 0 ? 'deposit' : 'payment',
      amount: Math.abs(amount),
      timestamp: new Date().toISOString(),
      description: `Admin điều chỉnh: ${note || 'Nạp ví trực tiếp'} (${amount >= 0 ? '+' : '-'}${Math.abs(amount).toLocaleString('vi-VN')}₫)`,
      status: 'success',
    };
    setTransactions((prev) => [newTx, ...prev]);

    showToast(
      `Đã ${amount >= 0 ? 'cộng' : 'trừ'} ${Math.abs(amount).toLocaleString('vi-VN')}₫ cho ${targetUser?.name || 'người dùng'}.`,
      'success'
    );
  };

  const adminUpdateUserRole = (userId: string, newRole: Role) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, role: newRole };
          if (currentUser && currentUser.id === userId) {
            setCurrentUser(updated);
            localStorage.setItem('eatnow_auth_user', JSON.stringify(updated));
          }
          return updated;
        }
        return u;
      })
    );
    showToast(`Đã cập nhật vai trò người dùng thành: ${newRole}`, 'success');
  };

  const adminResetUserPassword = (userId: string, newPassword = '123456') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, password: newPassword } : u))
    );
    showToast(`Đã đặt lại mật khẩu về mặc định: ${newPassword}`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        role: currentUser?.role ?? null,
        isAuthenticated: !!currentUser,
        switchRole,
        categories,
        foods,
        cart,
        orders,
        transactions,
        reviews,
        pickupSlots: AVAILABLE_PICKUP_SLOTS,

        searchQuery,
        setSearchQuery,
        selectedCategoryId,
        setSelectedCategoryId,
        inStockOnly,
        setInStockOnly,
        sortBy,
        setSortBy,
        priceFilter,
        setPriceFilter,
        healthyOnly,
        setHealthyOnly,

        isCartOpen,
        setIsCartOpen,
        isWalletModalOpen,
        setIsWalletModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        selectedFood,
        setSelectedFood,
        selectedOrderForDetail,
        setSelectedOrderForDetail,
        receiptOrder,
        setReceiptOrder,
        reviewingOrder,
        setReviewingOrder,
        activeNavTab,
        setActiveNavTab,

        vouchers,
        appliedVoucher,
        applyVoucher,
        removeVoucher,
        voucherDiscount,
        diningOption,
        setDiningOption,
        tableNumber,
        setTableNumber,

        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        finalCartTotal,
        cartItemCount,

        createOrder,
        cancelOrder,
        updateOrderStatus,

        depositWallet,
        addReview,
        updateUserProfile,

        switchUser,
        loginUser,
        quickLoginDemoUser,
        registerUser,
        logoutUser,

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

        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
