import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, ProductCategory, OrderStatus } from '../types';
import { 
  Store, 
  PackagePlus, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Phone, 
  MapPin, 
  Plus, 
  Trash2, 
  Sparkles, 
  DollarSign, 
  MessageCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export const MerchantDashboard: React.FC = () => {
  const { 
    currentUser, 
    orders, 
    products, 
    updateOrderStatus, 
    addProduct, 
    deleteProduct, 
    toggleProductAvailability,
    seedRealProduceSamples,
    isSirenRinging,
    stopSirenAlert,
    testAudioAlert,
    settings
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'add_product'>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | 'new' | 'preparing' | 'on_the_way' | 'delivered'>('all');

  // نموذج إضافة بضاعة جديدة
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<ProductCategory>('vegetables');
  const [prodPrice, setProdPrice] = useState<number>(20);
  const [prodDiscount, setProdDiscount] = useState<string>('');
  const [prodUnit, setProdUnit] = useState('كيلو');
  const [prodStock, setProdStock] = useState<number>(100);
  const [prodImage, setProdImage] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // تحديد هوية التاجر الحالي
  const currentTraderId = currentUser?.role === 'trader' ? currentUser.id : currentUser?.id || 'usr_admin_1';
  const currentTraderName = currentUser?.storeName || currentUser?.name || 'المتجر الرئيسي';

  // تصفية الطلبات الخاصة بهذا التاجر
  const merchantOrders = orders.filter(o => {
    if (currentUser?.role === 'admin' || currentUser?.role === 'supervisor') return true;
    return o.traderIds?.includes(currentTraderId);
  });

  const filteredOrders = merchantOrders.filter(o => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  // تصفية المنتجات المرفوعة من هذا التاجر
  const merchantProducts = products.filter(p => {
    if (currentUser?.role === 'admin' || currentUser?.role === 'supervisor') return true;
    return p.traderId === currentTraderId;
  });

  // إحصائيات المتجر
  const totalSales = merchantOrders
    .filter(o => o.status !== 'cancelled' && o.status !== 'returned')
    .reduce((sum, o) => sum + o.subtotal, 0);
  
  const platformRate = settings.platformCommissionRate || 5;
  const platformCut = Math.round(totalSales * (platformRate / 100));
  const netEarnings = totalSales - platformCut;

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    const discountVal = prodDiscount ? parseFloat(prodDiscount) : undefined;

    addProduct({
      traderId: currentTraderId,
      traderName: currentTraderName,
      name: prodName.trim(),
      category: prodCategory,
      price: Number(prodPrice),
      discountPrice: discountVal && discountVal < prodPrice ? discountVal : undefined,
      unit: prodUnit.trim() || 'كيلو',
      stockQuantity: Number(prodStock),
      isAvailable: true,
      image: prodImage.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      description: prodDesc.trim()
    });

    setSuccessMsg(`تم رفع صنف "${prodName}" بنجاح في متجرك!`);
    setProdName('');
    setProdPrice(20);
    setProdDiscount('');
    setProdImage('');
    setProdDesc('');

    setTimeout(() => {
      setSuccessMsg('');
      setActiveTab('products');
    }, 1500);
  };

  const PRESET_IMAGES = [
    { label: 'طماطم بلدي', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' },
    { label: 'بطاطس تحمير', url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80' },
    { label: 'خيار مزارع', url: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=600&q=80' },
    { label: 'بصل أحمر', url: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80' },
    { label: 'تفاح مصري', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80' },
    { label: 'جبن فلاحي', url: 'https://images.unsplash.com/photo-1528751014936-863e6e7a319c?auto=format&fit=crop&w=600&q=80' },
    { label: 'أرز فاخر', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
    { label: 'فول تدميس', url: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=600&q=80' }
  ];

  return (
    <div className="space-y-6 pb-16">
      
      {/* بطاقة معلومات المتجر والإحصائيات */}
      <div className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-700/20">
              <Store className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                  {currentTraderName}
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full">
                  متجر حقيقي معتمد
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                صاحب المتجر: <strong className="text-stone-700">{currentUser?.name || 'محمود عمران'}</strong> — هاتف: {currentUser?.phone || '01099887766'}
              </p>
            </div>
          </div>

          {/* فحص الصوت ووقف الإنذار */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isSirenRinging && (
              <button
                onClick={stopSirenAlert}
                className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 animate-pulse shadow-md"
              >
                <VolumeX className="w-4 h-4" />
                إيقاف صوت الصفارة
              </button>
            )}

            <button
              onClick={testAudioAlert}
              className="flex-1 sm:flex-none bg-stone-100 hover:bg-stone-200 text-stone-800 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-stone-200 transition"
            >
              <Volume2 className="w-4 h-4 text-emerald-600" />
              اختبار صفارة الإنذار 🔊
            </button>
          </div>
        </div>

        {/* كروت الإحصائيات المالية للتاجر */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
            <p className="text-xs text-stone-500 font-semibold">إجمالي الطلبات</p>
            <p className="text-2xl font-black text-stone-900 mt-1">{merchantOrders.length}</p>
            <p className="text-[11px] text-emerald-700 font-bold mt-1">
              {merchantOrders.filter(o => o.status === 'new').length} طلب جديد وارد 🚨
            </p>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
            <p className="text-xs text-stone-500 font-semibold">إجمالي المبيعات</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{totalSales} ج.م</p>
            <p className="text-[11px] text-stone-400 mt-1">من مبيعات بضائع المتجر</p>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
            <p className="text-xs text-stone-500 font-semibold">عمولة المنصة ({platformRate}%)</p>
            <p className="text-2xl font-black text-amber-700 mt-1">{platformCut} ج.م</p>
            <p className="text-[11px] text-stone-400 mt-1">تدفع للإدارة شهرياً</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <p className="text-xs text-emerald-800 font-semibold">صافي أرباح التاجر</p>
            <p className="text-2xl font-black text-emerald-900 mt-1">{netEarnings} ج.م</p>
            <p className="text-[11px] text-emerald-700 font-bold mt-1">جاهزة للصرف</p>
          </div>
        </div>

        {/* أزرار التبويبات الداخلية */}
        <div className="flex items-center gap-2 border-b border-stone-200 pt-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-3 text-sm font-black transition border-b-2 flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            إدارة الطلبات الحية ({merchantOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-3 text-sm font-black transition border-b-2 flex items-center gap-2 ${
              activeTab === 'products'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Store className="w-4 h-4" />
            بضائع المتجر المرفوعة ({merchantProducts.length})
          </button>

          <button
            onClick={() => setActiveTab('add_product')}
            className={`pb-3 px-3 text-sm font-black transition border-b-2 flex items-center gap-2 ${
              activeTab === 'add_product'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <PackagePlus className="w-4 h-4" />
            رفع بضاعة جديدة للمتجر
          </button>
        </div>
      </div>

      {/* تبويب الطلبات الواردة */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          
          {/* فلتر حالات الطلبات */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
            <button
              onClick={() => setOrderFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition ${orderFilter === 'all' ? 'bg-stone-800 text-white' : 'bg-white border text-stone-700'}`}
            >
              الكل ({merchantOrders.length})
            </button>
            <button
              onClick={() => setOrderFilter('new')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${orderFilter === 'new' ? 'bg-red-600 text-white' : 'bg-white border text-stone-700'}`}
            >
              <span>🚨 جديدة</span>
              <span>({merchantOrders.filter(o => o.status === 'new').length})</span>
            </button>
            <button
              onClick={() => setOrderFilter('preparing')}
              className={`px-3 py-1.5 rounded-lg transition ${orderFilter === 'preparing' ? 'bg-amber-600 text-white' : 'bg-white border text-stone-700'}`}
            >
              قيد التجهيز ({merchantOrders.filter(o => o.status === 'preparing').length})
            </button>
            <button
              onClick={() => setOrderFilter('on_the_way')}
              className={`px-3 py-1.5 rounded-lg transition ${orderFilter === 'on_the_way' ? 'bg-blue-600 text-white' : 'bg-white border text-stone-700'}`}
            >
              مع المندوب ({merchantOrders.filter(o => o.status === 'on_the_way').length})
            </button>
            <button
              onClick={() => setOrderFilter('delivered')}
              className={`px-3 py-1.5 rounded-lg transition ${orderFilter === 'delivered' ? 'bg-emerald-600 text-white' : 'bg-white border text-stone-700'}`}
            >
              تم التسليم ({merchantOrders.filter(o => o.status === 'delivered').length})
            </button>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500 space-y-2">
              <Clock className="w-10 h-10 mx-auto text-stone-300" />
              <p className="font-bold">لا توجد طلبات في هذه الحالة حالياً.</p>
              <p className="text-xs text-stone-400">عندما يطلب أي عميل من متجرك ستنطلق صفارة التنبيه الصوتي فوراً هنا.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map(order => {
                const isNew = order.status === 'new';

                return (
                  <div
                    key={order.id}
                    className={`bg-white rounded-2xl border p-4 sm:p-5 transition shadow-xs ${
                      isNew 
                        ? 'border-red-400 ring-2 ring-red-300 bg-red-50/20' 
                        : 'border-stone-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-stone-900 text-base">
                            طلب #{order.orderNumber}
                          </span>
                          <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                            order.status === 'new' ? 'bg-red-600 text-white animate-pulse' :
                            order.status === 'preparing' ? 'bg-amber-100 text-amber-800' :
                            order.status === 'on_the_way' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-stone-100 text-stone-700'
                          }`}>
                            {order.status === 'new' ? '🚨 طلب جديد ينتظر القبول' :
                             order.status === 'preparing' ? '⏳ جاري التجهيز' :
                             order.status === 'on_the_way' ? '🛵 جاري التوصيل' :
                             order.status === 'delivered' ? '✅ تم التسليم' : order.status}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-1">
                          التاريخ: {new Date(order.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isNew && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'preparing', 'تم قبول الطلب وبدء التجهيز')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            قبول الطلب وبدء التجهيز (إيقاف الصوت)
                          </button>
                        )}

                        {order.status === 'preparing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'on_the_way', 'تم تسليم الطلب للمندوب')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 transition"
                          >
                            <Truck className="w-4 h-4" />
                            تسليم للمندوب
                          </button>
                        )}

                        {order.status === 'on_the_way' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'delivered', 'تم تسليم الطلب للعميل')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 transition"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            تأكيد التسليم
                          </button>
                        )}

                        <a
                          href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `أهلاً بك يا ${order.customerName}، بخصوص طلبك من ${currentTraderName} رقم #${order.orderNumber}...`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 p-2 rounded-xl transition"
                          title="مراسلة العميل واتساب"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    {/* تفاصيل العميل والأصناف المطلوبة */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 text-xs">
                      <div className="space-y-1 text-stone-600">
                        <p><strong className="text-stone-900">العميل:</strong> {order.customerName}</p>
                        <p className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-stone-400" />
                          <strong className="text-stone-900">الهاتف:</strong> {order.customerPhone}
                        </p>
                        <p className="flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                          <span>
                            {order.customerAddress.governorate}، {order.customerAddress.cityOrDistrict} - {order.customerAddress.street}
                            {order.customerAddress.building && ` (${order.customerAddress.building})`}
                          </span>
                        </p>
                        {order.notes && (
                          <p className="text-amber-800 bg-amber-50 p-1.5 rounded-md border border-amber-200">
                            ملاحظة العميل: {order.notes}
                          </p>
                        )}
                      </div>

                      <div className="bg-stone-50 rounded-xl p-3 space-y-1.5 border border-stone-200">
                        <span className="font-bold text-stone-800 block mb-1">الأصناف المطلوبة:</span>
                        {order.items.map(item => (
                          <div key={item.productId} className="flex justify-between text-stone-700">
                            <span>
                              {item.productName} &times; <strong>{item.quantity} {item.unit}</strong>
                            </span>
                            <span className="font-bold">{item.price * item.quantity} ج.م</span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-stone-200 flex justify-between font-black text-stone-900">
                          <span>إجمالي الطلب:</span>
                          <span className="text-emerald-700 text-sm">{order.total} ج.م</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* تبويب بضائع المتجر المرفوعة */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
            <div>
              <h3 className="font-black text-stone-900">بضائع المتجر الحقيقية</h3>
              <p className="text-xs text-stone-500">هذه هي البضائع المعروضة للعملاء حالياً من متجرك.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => seedRealProduceSamples(currentTraderId)}
                className="bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                إضافة تشكيلة منتجات طازجة جاهزة
              </button>

              <button
                onClick={() => setActiveTab('add_product')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                رفع صنف جديد
              </button>
            </div>
          </div>

          {merchantProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500 space-y-3">
              <p className="font-bold">لا توجد بضائع مرفوعة في متجرك حتى الآن.</p>
              <p className="text-xs text-stone-400">ارفع أول صنف لتبدأ في استقبال طلبات العملاء وصفارة التنبيه.</p>
              <button
                onClick={() => setActiveTab('add_product')}
                className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                رفع أول صنف الآن
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {merchantProducts.map(p => (
                <div key={p.id} className="bg-white rounded-2xl border border-stone-200 p-3.5 flex gap-3 items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80'}
                      alt={p.name}
                      className="w-14 h-14 object-cover rounded-xl border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-stone-900 text-xs sm:text-sm truncate">{p.name}</h4>
                      <p className="text-xs font-black text-emerald-700">{p.price} ج.م / {p.unit}</p>
                      <p className="text-[10px] text-stone-500">المخزون: {p.stockQuantity} {p.unit}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleProductAvailability(p.id)}
                      className={`p-2 rounded-lg text-xs font-bold transition ${
                        p.isAvailable 
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                          : 'bg-stone-100 text-stone-400 hover:bg-stone-200'
                      }`}
                      title={p.isAvailable ? 'متاح للطلب (اضغط لجعله غير متوفر)' : 'غير متوفر (اضغط لإتاحته)'}
                    >
                      {p.isAvailable ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="حذف الصنف نهائياً"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* تبويب رفع بضاعة جديدة */}
      {activeTab === 'add_product' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-7 shadow-xs max-w-2xl mx-auto space-y-5">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-black text-lg text-stone-900">رفع بضاعة حقيقية جديدة للمتجر</h3>
            <p className="text-xs text-stone-500">سيتم إتاحة هذا الصنف فوراً للعملاء للشراء مع التنبيه الصوتي عند طلبه.</p>
          </div>

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleAddProductSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">اسم الصنف بالكامل *</label>
              <input
                type="text"
                required
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                placeholder="مثال: طماطم بلدي فرز أول / جبنة قريش فلاحي"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">التصنيف *</label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value as ProductCategory)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-xs font-bold text-stone-900 focus:bg-white outline-hidden"
                >
                  <option value="vegetables">خضروات طازجة</option>
                  <option value="fruits">فواكه موسمية</option>
                  <option value="dairy">ألبان وأجبان بلدي</option>
                  <option value="legumes">بقوليات وحبوب</option>
                  <option value="spices_dried">عطارة ومجففات</option>
                  <option value="poultry_meat">دواجن ولحوم</option>
                  <option value="pantry_canned">معلبات ومؤن</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">وحدة البيع *</label>
                <input
                  type="text"
                  required
                  value={prodUnit}
                  onChange={(e) => setProdUnit(e.target.value)}
                  placeholder="كيلو / نصف كيلو / كيس / كرتونة"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-stone-900 outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">السعر الأصلي (ج.م) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={prodPrice}
                  onChange={(e) => setProdPrice(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">سعر الخصم / العرض (اختياري)</label>
                <input
                  type="number"
                  value={prodDiscount}
                  onChange={(e) => setProdDiscount(e.target.value)}
                  placeholder="اتركه فارغاً إن لم يوجد"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">الكمية بالمخزن *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={prodStock}
                  onChange={(e) => setProdStock(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">رابط صورة الصنف (URL) أو اختر صورة سريعة</label>
              <input
                type="url"
                value={prodImage}
                onChange={(e) => setProdImage(e.target.value)}
                placeholder="https://..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs font-bold text-stone-900 outline-hidden"
              />

              {/* اختيار صور جاهزة بنقرة واحدة */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-[11px] text-stone-400 font-semibold">صور جاهزة:</span>
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setProdImage(preset.url)}
                    className="text-[10px] bg-stone-100 hover:bg-stone-200 border border-stone-200 px-2 py-1 rounded-md text-stone-700 font-medium"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">وصف الصنف وضمان الجودة</label>
              <textarea
                rows={2}
                value={prodDesc}
                onChange={(e) => setProdDesc(e.target.value)}
                placeholder="صنف بلدي طازج فرز أول..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs font-medium text-stone-900 outline-hidden"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('products')}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                إلغاء
              </button>

              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition"
              >
                حفظ ورفع البضاعة للمتجر فوراً
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
