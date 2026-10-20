export type UserRole = 'admin' | 'supervisor' | 'trader' | 'customer' | 'driver';

export interface UserAddress {
  governorate: string;
  cityOrDistrict: string;
  street: string;
  building?: string;
  landmark?: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  role: UserRole;
  storeName?: string;
  storeCategory?: string;
  storeLogo?: string;
  storeStatus?: 'active' | 'suspended';
  balance?: number;
  address?: UserAddress;
  createdAt: string;
}

export type ProductCategory = 
  | 'vegetables'      // خضروات طازجة
  | 'fruits'          // فواكه موسمية
  | 'dairy'           // ألبان وأجبان بلدي
  | 'legumes'         // بقوليات وحبوب
  | 'spices_dried'    // عطارة ومجففات
  | 'poultry_meat'    // دواجن ولحوم طازجة
  | 'pantry_canned';  // معلبات ومؤن منزلية

export interface Product {
  id: string;
  traderId: string;
  traderName: string;
  name: string;
  category: ProductCategory;
  price: number;
  discountPrice?: number;
  unit: string; // كيلو, نصف كيلو, كيس, عبوة, قطعة, كرتونة
  stockQuantity: number;
  isAvailable: boolean;
  image: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  traderId: string;
  traderName: string;
  price: number;
  quantity: number;
  unit: string;
  image?: string;
}

export type OrderStatus = 
  | 'new'          // طلب جديد - يصدر تنبيهاً صوتياً
  | 'preparing'    // جاري التجهيز
  | 'on_the_way'   // جاري التوصيل مع المندوب
  | 'delivered'    // تم التسليم بنجاح
  | 'cancelled'    // تم الإلغاء
  | 'returned';    // مرتجع بسبب الجودة

export type PaymentMethod = 'cod' | 'instapay' | 'vodafone_cash';

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  byUser?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: UserAddress;
  traderIds: string[];
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentProofImage?: string;
  notes?: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedDriverPhone?: string;
  createdAt: string;
  updatedAt: string;
  timeline: OrderTimelineEvent[];
}

export interface StoreSettings {
  storeName: string;
  storeSubtitle: string;
  storeLogo: string;
  instapayAccount: string;
  vodafoneCashNumber: string;
  deliveryFee: number;
  platformCommissionRate: number; // e.g. 5%
  isCaptainSystemEnabled: boolean;
  supportWhatsApp: string;
  termsContent: string;
  qualityCharter: string;
  whatsappTemplates: {
    banTrader: string;
    driverAssigned: string;
    orderReturned: string;
    passwordReset: string;
  };
}

export interface Ad {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  badge?: string;
  active: boolean;
}

export interface FinancialTransaction {
  id: string;
  traderId: string;
  traderName?: string;
  type: 'sale' | 'commission' | 'payout' | 'refund';
  amount: number;
  date: string;
  description: string;
  orderId?: string;
}
