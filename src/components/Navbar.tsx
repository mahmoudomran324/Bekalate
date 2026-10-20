import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingBag, 
  Store, 
  ShieldCheck, 
  UserCheck, 
  LogIn, 
  LogOut, 
  Volume2, 
  Settings, 
  Package, 
  PlusCircle,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'store' | 'merchant' | 'admin' | 'quality' | 'my_orders';
  setCurrentTab: (tab: 'store' | 'merchant' | 'admin' | 'quality' | 'my_orders') => void;
  openAuthModal: () => void;
  openCartDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openAuthModal,
  openCartDrawer
}) => {
  const { 
    currentUser, 
    logout, 
    cartCount, 
    cartTotal, 
    testAudioAlert, 
    realTraders, 
    selectedTraderId, 
    setSelectedTraderId,
    settings 
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [testingSound, setTestingSound] = useState(false);

  const handleTestSound = async () => {
    setTestingSound(true);
    await testAudioAlert();
    setTestingSound(false);
  };

  const isStaff = currentUser?.role === 'admin' || currentUser?.role === 'supervisor';
  const isTrader = currentUser?.role === 'trader';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-2">
          
          {/* الشعار واسم المنصة */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('store')}
              className="flex items-center gap-2.5 text-right cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-stone-900 group-hover:text-emerald-700 transition flex items-center gap-1.5">
                  متجر بلدي
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    أحلى بقالة
                  </span>
                </span>
                <p className="text-[11px] text-stone-500 hidden sm:block">
                  بضائع حقيقية من مزارع وتجار بلدنا مباشرة
                </p>
              </div>
            </button>

            {/* محدد المتجر الحقيقي السريع للعملاء */}
            {realTraders.length > 0 && (
              <div className="hidden md:flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
                <span className="text-stone-500 font-medium px-2">عرض بضائع:</span>
                <select
                  value={selectedTraderId}
                  onChange={(e) => {
                    setSelectedTraderId(e.target.value);
                    setCurrentTab('store');
                  }}
                  className="bg-white border-0 rounded-lg px-2 py-1 font-bold text-stone-800 focus:ring-2 focus:ring-emerald-500 outline-hidden cursor-pointer"
                >
                  <option value="all">🌾 جميع المتاجر الحقيقية ({realTraders.length})</option>
                  {realTraders.map(t => (
                    <option key={t.id} value={t.id}>
                      🏪 {t.storeName || t.name} ({t.address?.cityOrDistrict || 'الرئيسي'})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* روابط التصفح للشاشات الكبيرة */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={() => setCurrentTab('store')}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition flex items-center gap-1.5 ${
                currentTab === 'store'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Package className="w-4 h-4" />
              المنتجات والبضائع
            </button>

            {/* إذا كان المستخدم تاجراً أو مسؤولاً يظهر تبويب لوحة التاجر */}
            {(isTrader || isStaff) && (
              <button
                onClick={() => setCurrentTab('merchant')}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition flex items-center gap-1.5 ${
                  currentTab === 'merchant'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Store className="w-4 h-4" />
                صفحة التاجر والطلبات
              </button>
            )}

            {/* إذا كان مسؤولاً يظهر تبويب الإدارة */}
            {isStaff && (
              <button
                onClick={() => setCurrentTab('admin')}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition flex items-center gap-1.5 ${
                  currentTab === 'admin'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <Settings className="w-4 h-4" />
                لوحة الإدارة والمشرفين
              </button>
            )}

            <button
              onClick={() => setCurrentTab('quality')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                currentTab === 'quality'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              ميثاق الجودة والاسترجاع
            </button>
          </nav>

          {/* الأزرار الجانبية: اختبار الصوت، السلة، الحساب */}
          <div className="flex items-center gap-2">
            
            {/* زر تجربة صفارة التنبيه الصوتية */}
            <button
              onClick={handleTestSound}
              disabled={testingSound}
              className={`p-2 rounded-xl border border-stone-200 text-xs font-bold transition flex items-center gap-1.5 ${
                testingSound 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
              title="تجربة صفارة إنذار الطلب الجديد والتأكد من إذن الصوت بالمتصفح"
            >
              <Volume2 className={`w-4 h-4 ${testingSound ? 'animate-bounce text-white' : 'text-emerald-600'}`} />
              <span className="hidden sm:inline">
                {testingSound ? 'جاري الرنين...' : 'تجربة التنبيه 🔊'}
              </span>
            </button>

            {/* زر سلة المشتريات */}
            <button
              onClick={openCartDrawer}
              className="relative bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-3.5 py-2 rounded-xl flex items-center gap-2 font-bold text-sm shadow-md shadow-emerald-700/20 transition cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline">السلة</span>
              {cartCount > 0 ? (
                <span className="bg-amber-400 text-stone-900 text-xs font-black px-2 py-0.5 rounded-full">
                  {cartCount} ({cartTotal} ج.م)
                </span>
              ) : (
                <span className="text-xs bg-emerald-700 px-1.5 py-0.5 rounded-full">0</span>
              )}
            </button>

            {/* الحساب الشخصي وتغيير الدور */}
            {currentUser ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={openAuthModal}
                  className="bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span className="max-w-[100px] truncate sm:max-w-none">
                    {currentUser.role === 'admin' ? 'الإدارة (محمود)' : currentUser.name}
                  </span>
                </button>
                <button
                  onClick={logout}
                  className="p-2 text-stone-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="border border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <LogIn className="w-4 h-4" />
                <span>دخول / تسجيل</span>
              </button>
            )}

            {/* زر القائمة للشاشات الصغيرة */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* القائمة المنسدلة للشاشات الصغيرة */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-stone-200 flex flex-col gap-2">
            <button
              onClick={() => { setCurrentTab('store'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-right font-bold text-sm ${currentTab === 'store' ? 'bg-emerald-50 text-emerald-700' : 'text-stone-700'}`}
            >
              📦 تصفح البضائع والمنتجات
            </button>
            
            {(isTrader || isStaff) && (
              <button
                onClick={() => { setCurrentTab('merchant'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-lg text-right font-bold text-sm ${currentTab === 'merchant' ? 'bg-emerald-600 text-white' : 'text-stone-700'}`}
              >
                🏪 صفحة التاجر وإدارة الطلبات الواردة
              </button>
            )}

            {isStaff && (
              <button
                onClick={() => { setCurrentTab('admin'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-lg text-right font-bold text-sm ${currentTab === 'admin' ? 'bg-amber-600 text-white' : 'text-amber-800 bg-amber-50'}`}
              >
                ⚙️ لوحة الإدارة العامة والمشرفين
              </button>
            )}

            <button
              onClick={() => { setCurrentTab('quality'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-right font-bold text-sm ${currentTab === 'quality' ? 'bg-emerald-50 text-emerald-700' : 'text-stone-700'}`}
            >
              🛡️ ميثاق الجودة وسياسة الاسترجاع
            </button>

            {realTraders.length > 0 && (
              <div className="pt-2 border-t border-stone-200">
                <label className="text-xs text-stone-500 font-bold block mb-1">تصفية حسب المتجر الحقيقي:</label>
                <select
                  value={selectedTraderId}
                  onChange={(e) => {
                    setSelectedTraderId(e.target.value);
                    setCurrentTab('store');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-stone-100 border border-stone-300 rounded-lg p-2 text-sm font-bold text-stone-800"
                >
                  <option value="all">عرض كل المتاجر ({realTraders.length})</option>
                  {realTraders.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.storeName || t.name} - {t.address?.cityOrDistrict}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
