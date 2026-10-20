import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types';
import { 
  ShieldAlert, 
  Store, 
  PackagePlus, 
  Users, 
  Settings, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  MessageCircle, 
  Sliders, 
  Trash2, 
  Sparkles,
  DollarSign,
  Truck
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    users, 
    realTraders, 
    products, 
    orders, 
    settings, 
    updateSettings, 
    toggleTraderStatus, 
    addTraderByAdmin, 
    addProduct,
    seedRealProduceSamples 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'traders' | 'add_goods' | 'settings'>('traders');

  // نموذج إضافة تاجر جديد
  const [newTraderName, setNewTraderName] = useState('');
  const [newTraderStore, setNewTraderStore] = useState('');
  const [newTraderPhone, setNewTraderPhone] = useState('');
  const [newTraderCity, setNewTraderCity] = useState('المعادي');
  const [showAddTraderModal, setShowAddTraderModal] = useState(false);

  // نموذج رفع بضائع بواسطة الإدارة
  const [selectedTraderForGoods, setSelectedTraderForGoods] = useState<string>('usr_admin_1');
  const [goodsName, setGoodsName] = useState('');
  const [goodsCategory, setGoodsCategory] = useState<ProductCategory>('vegetables');
  const [goodsPrice, setGoodsPrice] = useState<number>(20);
  const [goodsUnit, setGoodsUnit] = useState('كيلو');
  const [goodsStock, setGoodsStock] = useState<number>(100);
  const [goodsImage, setGoodsImage] = useState('');
  const [goodsDesc, setGoodsDesc] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  // إعدادات المتجر العامة
  const [deliveryFee, setDeliveryFee] = useState<number>(settings.deliveryFee || 20);
  const [commissionRate, setCommissionRate] = useState<number>(settings.platformCommissionRate || 5);
  const [instapay, setInstapay] = useState(settings.instapayAccount || 'baladi@instapay');
  const [vodaCash, setVodaCash] = useState(settings.vodafoneCashNumber || '01099887766');
  const [waSupport, setWaSupport] = useState(settings.supportWhatsApp || '+201099887766');
  const [settingsSaved, setSettingsSaved] = useState(false);

  const handleCreateTrader = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTraderStore.trim() || !newTraderPhone.trim()) return;

    addTraderByAdmin({
      name: newTraderName.trim() || newTraderStore.trim(),
      storeName: newTraderStore.trim(),
      phone: newTraderPhone.trim(),
      address: {
        governorate: 'القاهرة',
        cityOrDistrict: newTraderCity.trim() || 'المعادي',
        street: 'السوق المركزي'
      }
    });

    setNewTraderName('');
    setNewTraderStore('');
    setNewTraderPhone('');
    setShowAddTraderModal(false);
  };

  const handleAdminUploadGoods = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goodsName.trim()) return;

    const targetUser = users.find(u => u.id === selectedTraderForGoods);
    const traderDisplayName = targetUser?.storeName || targetUser?.name || 'إدارة متجر بلدي';

    addProduct({
      traderId: selectedTraderForGoods,
      traderName: traderDisplayName,
      name: goodsName.trim(),
      category: goodsCategory,
      price: Number(goodsPrice),
      unit: goodsUnit.trim() || 'كيلو',
      stockQuantity: Number(goodsStock),
      isAvailable: true,
      image: goodsImage.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      description: goodsDesc.trim()
    });

    setUploadSuccess(`تم رفع صنف "${goodsName}" بنجاح وربطه بمتجر ${traderDisplayName}!`);
    setGoodsName('');
    setGoodsPrice(20);
    setGoodsImage('');
    setGoodsDesc('');

    setTimeout(() => setUploadSuccess(''), 2500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      deliveryFee: Number(deliveryFee),
      platformCommissionRate: Number(commissionRate),
      instapayAccount: instapay.trim(),
      vodafoneCashNumber: vodaCash.trim(),
      supportWhatsApp: waSupport.trim()
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* بطاقة الترويسة للإدارة والمشرفين */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-stone-900 flex items-center justify-center font-black text-2xl shadow-lg">
              ⚙️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">
                  لوحة الإدارة العامة والمشرفين
                </h1>
                <span className="bg-amber-400 text-stone-900 text-xs font-black px-2.5 py-0.5 rounded-full">
                  محمود عمران
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-1">
                التحكم المركزي في المتاجر الحقيقية، البضائع المرفوعة، والربط المالي
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => seedRealProduceSamples()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              توليد عينات بضائع فورية
            </button>
          </div>
        </div>

        {/* إحصائيات عامة */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-2">
          <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-stone-400 font-semibold">المتاجر الحقيقية</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{realTraders.length}</p>
            <p className="text-[11px] text-stone-400 mt-1">تاجر نشط ومعتمد</p>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-stone-400 font-semibold">إجمالي البضائع الحية</p>
            <p className="text-2xl font-black text-white mt-1">{products.length}</p>
            <p className="text-[11px] text-stone-400 mt-1">صنف معروض للعملاء</p>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-stone-400 font-semibold">إجمالي طلبات المنصة</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{orders.length}</p>
            <p className="text-[11px] text-stone-400 mt-1">أوردر مسجل بالقاعدة</p>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-stone-400 font-semibold">عمولة المنصة المقررة</p>
            <p className="text-2xl font-black text-amber-300 mt-1">{settings.platformCommissionRate || 5}%</p>
            <p className="text-[11px] text-stone-400 mt-1">تقتطع من مبيعات التجار</p>
          </div>
        </div>

        {/* تبويبات الإدارة */}
        <div className="flex items-center gap-2 border-t border-stone-800 pt-4 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('traders')}
            className={`pb-2 px-3 transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'traders'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" />
            المتاجر الحقيقية ({realTraders.length})
          </button>

          <button
            onClick={() => setActiveTab('add_goods')}
            className={`pb-2 px-3 transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'add_goods'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <PackagePlus className="w-4 h-4" />
            رفع بضاعة لأي متجر
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2 px-3 transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            إعدادات النظام والمدفوعات
          </button>
        </div>
      </div>

      {/* تبويب إدارة المتاجر */}
      {activeTab === 'traders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200">
            <div>
              <h3 className="font-black text-stone-900">سجل المتاجر والتجار المعتمدين</h3>
              <p className="text-xs text-stone-500">تم حذف كافة المتاجر الوهمية، ويمكنك إضافة المتاجر الحقيقية هنا.</p>
            </div>

            <button
              onClick={() => setShowAddTraderModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              إضافة متجر حقيقي جديد
            </button>
          </div>

          {realTraders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500 space-y-3">
              <Store className="w-10 h-10 mx-auto text-stone-300" />
              <p className="font-bold">لا يوجد تجار مسجلين حالياً بعد تنظيف البيانات الوهمية.</p>
              <p className="text-xs text-stone-400">أضف أول متجر حقيقي لربطه بالبضائع والعملاء وصفارة الإنذار.</p>
              <button
                onClick={() => setShowAddTraderModal(true)}
                className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs"
              >
                إضافة متجر الآن
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {realTraders.map(trader => {
                const traderProdsCount = products.filter(p => p.traderId === trader.id).length;
                const isSuspended = trader.storeStatus === 'suspended';

                return (
                  <div key={trader.id} className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3 shadow-xs">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                          <Store className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-stone-900 text-sm">{trader.storeName || trader.name}</h4>
                          <p className="text-xs text-stone-500">{trader.name}</p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isSuspended ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isSuspended ? 'موقوف' : 'نشط ومعتمد'}
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 space-y-1 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        <span>الهاتف: {trader.phone}</span>
                      </p>
                      <p>العنوان: {trader.address?.cityOrDistrict || 'المعادي'}</p>
                      <p className="font-bold text-emerald-700">عدد الأصناف المرفوعة: {traderProdsCount} صنف</p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => toggleTraderStatus(trader.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                          isSuspended 
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                            : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                        }`}
                      >
                        {isSuspended ? 'تفعيل المتجر' : 'إيقاف المتجر'}
                      </button>

                      <a
                        href={`https://wa.me/${trader.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-stone-100 hover:bg-stone-200 text-stone-700 p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        واتساب
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* مودال إضافة متجر */}
          {showAddTraderModal && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="font-black text-stone-900">إضافة متجر حقيقي جديد</h3>
                  <button onClick={() => setShowAddTraderModal(false)} className="text-stone-400 hover:text-stone-700">
                    &times;
                  </button>
                </div>

                <form onSubmit={handleCreateTrader} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">اسم المتجر *</label>
                    <input
                      type="text"
                      required
                      value={newTraderStore}
                      onChange={(e) => setNewTraderStore(e.target.value)}
                      placeholder="مثال: بقالة الخير والبركة"
                      className="w-full bg-stone-50 border rounded-xl p-2.5 text-xs font-bold outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">اسم صاحب المتجر *</label>
                    <input
                      type="text"
                      required
                      value={newTraderName}
                      onChange={(e) => setNewTraderName(e.target.value)}
                      placeholder="مثال: أحمد عبد الله"
                      className="w-full bg-stone-50 border rounded-xl p-2.5 text-xs font-bold outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">رقم الهاتف للتواصل والطلبات *</label>
                    <input
                      type="tel"
                      required
                      value={newTraderPhone}
                      onChange={(e) => setNewTraderPhone(e.target.value)}
                      placeholder="01012345678"
                      className="w-full bg-stone-50 border rounded-xl p-2.5 text-xs font-bold outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">المدينة / الحي</label>
                    <input
                      type="text"
                      value={newTraderCity}
                      onChange={(e) => setNewTraderCity(e.target.value)}
                      placeholder="المعادي / الجيزة / نصر"
                      className="w-full bg-stone-50 border rounded-xl p-2.5 text-xs font-bold outline-hidden"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddTraderModal(false)}
                      className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs"
                    >
                      حفظ وتفعيل المتجر
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* تبويب رفع بضاعة بواسطة الإدارة والمشرفين */}
      {activeTab === 'add_goods' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-7 shadow-xs max-w-2xl mx-auto space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-black text-lg text-stone-900">رفع بضائع للمتجر (بصلاحيات الإدارة)</h3>
            <p className="text-xs text-stone-500">تستطيع كإدارة رفع أي صنف وتخصيصه لأي تاجر حقيقي مسجل أو المتجر العام.</p>
          </div>

          {uploadSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          <form onSubmit={handleAdminUploadGoods} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">المتجر التابع له هذا الصنف *</label>
              <select
                value={selectedTraderForGoods}
                onChange={(e) => setSelectedTraderForGoods(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-bold text-stone-900 outline-hidden"
              >
                <option value="usr_admin_1">إدارة متجر بلدي (المتجر العام)</option>
                {realTraders.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.storeName || t.name} ({t.address?.cityOrDistrict})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">اسم الصنف بالكامل *</label>
              <input
                type="text"
                required
                value={goodsName}
                onChange={(e) => setGoodsName(e.target.value)}
                placeholder="مثال: طماطم بلدي فرز أول قطفة صباحية"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-bold outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">التصنيف *</label>
                <select
                  value={goodsCategory}
                  onChange={(e) => setGoodsCategory(e.target.value as ProductCategory)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-bold outline-hidden"
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
                  value={goodsUnit}
                  onChange={(e) => setGoodsUnit(e.target.value)}
                  placeholder="كيلو / كيس / كرتونة"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-bold outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">السعر (ج.م) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={goodsPrice}
                  onChange={(e) => setGoodsPrice(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-bold outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">الكمية المتوفرة بالمخزن *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={goodsStock}
                  onChange={(e) => setGoodsStock(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-bold outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">رابط صورة الصنف (URL)</label>
              <input
                type="url"
                value={goodsImage}
                onChange={(e) => setGoodsImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-bold outline-hidden"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md"
              >
                رفع الصنف وعرضه للعملاء فوراً
              </button>
            </div>
          </form>
        </div>
      )}

      {/* تبويب إعدادات النظام */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-7 shadow-xs max-w-xl mx-auto space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-black text-lg text-stone-900">إعدادات المنصة والحسابات البنكية</h3>
            <p className="text-xs text-stone-500">تظهر هذه البيانات للعملاء في السلة وعند الدفع.</p>
          </div>

          {settingsSaved && (
            <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>تم حفظ الإعدادات بنجاح!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">تكلفة الشحن والتوصيل (ج.م)</label>
                <input
                  type="number"
                  min="0"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-bold outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">نسبة عمولة المنصة (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-bold outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">حساب إنستاباي InstaPay الرسمي</label>
              <input
                type="text"
                value={instapay}
                onChange={(e) => setInstapay(e.target.value)}
                placeholder="baladi@instapay"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-mono font-bold outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">رقم محفظة فودافون كاش الرسمية</label>
              <input
                type="text"
                value={vodaCash}
                onChange={(e) => setVodaCash(e.target.value)}
                placeholder="01099887766"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-mono font-bold outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">رقم واتساب الدعم الفني للإدارة</label>
              <input
                type="text"
                value={waSupport}
                onChange={(e) => setWaSupport(e.target.value)}
                placeholder="+201099887766"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-bold outline-hidden"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md"
              >
                حفظ الإعدادات المحدثة
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
