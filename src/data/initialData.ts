import { User, Product, StoreSettings, Ad, Order, FinancialTransaction } from '../types';

// الحساب الوحيد المعتمد في النظام: حساب الإدارة العامة الحقيقي
export const INITIAL_ADMIN: User = {
  id: 'usr_admin_1',
  name: 'محمود عمران (الإدارة العامة)',
  phone: '01099887766',
  email: 'mahmoudomran324@gmail.com',
  password: 'Aa&9119045',
  role: 'admin',
  address: {
    governorate: 'القاهرة',
    cityOrDistrict: 'المعادي',
    street: 'شارع النصر',
    building: 'عمارة 14 - الدور 4',
    landmark: 'بجوار محطة المترو'
  },
  createdAt: '2026-01-01T10:00:00.000Z'
};

// تم حذف جميع المتاجر والحسابات الوهمية - فقط الإدارة الحقيقية
export const INITIAL_USERS: User[] = [INITIAL_ADMIN];

// مصفوفة المنتجات فارغة تماماً - لا تظهر إلا البضائع المرفوعة فعلياً من التجار الحقيقيين أو الإدارة
export const INITIAL_PRODUCTS: Product[] = [];

// مصفوفة الإعلانات والطلبات والمعاملات خالية من أي بيانات وهمية
export const INITIAL_ADS: Ad[] = [];
export const INITIAL_ORDERS: Order[] = [];
export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'متجر بلدي - أحلى بقالة',
  storeSubtitle: 'للخضار والفاكهة والبقوليات والجبن والمجففات من خير مزارعنا',
  storeLogo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
  instapayAccount: 'baladi@instapay',
  vodafoneCashNumber: '01099887766',
  deliveryFee: 20,
  platformCommissionRate: 5,
  isCaptainSystemEnabled: false,
  supportWhatsApp: '+201099887766',
  termsContent: `ميثاق الجودة وسياسة الاسترجاع في منصة متجر بلدي:
1. الجودة خط أحمر: نتعهد بتوفير خضار وفاكهة ومنتجات فرز أول طازجة بالكامل.
2. التحذير الصارم من البضاعة التالفة: يمنع منعاً باتاً عرض أو شحن أي منتجات غير مطابقة للجودة أو تالفة.
3. الاسترجاع الفوري المجاني: في حال وصول أي صنف غير مطابق أو غير طازج، يحق للعميل استرجاعه فوراً واسترداد قيمته كاملة بدون أي رسوم شحن إضافية.
4. مسؤولية التاجر: يتحمل التاجر المسؤولية الكاملة وتكلفة الاسترجاع عند إرسال أي بضاعة تالفة مع تعرض حسابه للحظر الفوري.`,
  qualityCharter: `نحن في "متجر بلدي" نضمن لك سلامة ونظافة المحصول من شجرة الفلاح وحتى باب منزلك مع ضمان استرداد فوري للأموال.`,
  whatsappTemplates: {
    banTrader: `السلام عليكم أخي التاجر {trader_name}،
تم إيقاف متجرك مؤقتاً على منصة متجر بلدي للسبب الآتي:
{reason}
الخطوات المطلوبة لحل المشكلة وتفعيل الحساب:
{resolution_steps}
يرجى التواصل معنا لتسوية الوضع فوراً. إدارة متجر بلدي.`,
    driverAssigned: `مرحباً بك عميلنا العزيز {customer_name}!
طلبك رقم #{order_number} جاري توصيله الآن 🛵
المندوب اتحرك، اسمه: {driver_name}
وتليفونه للتواصل المباشر: {driver_phone}
شكراً لثقتك في متجر بلدي!`,
    orderReturned: `إشعار استرجاع بضاعة:
بخصوص الطلب #{order_number} للتاجر {trader_name}.
تم تسجيل استرجاع منتجات تالفة وتم قيد المبلغ كاملاً في حساب العميل وتحميل القيمة على حساب التاجر وفق ميثاق الجودة.`,
    passwordReset: `السلام عليكم {user_name}،
بناءً على طلبك لاستعادة كلمة المرور في متجر بلدي، بيانات دخولك هي:
البريد الإلكتروني: {email}
كلمة المرور المؤقتة: {password}
رابط الدخول: {store_url}`
  }
};

// قوالب بضائع حقيقية جاهزة للاستخدام السريع من الإدارة والتجار لرفعها فوراً
export const REAL_GROCERY_CATALOG = [
  {
    name: 'طماطم بلدي فرز أول (صلصة وسلطة)',
    category: 'vegetables' as const,
    price: 18,
    discountPrice: 15,
    unit: 'كيلو',
    stockQuantity: 150,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    description: 'طماطم طازجة حمراء متماسكة فرز أول قطفة صباحية من الحقل مباشرة.'
  },
  {
    name: 'بطاطس تحمير سيلانا ذهبية',
    category: 'vegetables' as const,
    price: 22,
    discountPrice: 20,
    unit: 'كيلو',
    stockQuantity: 200,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    description: 'بطاطس رملية عالية الجودة للقلي المقرمش والطبخ المنزلي.'
  },
  {
    name: 'خيار بلدي مزارع نقي مقرمش',
    category: 'vegetables' as const,
    price: 20,
    discountPrice: 18,
    unit: 'كيلو',
    stockQuantity: 100,
    image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=600&q=80',
    description: 'خيار بلدي طازج صغير ومقرمش ممتاز للسلطات وللأكل المباشر.'
  },
  {
    name: 'بصل أحمر بلدي ناشف',
    category: 'vegetables' as const,
    price: 25,
    discountPrice: 22,
    unit: 'كيلو',
    stockQuantity: 180,
    image: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80',
    description: 'بصل أحمر بلدي عالي التحمل ونظيف ومناسب لجميع الأكلات.'
  },
  {
    name: 'تفاح مصري سكري فاخر',
    category: 'fruits' as const,
    price: 45,
    discountPrice: 40,
    unit: 'كيلو',
    stockQuantity: 90,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    description: 'تفاح سكري بلدي طازج حلو المذاق خالي من أي متبقيات.'
  },
  {
    name: 'برتقال بلدي عصير طازج',
    category: 'fruits' as const,
    price: 18,
    discountPrice: 15,
    unit: 'كيلو',
    stockQuantity: 120,
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80',
    description: 'برتقال بلدي مليء بالعصير غني بفيتامين سي منعش ولذيذ.'
  },
  {
    name: 'جبنة قريش فلاحي طازجة خفيفة الملح',
    category: 'dairy' as const,
    price: 95,
    discountPrice: 90,
    unit: 'كيلو',
    stockQuantity: 50,
    image: 'https://images.unsplash.com/photo-1528751014936-863e6e7a319c?auto=format&fit=crop&w=600&q=80',
    description: 'جبنة قريش طبيعية 100% معمولة بلبن بقري وجاموسي صافي وصحية للغاية.'
  },
  {
    name: 'أرز مصري عريض الحبة فاخر',
    category: 'legumes' as const,
    price: 34,
    discountPrice: 32,
    unit: 'كيس (1 كجم)',
    stockQuantity: 250,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    description: 'أرز مصري منقى ومعبأ آلياً خالي من الشوائب وممتاز للأكلات اليومية.'
  },
  {
    name: 'فول تدميس بلدي مزارع',
    category: 'legumes' as const,
    price: 48,
    discountPrice: 44,
    unit: 'كيلو',
    stockQuantity: 110,
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=600&q=80',
    description: 'فول بلدي سريع السواء يخرج كهرمان ناعم وشهي للإفطار.'
  },
  {
    name: 'كمون بلدي حب ومطحون نقي',
    category: 'spices_dried' as const,
    price: 60,
    discountPrice: 55,
    unit: 'برطمان (250 جم)',
    stockQuantity: 80,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    description: 'كمون طبيعي ذو رائحة نفاذة بدون أي إضافات أو أتربة.'
  }
];
