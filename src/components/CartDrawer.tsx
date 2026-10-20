import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod, Order } from '../types';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  CreditCard, 
  Banknote, 
  Phone, 
  MapPin, 
  CheckCircle, 
  Sparkles, 
  MessageCircle,
  Truck,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQualityCharter: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOpenQualityCharter }) => {
  const { 
    cart, 
    cartSubtotal, 
    cartTotal, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    createOrder, 
    currentUser,
    settings 
  } = useStore();

  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [governorate, setGovernorate] = useState(currentUser?.address?.governorate || 'القاهرة');
  const [city, setCity] = useState(currentUser?.address?.cityOrDistrict || 'المعادي');
  const [street, setStreet] = useState(currentUser?.address?.street || '');
  const [building, setBuilding] = useState(currentUser?.address?.building || '');
  const [landmark, setLandmark] = useState(currentUser?.address?.landmark || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (cart.length === 0) {
      setErrorMsg('سلة المشتريات فارغة.');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !street.trim()) {
      setErrorMsg('يرجى ملء الاسم ورقم الهاتف والعنوان بالتفصيل لضمان سرعة التوصيل.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        address: {
          governorate,
          cityOrDistrict: city,
          street: street.trim(),
          building: building.trim(),
          landmark: landmark.trim()
        },
        paymentMethod,
        notes: notes.trim()
      });

      if (res.success && res.order) {
        setCreatedOrder(res.order);
      } else {
        setErrorMsg(res.message || 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة ثانية.');
      }
    } catch (err) {
      console.error('Order error:', err);
      setErrorMsg('تعذر إرسال الطلب، يرجى التحقق من الاتصال.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAndReset = () => {
    setCreatedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-200">
        
        {/* ترويسة السلة */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-stone-900 text-base sm:text-lg">سلة طلبات البضائع</h2>
              <p className="text-xs text-stone-500">
                {cart.length > 0 ? `${cart.length} أصناف جاهزة للشحن الفوري` : 'السلة فارغة'}
              </p>
            </div>
          </div>

          <button
            onClick={handleCloseAndReset}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* جسم السلة */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          
          {/* شاشة نجاح الطلب */}
          {createdOrder ? (
            <div className="py-8 text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full">
                  تم إرسال التنبيه الصوتي الحقيقي للتاجر بنجاح! 🚨
                </span>
                <h3 className="text-2xl font-black text-stone-900">
                  شكراً لطلبك من متجر بلدي!
                </h3>
                <p className="text-sm text-stone-600 max-w-xs mx-auto">
                  طلبك رقم <strong className="text-emerald-700 font-extrabold">#{createdOrder.orderNumber}</strong> قيد المراجعة الفورية من التاجر والإدارة.
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-right text-xs space-y-2">
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">اسم العميل:</span>
                  <span className="font-bold text-stone-800">{createdOrder.customerName}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">الهاتف:</span>
                  <span className="font-bold text-stone-800">{createdOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">العنوان:</span>
                  <span className="font-bold text-stone-800">
                    {createdOrder.customerAddress.cityOrDistrict} - {createdOrder.customerAddress.street}
                  </span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">طريقة الدفع:</span>
                  <span className="font-bold text-emerald-700">
                    {createdOrder.paymentMethod === 'cod' ? 'نقدياً عند الاستلام (COD)' : createdOrder.paymentMethod === 'instapay' ? 'إنستاباي InstaPay' : 'فودافون كاش'}
                  </span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-black">
                  <span>الإجمالي المطلوب:</span>
                  <span className="text-emerald-700">{createdOrder.total} ج.م</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href={`https://wa.me/${settings.supportWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `مرحباً إدارة متجر بلدي، لقد قمت بطلب أوردر رقم #${createdOrder.orderNumber} بإجمالي ${createdOrder.total} ج.م. أرجو المتابعة.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow transition"
                >
                  <MessageCircle className="w-5 h-5" />
                  متابعة الطلب على واتساب الإدارة فوراً
                </a>

                <button
                  onClick={handleCloseAndReset}
                  className="w-full bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold py-2.5 px-4 rounded-xl text-sm transition"
                >
                  متابعة التسوق وإغلاق
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 bg-stone-100 text-stone-400 rounded-full mx-auto flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-stone-700">سلتك فارغة حالياً</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                اختر بضائعك الطازجة من قائمة الخضروات والفواكه والأجبان وسنصلك أينما كنت.
              </p>
              <button
                onClick={onClose}
                className="mt-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
              >
                تصفح المنتجات الآن
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder} className="space-y-5">
              
              {/* قائمة الأصناف */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500">الأصناف المختارة:</span>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    تفريغ السلة
                  </button>
                </div>

                <div className="space-y-2">
                  {cart.map(item => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-3 p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-right"
                    >
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80'}
                        alt={item.productName}
                        className="w-14 h-14 object-cover rounded-lg border border-stone-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-xs sm:text-sm text-stone-900 truncate">
                          {item.productName}
                        </h4>
                        <p className="text-[11px] text-stone-500">
                          المتجر: <span className="font-semibold text-emerald-800">{item.traderName}</span>
                        </p>
                        <p className="text-xs font-black text-emerald-700">
                          {item.price} ج.م / {item.unit}
                        </p>
                      </div>

                      {/* أزرار زيادة ونقصان الكمية */}
                      <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-stone-700"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-black px-1 text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-stone-700"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        className="text-stone-400 hover:text-red-600 p-1 transition"
                        title="حذف الصنف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* بيانات العميل والتوصيل */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                <h4 className="font-extrabold text-sm text-stone-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  بيانات العميل وعنوان التوصيل
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-stone-600 block mb-1">اسم العميل بالكامل *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="محمود عمران"
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-600 block mb-1">رقم الهاتف للتواصل *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="01099887766"
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-stone-600 block mb-1">المحافظة</label>
                    <input
                      type="text"
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs font-bold text-stone-900 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-600 block mb-1">المدينة / الحي *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="المعادي / مدينة نصر / الدقي"
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs font-bold text-stone-900 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">الشارع ورقم العمارة والشقة *</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="شارع النصر، عمارة 14 الدور 4 شقة 8"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs font-bold text-stone-900 outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">علامة مميزة أو ملاحظات للمندوب</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="بجوار صيدلية أو محطة مترو"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 outline-hidden"
                  />
                </div>
              </div>

              {/* اختيار وسيلة الدفع */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                <h4 className="font-extrabold text-sm text-stone-900 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  طريقة الدفع المعتمدة
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-2.5 rounded-xl border text-right transition cursor-pointer flex flex-col justify-between ${
                      paymentMethod === 'cod'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500'
                        : 'border-stone-200 bg-white text-stone-700'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-emerald-600 mb-1" />
                    <span className="font-extrabold text-xs">عند الاستلام (COD)</span>
                    <span className="text-[10px] text-stone-500">كاش للمندوب</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('instapay')}
                    className={`p-2.5 rounded-xl border text-right transition cursor-pointer flex flex-col justify-between ${
                      paymentMethod === 'instapay'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500'
                        : 'border-stone-200 bg-white text-stone-700'
                    }`}
                  >
                    <Sparkles className="w-5 h-5 text-purple-600 mb-1" />
                    <span className="font-extrabold text-xs">إنستاباي InstaPay</span>
                    <span className="text-[10px] text-stone-500">تحويل لحظي</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('vodafone_cash')}
                    className={`p-2.5 rounded-xl border text-right transition cursor-pointer flex flex-col justify-between ${
                      paymentMethod === 'vodafone_cash'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500'
                        : 'border-stone-200 bg-white text-stone-700'
                    }`}
                  >
                    <Phone className="w-5 h-5 text-red-600 mb-1" />
                    <span className="font-extrabold text-xs">فودافون كاش</span>
                    <span className="text-[10px] text-stone-500">محفظة إلكترونية</span>
                  </button>
                </div>

                {paymentMethod === 'instapay' && (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-xs text-purple-900 space-y-1">
                    <p className="font-extrabold">حساب إنستاباي المعتمد للتحويل:</p>
                    <p className="font-mono font-bold text-sm bg-white px-2 py-1 rounded-md border border-purple-200 inline-block">
                      {settings.instapayAccount || 'baladi@instapay'}
                    </p>
                    <p className="text-[10px] text-purple-700">يرجى تحويل المبلغ والاحتفاظ بإشعار التحويل.</p>
                  </div>
                )}

                {paymentMethod === 'vodafone_cash' && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-900 space-y-1">
                    <p className="font-extrabold">رقم محفظة فودافون كاش المعتمد:</p>
                    <p className="font-mono font-bold text-sm bg-white px-2 py-1 rounded-md border border-red-200 inline-block">
                      {settings.vodafoneCashNumber || '01099887766'}
                    </p>
                    <p className="text-[10px] text-red-700">يرجى التحويل والاحتفاظ بالرسالة النصية.</p>
                  </div>
                )}
              </div>

              {/* تفصيل التكلفة والحساب الإجمالي */}
              <div className="bg-stone-100 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>قيمة البضائع:</span>
                  <span className="font-bold text-stone-800">{cartSubtotal} ج.م</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    رسوم الشحن والتوصيل:
                  </span>
                  <span className="font-bold text-stone-800">{settings.deliveryFee || 20} ج.م</span>
                </div>
                <div className="flex justify-between text-sm font-black text-stone-900 pt-2 border-t border-stone-200">
                  <span>المبلغ الإجمالي المستحق:</span>
                  <span className="text-emerald-700 text-base">{cartTotal} ج.م</span>
                </div>
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* زر إرسال الطلب والتنبيه الفعلي */}
              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold py-3.5 px-4 rounded-xl text-sm shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {isSubmitting ? 'جاري إرسال الطلب وتشغيل التنبيه...' : `تأكيد وإرسال الطلب الآن (${cartTotal} ج.م)`}
                </button>

                <p className="text-[11px] text-center text-stone-500">
                  🔔 بمجرد الضغط، ستنطلق صفارة التنبيه الصوتي للتاجر فوراً للبدء في التجهيز.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
