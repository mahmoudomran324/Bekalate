import React from 'react';
import { useStore } from '../context/StoreContext';
import { Product, ProductCategory } from '../types';
import { 
  Search, 
  Store, 
  Sparkles, 
  ShieldCheck, 
  Plus, 
  Minus, 
  ShoppingBag, 
  AlertCircle,
  Truck,
  Leaf,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface CustomerStorefrontProps {
  onOpenCart: () => void;
  onOpenQuality: () => void;
  onGoToMerchantTab: () => void;
}

const CATEGORIES: { id: string; label: string; icon: string }[] = [
  { id: 'all', label: 'الكل', icon: '🌾' },
  { id: 'vegetables', label: 'خضروات طازجة', icon: '🥬' },
  { id: 'fruits', label: 'فواكه موسمية', icon: '🍎' },
  { id: 'dairy', label: 'ألبان وأجبان بلدي', icon: '🧀' },
  { id: 'legumes', label: 'بقوليات وحبوب', icon: '🌾' },
  { id: 'spices_dried', label: 'عطارة ومجففات', icon: '🌶️' },
  { id: 'poultry_meat', label: 'دواجن ولحوم', icon: '🥩' },
  { id: 'pantry_canned', label: 'معلبات ومؤن', icon: '🥫' }
];

export const CustomerStorefront: React.FC<CustomerStorefrontProps> = ({
  onOpenCart,
  onOpenQuality,
  onGoToMerchantTab
}) => {
  const { 
    products, 
    realTraders, 
    selectedCategory, 
    setSelectedCategory, 
    selectedTraderId, 
    setSelectedTraderId,
    searchQuery,
    setSearchQuery,
    addToCart,
    cart,
    currentUser,
    seedRealProduceSamples,
    settings
  } = useStore();

  // تصفية المنتجات حسب التصنيف، المتجر، والبحث
  const filteredProducts = products.filter(p => {
    // تصفية التصنيف
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }
    // تصفية المتجر
    if (selectedTraderId !== 'all' && p.traderId !== selectedTraderId) {
      return false;
    }
    // البحث بالاسم أو الوصف
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      const matchTrader = p.traderName.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchTrader) return false;
    }
    return true;
  });

  const getCartQuantity = (productId: string) => {
    const item = cart.find(c => c.productId === productId);
    return item ? item.quantity : 0;
  };

  const isStaffOrTrader = currentUser?.role === 'admin' || currentUser?.role === 'supervisor' || currentUser?.role === 'trader';

  return (
    <div className="space-y-8 pb-16">
      
      {/* البانر الترحيبي وضمان الجودة */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
        <div className="relative max-w-5xl mx-auto px-6 py-10 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-right space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-emerald-200">
              <Sparkles className="w-4 h-4 text-amber-300" />
              مباشرة من خير مزارعنا وتجارنا الحقيقيين
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {settings.storeName || 'متجر بلدي - أحلى بقالة'}
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              {settings.storeSubtitle || 'نوفر لك خضار، فاكهة، بقوليات، وأجبان طبيعية مع ضمان استرجاع فوري مجاني وتوصيل سريع لباب بيتك.'}
            </p>
            
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold">
              <span className="flex items-center gap-1.5 bg-emerald-900/60 px-3 py-1.5 rounded-lg border border-emerald-600/40">
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                ميثاق فرز أول مضمون
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-900/60 px-3 py-1.5 rounded-lg border border-emerald-600/40">
                <Truck className="w-4 h-4 text-emerald-300" />
                توصيل سريع ({settings.deliveryFee || 20} ج.م)
              </span>
              <button 
                onClick={onOpenQuality}
                className="underline text-amber-300 hover:text-white transition"
              >
                قراءة شروط وسياسة الجودة &larr;
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-2xl text-center shadow-inner">
              <p className="text-xs text-emerald-200">المتاجر المعتمدة النشطة</p>
              <p className="text-3xl font-black text-amber-300 mt-1">
                {realTraders.length > 0 ? realTraders.length : 1}
              </p>
              <p className="text-[11px] text-white/80 mt-1">متاجر حقيقية مسجلة</p>
            </div>

            <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-2xl text-center shadow-inner">
              <p className="text-xs text-emerald-200">إجمالي البضائع الحية</p>
              <p className="text-3xl font-black text-white mt-1">
                {products.length}
              </p>
              <p className="text-[11px] text-white/80 mt-1">صنف متوفر للطلب الآن</p>
            </div>
          </div>
        </div>
      </section>

      {/* قسم البحث واختيار المتجر والتصنيفات */}
      <section className="space-y-4">
        
        {/* شريط البحث وتحديد المتجر الحقيقي */}
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* حقل البحث */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن طماطم، تفاح، بطاطس، جبنة، أرز، اسم التاجر..."
              className="w-full bg-white border border-stone-200 rounded-2xl pr-11 pl-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden shadow-xs transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs bg-stone-100 hover:bg-stone-200 text-stone-600 px-2 py-1 rounded-md"
              >
                مسح
              </button>
            )}
          </div>

          {/* محدد المتجر */}
          <div className="sm:w-72 relative">
            <Store className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none" />
            <select
              value={selectedTraderId}
              onChange={(e) => setSelectedTraderId(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-2xl pr-11 pl-4 py-3 text-sm font-bold text-stone-800 focus:ring-2 focus:ring-emerald-500 outline-hidden shadow-xs appearance-none cursor-pointer"
            >
              <option value="all">جميع المتاجر الحقيقية ({realTraders.length})</option>
              {realTraders.map(trader => (
                <option key={trader.id} value={trader.id}>
                  {trader.storeName || trader.name} ({trader.address?.cityOrDistrict || 'الرئيسي'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* أزرار التصنيفات الأفقية */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer shadow-xs ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-emerald-700/20 scale-102'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* تنبيه إذا كانت قاعدة البيانات فارغة تماماً مع زر سريع للمشرف أو التاجر */}
      {products.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl mx-auto flex items-center justify-center">
            <Leaf className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-lg font-black text-amber-900">
              قاعدة البيانات نظيفة وجاهزة لرفع البضائع الحقيقية!
            </h3>
            <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
              تم حذف كافة الحسابات والمتاجر الوهمية بنجاح كما طلبت. حالياً لا توجد بضائع مرفوعة حتى يقوم التاجر الحقيقي أو المشرف برفعها.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => seedRealProduceSamples()}
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              رفع عينات بضائع بلدية حقيقية للمتجر فوراً (خضار، فاكهة، جبن)
            </button>

            {isStaffOrTrader && (
              <button
                onClick={onGoToMerchantTab}
                className="bg-stone-800 hover:bg-stone-900 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                رفع صنف حقيقي جديد يدوياً
              </button>
            )}
          </div>
        </div>
      )}

      {/* شبكة عرض البضائع */}
      {filteredProducts.length > 0 ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-stone-900 flex items-center gap-2">
              <span>البضائع المتوفرة للطلب الفوري</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                {filteredProducts.length} صنف
              </span>
            </h2>

            {selectedTraderId !== 'all' && (
              <button
                onClick={() => setSelectedTraderId('all')}
                className="text-xs text-emerald-700 font-bold hover:underline"
              >
                إلغاء تصفية المتجر وتصفح الكل
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map(product => {
              const qtyInCart = getCartQuantity(product.id);
              const hasDiscount = product.discountPrice && product.discountPrice < product.price;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  {/* صورة الصنف مع الشارات */}
                  <div className="relative aspect-square overflow-hidden bg-stone-100">
                    <img
                      src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                    />

                    {/* شارة التاجر أو المتجر */}
                    <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Store className="w-3 h-3 text-emerald-300" />
                      <span className="max-w-[110px] truncate">{product.traderName}</span>
                    </div>

                    {/* شارة الخصم أو الجودة */}
                    {hasDiscount && (
                      <div className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                        وفر {product.price - (product.discountPrice || 0)} ج.م
                      </div>
                    )}

                    {!product.isAvailable && (
                      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center text-white font-black text-sm">
                        نفذت الكمية حالياً
                      </div>
                    )}
                  </div>

                  {/* تفاصيل الصنف */}
                  <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-stone-900 text-sm sm:text-base leading-snug line-clamp-2">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-[11px] sm:text-xs text-stone-500 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-baseline justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base sm:text-lg font-black text-emerald-700">
                            {hasDiscount ? product.discountPrice : product.price} ج.م
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-stone-400 line-through">
                              {product.price}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-stone-500 font-medium">
                          لكل {product.unit}
                        </span>
                      </div>
                    </div>

                    {/* أزرار السلة وإضافة الكميات */}
                    <div className="pt-1">
                      {qtyInCart > 0 ? (
                        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-1">
                          <button
                            onClick={() => addToCart(product, 1)}
                            className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center hover:bg-emerald-700 active:scale-95 transition"
                            title="زيادة الكمية"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <span className="font-extrabold text-sm text-emerald-900 px-2">
                            {qtyInCart} {product.unit}
                          </span>
                          <button
                            onClick={() => addToCart(product, -1)}
                            className="w-8 h-8 rounded-lg bg-white border border-stone-200 text-stone-700 font-bold flex items-center justify-center hover:bg-stone-100 active:scale-95 transition"
                            title="إنقاص الكمية"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          disabled={!product.isAvailable}
                          onClick={() => addToCart(product, 1)}
                          className={`w-full py-2 sm:py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer ${
                            product.isAvailable
                              ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white shadow-xs'
                              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                          }`}
                        >
                          <ShoppingBag className="w-4 h-4" />
                          {product.isAvailable ? 'أضف للسلة' : 'غير متوفر'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : products.length > 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
          <p className="text-stone-500 font-medium">لم يتم العثور على بضائع مطابقة لخيارات البحث الحالية.</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSelectedTraderId('all'); setSearchQuery(''); }}
            className="text-emerald-700 font-bold text-sm underline cursor-pointer"
          >
            عرض كافة البضائع المتاحة
          </button>
        </div>
      ) : null}

      {/* زر عائم سريع لمراجعة السلة على الشاشات الصغيرة */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-30 lg:hidden">
          <button
            onClick={onOpenCart}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between font-bold text-sm transition"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>متابعة الطلب ({cart.length} أصناف)</span>
            </div>
            <span className="bg-emerald-800 px-3 py-1 rounded-xl text-amber-300 font-black">
              {cart.reduce((s, i) => s + (i.price * i.quantity), 0) + (settings.deliveryFee || 20)} ج.م
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
