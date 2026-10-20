export type Role = 'customer' | 'lecturer' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  mssv?: string;
  email: string;
  phone: string;
  password?: string;
  role: Role;
  walletBalance: number;
  avatar?: string;
  className?: string; // Lớp / Khoa
  department?: string; // Bộ phận
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface NutritionFacts {
  calories: number; // in kcal
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  fiber?: number; // in grams
  sodiumMg?: number; // in mg
}

export interface FoodItem {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  isAvailable: boolean;
  stockQuantity: number;
  prepTimeMinutes: number;
  rating: number;
  reviewCount: number;
  calories?: number;
  nutrition?: NutritionFacts;
  allergens?: string[];
  dietaryTags?: string[];
  tags: string[];
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
  note?: string;
}

export type OrderStatus = 
  | 'pending_payment'
  | 'paid_pending_confirm'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
  image: string;
}

export interface Voucher {
  code: string;
  title: string;
  description: string;
  discountType: 'fixed' | 'percent';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
}

export interface Order {
  id: string;
  orderCode: string; // e.g. EN-9182
  userId: string;
  userName: string;
  userPhone: string;
  userClass?: string;
  items: OrderItem[];
  totalAmount: number;
  pickupTimeSlot: string; // e.g. '11:30 - 11:45'
  diningOption?: 'dine_in' | 'takeaway';
  tableNumber?: string;
  voucherCode?: string;
  discountAmount?: number;
  status: OrderStatus;
  cancelReason?: string;
  createdAt: string;
  completedAt?: string;
  paymentMethod: 'wallet' | 'cod';
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
  rating?: number;
  reviewComment?: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  orderId?: string;
  orderCode?: string;
  type: 'deposit' | 'payment' | 'refund';
  amount: number;
  timestamp: string;
  description: string;
  status: 'success';
}

export interface Review {
  id: string;
  foodId: string;
  foodName: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
