import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { User, Product, Order, StoreSettings, OrderItem, Ad, FinancialTransaction, OrderStatus, PaymentMethod } from '../types';
import { INITIAL_ADMIN, INITIAL_USERS, INITIAL_PRODUCTS, INITIAL_SETTINGS, REAL_GROCERY_CATALOG } from '../data/initialData';
import { audioAlert } from '../utils/audioAlert';

const STORAGE_KEY_PREFIX = 'baladi_store_v5_';
const STORAGE_VER = 'v5.1';

// تنظيف آلي فوري لأي مخلفات كاش وهمية قديمة
try {
  if (typeof window !== 'undefined') {
    const currentVer = localStorage.getItem('baladi_store_active_ver');
    if (currentVer !== STORAGE_VER) {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('baladi_store_') || k.startsWith('store_') || k.startsWith('mock_'))) {
          if (!k.startsWith(STORAGE_KEY_PREFIX)) {
            keysToRemove.push(k);
          }
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      localStorage.setItem('baladi_store_active_ver', STORAGE_VER);
    }
  }
} catch (e) {
  console.warn('Storage purge notice:', e);
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save ${key} to localStorage:`, err);
  }
}

interface CartItem extends OrderItem {}

interface StoreContextType {
  currentUser: User | null;
  users: User[];
  products: Product[];
  orders: Order[];
  settings: StoreSettings;
  cart: CartItem[];
  cartSubtotal: number;
  cartTotal: number;
  cartCount: number;
  
  // تصفية المتجر والبحث
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedTraderId: string;
  setSelectedTraderId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // تنبيهات الصوت
  isSirenRinging: boolean;
  activeAlertOrder: Order | null;
  stopSirenAlert: () => void;
  testAudioAlert: () => Promise<void>;

  // دوال الحسابات
  login: (emailOrPhone: string, password?: string) => { success: boolean; message: string };
  logout: () => void;
  setCurrentUserDirect: (user: User | null) => void;
  registerTrader: (data: { name: string; phone: string; email: string; storeName: string; storeCategory: string; governorate: string; city: string; street: string }) => { success: boolean; message: string };
  registerCustomer: (data: { name: string; phone: string; email: string; governorate: string; city: string; street: string; building?: string }) => { success: boolean; message: string };
  toggleTraderStatus: (traderId: string) => void;
  addTraderByAdmin: (data: Partial<User>) => void;

  // دوال البضائع
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductAvailability: (id: string) => void;
  seedRealProduceSamples: (targetTraderId?: string) => void;

  // دوال السلة والطلبات
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  createOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    address: { governorate: string; cityOrDistrict: string; street: string; building?: string; landmark?: string };
    paymentMethod: PaymentMethod;
    paymentProofImage?: string;
    notes?: string;
  }) => Promise<{ success: boolean; order?: Order; message: string }>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  
  // دوال الإعدادات
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  
  // المتاجر الحقيقية المسجلة
  realTraders: User[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => loadFromStorage<User[]>('users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = loadFromStorage<User | null>('currentUser', null);
    // إذا لم يكن هناك مستخدم مسجل مسبقاً، لا نجبره على زائر بل نتركه حراً
    return saved;
  });
  
  const [products, setProducts] = useState<Product[]>(() => loadFromStorage<Product[]>('products', INITIAL_PRODUCTS));
  const [orders, setOrders] = useState<Order[]>(() => loadFromStorage<Order[]>('orders', []));
  const [settings, setSettings] = useState<StoreSettings>(() => loadFromStorage<StoreSettings>('settings', INITIAL_SETTINGS));
  const [cart, setCart] = useState<CartItem[]>(() => loadFromStorage<CartItem[]>('cart', []));

  // حالات الفلترة والبحث
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTraderId, setSelectedTraderId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // حالات التنبيه الصوتي الحقيقي
  const [isSirenRinging, setIsSirenRinging] = useState(false);
  const [activeAlertOrder, setActiveAlertOrder] = useState<Order | null>(null);

  // قناة البث اللحظي عبر النوافذ المفتوحة
  const broadcastChannel = useMemo(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        return new BroadcastChannel('baladi_live_orders_v5');
      } catch {
        return null;
      }
    }
    return null;
  }, []);

  // حفظ التغييرات في localStorage
  useEffect(() => saveToStorage('users', users), [users]);
  useEffect(() => saveToStorage('currentUser', currentUser), [currentUser]);
  useEffect(() => saveToStorage('products', products), [products]);
  useEffect(() => saveToStorage('orders', orders), [orders]);
  useEffect(() => saveToStorage('settings', settings), [settings]);
  useEffect(() => saveToStorage('cart', cart), [cart]);

  // إيقاف التنبيه الصوتي
  const stopSirenAlert = useCallback(() => {
    audioAlert.stop();
    setIsSirenRinging(false);
    setActiveAlertOrder(null);
  }, []);

  // تجربة صوت التنبيه
  const testAudioAlert = useCallback(async () => {
    await audioAlert.testSiren();
  }, []);

  // الاستماع للطلبات الجديدة الواردة عبر النوافذ أو من نفس النافذة
  useEffect(() => {
    if (!broadcastChannel) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'NEW_ORDER') {
        const order: Order = event.data.order;
        
        // تحديث الطلبات محلياً
        setOrders(prev => {
          if (prev.some(o => o.id === order.id)) return prev;
          return [order, ...prev];
        });

        // تشغيل صفارة الإنذار إذا كان المستخدم الحالي تاجراً يخصه هذا الطلب أو الإدارة/المشرف
        const isTraderForOrder = currentUser?.role === 'trader' && order.traderIds?.includes(currentUser.id);
        const isStaff = currentUser?.role === 'admin' || currentUser?.role === 'supervisor';

        if (isTraderForOrder || isStaff) {
          audioAlert.start(`طلب جديد #${order.orderNumber}`);
          setIsSirenRinging(true);
          setActiveAlertOrder(order);
        }
      } else if (event.data?.type === 'STOP_SIREN') {
        stopSirenAlert();
      }
    };

    broadcastChannel.addEventListener('message', handleMessage);
    return () => {
      broadcastChannel.removeEventListener('message', handleMessage);
    };
  }, [broadcastChannel, currentUser, stopSirenAlert]);

  // قائمة التجار الحقيقيين المسجلين في النظام
  const realTraders = useMemo(() => {
    return users.filter(u => u.role === 'trader');
  }, [users]);

  // تسجيل الدخول
  const login = useCallback((emailOrPhone: string, password?: string) => {
    const cleanTarget = emailOrPhone.trim().toLowerCase();
    const user = users.find(u => 
      (u.email.toLowerCase() === cleanTarget || u.phone.trim() === cleanTarget) &&
      (!password || u.password === password)
    );

    if (user) {
      if (user.role === 'trader' && user.storeStatus === 'suspended') {
        return { success: false, message: 'عذراً، هذا المتجر موقوف حالياً من قِبل إدارة المنصة.' };
      }
      setCurrentUser(user);
      audioAlert.playChime();
      return { success: true, message: `أهلاً بك يا ${user.name}!` };
    }

    return { success: false, message: 'البريد الإلكتروني/رقم الهاتف أو كلمة المرور غير صحيحة.' };
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    stopSirenAlert();
  }, [stopSirenAlert]);

  const setCurrentUserDirect = useCallback((user: User | null) => {
    setCurrentUser(user);
  }, []);

  // تسجيل تاجر جديد حقيقي
  const registerTrader = useCallback((data: {
    name: string;
    phone: string;
    email: string;
    storeName: string;
    storeCategory: string;
    governorate: string;
    city: string;
    street: string;
  }) => {
    const existing = users.find(u => u.email.toLowerCase() === data.email.toLowerCase() || u.phone === data.phone);
    if (existing) {
      return { success: false, message: 'البريد الإلكتروني أو رقم الهاتف مسجل بالفعل مسبقاً.' };
    }

    const newTrader: User = {
      id: 'usr_trader_' + Date.now(),
      name: data.name,
      phone: data.phone,
      email: data.email,
      password: '123456', // افتراضي
      role: 'trader',
      storeName: data.storeName,
      storeCategory: data.storeCategory,
      storeStatus: 'active',
      balance: 0,
      address: {
        governorate: data.governorate,
        cityOrDistrict: data.city,
        street: data.street,
      },
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newTrader]);
    setCurrentUser(newTrader);
    audioAlert.playChime();
    return { success: true, message: `تم تفعيل متجر "${data.storeName}" بنجاح!` };
  }, [users]);

  // تسجيل عميل حقيقي
  const registerCustomer = useCallback((data: {
    name: string;
    phone: string;
    email: string;
    governorate: string;
    city: string;
    street: string;
    building?: string;
  }) => {
    const existing = users.find(u => u.phone === data.phone);
    if (existing) {
      setCurrentUser(existing);
      return { success: true, message: `أهلاً بعودتك يا ${existing.name}!` };
    }

    const newCustomer: User = {
      id: 'usr_cust_' + Date.now(),
      name: data.name,
      phone: data.phone,
      email: data.email || `${data.phone}@baladi.local`,
      role: 'customer',
      balance: 0,
      address: {
        governorate: data.governorate,
        cityOrDistrict: data.city,
        street: data.street,
        building: data.building
      },
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newCustomer]);
    setCurrentUser(newCustomer);
    audioAlert.playChime();
    return { success: true, message: `تم تسجيل حسابك بنجاح!` };
  }, [users]);

  // إيقاف أو تفعيل تاجر
  const toggleTraderStatus = useCallback((traderId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === traderId) {
        const nextStatus = u.storeStatus === 'suspended' ? 'active' : 'suspended';
        return { ...u, storeStatus: nextStatus };
      }
      return u;
    }));
  }, []);

  // إضافة تاجر بواسطة الإدارة
  const addTraderByAdmin = useCallback((data: Partial<User>) => {
    const newTrader: User = {
      id: 'usr_trader_' + Date.now(),
      name: data.name || 'تاجر جديد',
      phone: data.phone || '01000000000',
      email: data.email || `trader_${Date.now()}@baladi.com`,
      password: data.password || '123456',
      role: 'trader',
      storeName: data.storeName || 'متجر بلدي',
      storeCategory: data.storeCategory || 'خضروات وفواكه',
      storeStatus: 'active',
      balance: 0,
      address: data.address || {
        governorate: 'القاهرة',
        cityOrDistrict: 'المعادي',
        street: 'شارع السوق'
      },
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newTrader]);
    audioAlert.playChime();
  }, []);

  // إضافة بضاعة حقيقية
  const addProduct = useCallback((productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts(prev => [newProduct, ...prev]);
    audioAlert.playChime();
  }, []);

  // تعديل بضاعة
  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));
  }, []);

  // حذف بضاعة
  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  // تبديل توفر الصنف (في المخزن / نفذت الكمية)
  const toggleProductAvailability = useCallback((id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, isAvailable: !p.isAvailable };
      }
      return p;
    }));
  }, []);

  // زر سريع لرفع عينات أصناف حقيقية طازجة للمتجر
  const seedRealProduceSamples = useCallback((targetTraderId?: string) => {
    const trader = users.find(u => u.id === targetTraderId) || users.find(u => u.role === 'trader') || INITIAL_ADMIN;
    
    const sampleProducts: Product[] = REAL_GROCERY_CATALOG.map((item, idx) => ({
      id: `prod_seed_${Date.now()}_${idx}`,
      traderId: trader.id,
      traderName: trader.storeName || trader.name,
      name: item.name,
      category: item.category,
      price: item.price,
      discountPrice: item.discountPrice,
      unit: item.unit,
      stockQuantity: item.stockQuantity,
      isAvailable: true,
      image: item.image,
      description: item.description,
      createdAt: new Date().toISOString()
    }));

    setProducts(prev => [...sampleProducts, ...prev]);
    audioAlert.playChime();
  }, [users]);

  // إدارة السلة
  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, {
        productId: product.id,
        productName: product.name,
        traderId: product.traderId,
        traderName: product.traderName,
        price: product.discountPrice ?? product.price,
        quantity,
        unit: product.unit,
        image: product.image
      }];
    });
    audioAlert.playChime();
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.productId !== productId));
    } else {
      setCart(prev => prev.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      ));
    }
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // حساب الإجماليات
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    if (cart.length === 0) return 0;
    return cartSubtotal + (settings.deliveryFee || 20);
  }, [cart, cartSubtotal, settings.deliveryFee]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // إنشاء وتأكيد الطلب الفعلي
  const createOrder = useCallback(async (orderData: {
    customerName: string;
    customerPhone: string;
    address: { governorate: string; cityOrDistrict: string; street: string; building?: string; landmark?: string };
    paymentMethod: PaymentMethod;
    paymentProofImage?: string;
    notes?: string;
  }) => {
    if (cart.length === 0) {
      return { success: false, message: 'السلة فارغة، يرجى اختيار بعض المنتجات أولاً.' };
    }

    // استخراج كافة معرفات التجار أصحاب المنتجات المطلوبة
    const uniqueTraderIds = Array.from(new Set(cart.map(item => item.traderId)));
    const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();

    const newOrder: Order = {
      id: 'ord_' + Date.now(),
      orderNumber,
      customerId: currentUser?.id || 'cust_guest_' + Date.now(),
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerAddress: orderData.address,
      traderIds: uniqueTraderIds,
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee: settings.deliveryFee || 20,
      total: cartTotal,
      status: 'new',
      paymentMethod: orderData.paymentMethod,
      paymentProofImage: orderData.paymentProofImage,
      notes: orderData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          status: 'new',
          timestamp: new Date().toISOString(),
          note: 'تم إرسال الطلب من قِبل العميل بنجاح وتم إطلاق صفارة التنبيه للتاجر والإدارة.'
        }
      ]
    };

    // حفظ الطلب في مصفوفة الطلبات
    setOrders(prev => [newOrder, ...prev]);

    // تفريغ السلة
    clearCart();

    // إرسال إشعار لحظي عبر BroadcastChannel لجميع النوافذ وشاشات التجار المفتوحة
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'NEW_ORDER', order: newOrder });
    }

    // تشغيل صفارة الإنذار فوراً إذا كان المستخدم الحالي في نفس النافذة مسؤولاً أو تاجراً
    const isTrader = currentUser?.role === 'trader' && uniqueTraderIds.includes(currentUser.id);
    const isStaff = currentUser?.role === 'admin' || currentUser?.role === 'supervisor';
    if (isTrader || isStaff) {
      audioAlert.start(`طلب جديد #${newOrder.orderNumber}`);
      setIsSirenRinging(true);
      setActiveAlertOrder(newOrder);
    }

    return { success: true, order: newOrder, message: `تم تأكيد طلبك رقم #${orderNumber} بنجاح!` };
  }, [cart, cartSubtotal, cartTotal, settings.deliveryFee, currentUser, broadcastChannel, clearCart]);

  // تحديث حالة الطلب
  const updateOrderStatus = useCallback((orderId: string, newStatus: OrderStatus, note?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        // إيقاف التنبيه الصوتي إذا تحول الطلب من جديد إلى جاري التجهيز
        if (o.status === 'new' && newStatus !== 'new') {
          stopSirenAlert();
          if (broadcastChannel) {
            broadcastChannel.postMessage({ type: 'STOP_SIREN' });
          }
        }

        const newTimelineEvent = {
          status: newStatus,
          timestamp: new Date().toISOString(),
          note: note || `تغيرت حالة الطلب إلى: ${newStatus}`,
          byUser: currentUser?.name
        };

        return {
          ...o,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          timeline: [...o.timeline, newTimelineEvent]
        };
      }
      return o;
    }));
  }, [currentUser, stopSirenAlert, broadcastChannel]);

  // تحديث إعدادات المتجر
  const updateSettings = useCallback((newSettings: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const value = useMemo(() => ({
    currentUser,
    users,
    products,
    orders,
    settings,
    cart,
    cartSubtotal,
    cartTotal,
    cartCount,
    selectedCategory,
    setSelectedCategory,
    selectedTraderId,
    setSelectedTraderId,
    searchQuery,
    setSearchQuery,
    isSirenRinging,
    activeAlertOrder,
    stopSirenAlert,
    testAudioAlert,
    login,
    logout,
    setCurrentUserDirect,
    registerTrader,
    registerCustomer,
    toggleTraderStatus,
    addTraderByAdmin,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    seedRealProduceSamples,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    createOrder,
    updateOrderStatus,
    updateSettings,
    realTraders
  }), [
    currentUser,
    users,
    products,
    orders,
    settings,
    cart,
    cartSubtotal,
    cartTotal,
    cartCount,
    selectedCategory,
    selectedTraderId,
    searchQuery,
    isSirenRinging,
    activeAlertOrder,
    stopSirenAlert,
    testAudioAlert,
    login,
    logout,
    setCurrentUserDirect,
    registerTrader,
    registerCustomer,
    toggleTraderStatus,
    addTraderByAdmin,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    seedRealProduceSamples,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    createOrder,
    updateOrderStatus,
    updateSettings,
    realTraders
  ]);

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
