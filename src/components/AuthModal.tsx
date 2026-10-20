import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Store, 
  ShieldCheck, 
  User, 
  AlertCircle,
  KeyRound,
  Mail,
  Phone
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    currentUser, 
    login, 
    registerTrader, 
    registerCustomer, 
    setCurrentUserDirect,
    users 
  } = useStore();

  const [mode, setMode] = useState<'login' | 'register_trader' | 'register_customer'>('login');
  
  // حقول الدخول
  const [emailOrPhone, setEmailOrPhone] = useState('mahmoudomran324@gmail.com');
  const [password, setPassword] = useState('Aa&9119045');
  const [errorMsg, setErrorMsg] = useState('');

  // حقول تسجيل تاجر
  const [traderName, setTraderName] = useState('');
  const [traderStoreName, setTraderStoreName] = useState('');
  const [traderPhone, setTraderPhone] = useState('');
  const [traderEmail, setTraderEmail] = useState('');
  const [traderCity, setTraderCity] = useState('المعادي');

  // حقول تسجيل عميل
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custCity, setCustCity] = useState('المعادي');
  const [custStreet, setCustStreet] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(emailOrPhone, password);
    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleRegisterTraderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = registerTrader({
      name: traderName.trim(),
      phone: traderPhone.trim(),
      email: traderEmail.trim() || `${traderPhone.trim()}@store.com`,
      storeName: traderStoreName.trim(),
      storeCategory: 'خضروات وفواكه وبقالة',
      governorate: 'القاهرة',
      city: traderCity.trim(),
      street: 'السوق المركزي'
    });
    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleRegisterCustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = registerCustomer({
      name: custName.trim(),
      phone: custPhone.trim(),
      email: `${custPhone.trim()}@customer.com`,
      governorate: 'القاهرة',
      city: custCity.trim(),
      street: custStreet.trim() || 'شارع رئيسي'
    });
    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
        
        {/* الترويسة وأزرار التبديل */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <KeyRound className="w-4 h-4" />
            </div>
            <h3 className="font-black text-stone-900 text-base sm:text-lg">
              {mode === 'login' ? 'تسجيل الدخول للنظام' :
               mode === 'register_trader' ? 'تسجيل متجر حقيقي جديد' : 'تسجيل حساب عميل'}
            </h3>
          </div>

          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* أزرار اختيار النمط */}
        <div className="grid grid-cols-3 gap-1.5 bg-stone-100 p-1 rounded-xl text-xs font-bold text-stone-700">
          <button
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className={`py-1.5 rounded-lg transition ${mode === 'login' ? 'bg-white shadow text-emerald-800' : 'hover:bg-stone-200'}`}
          >
            دخول
          </button>
          <button
            onClick={() => { setMode('register_trader'); setErrorMsg(''); }}
            className={`py-1.5 rounded-lg transition ${mode === 'register_trader' ? 'bg-white shadow text-emerald-800' : 'hover:bg-stone-200'}`}
          >
            حساب تاجر
          </button>
          <button
            onClick={() => { setMode('register_customer'); setErrorMsg(''); }}
            className={`py-1.5 rounded-lg transition ${mode === 'register_customer' ? 'bg-white shadow text-emerald-800' : 'hover:bg-stone-200'}`}
          >
            حساب عميل
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* نموذج تسجيل الدخول */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">البريد الإلكتروني أو الهاتف</label>
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="mahmoudomran324@gmail.com"
                className="w-full bg-stone-50 border rounded-xl p-2.5 text-xs font-bold outline-hidden focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">كلمة المرور</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-50 border rounded-xl p-2.5 text-xs font-bold outline-hidden focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition"
            >
              تسجيل الدخول الآن
            </button>

            {/* اختصار سريع لدخول حساب الإدارة الحقيقي */}
            <div className="pt-2 border-t text-center space-y-2">
              <p className="text-[11px] text-stone-400">حساب الإدارة العامة الحقيقي:</p>
              <button
                type="button"
                onClick={() => {
                  setEmailOrPhone('mahmoudomran324@gmail.com');
                  setPassword('Aa&9119045');
                }}
                className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5"
              >
                <span>🔑 ملء بيانات حساب محمود عمران (الإدارة)</span>
              </button>
            </div>
          </form>
        )}

        {/* نموذج تسجيل تاجر جديد */}
        {mode === 'register_trader' && (
          <form onSubmit={handleRegisterTraderSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">اسم المتجر *</label>
              <input
                type="text"
                required
                value={traderStoreName}
                onChange={(e) => setTraderStoreName(e.target.value)}
                placeholder="مثال: بقالة الفلاح، خضروات مزارعنا"
                className="w-full bg-stone-50 border rounded-xl p-2.5 text-xs font-bold outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">اسم صاحب المتجر *</label>
              <input
                type="text"
                required
                value={traderName}
                onChange={(e) => setTraderName(e.target.value)}
                placeholder="محمود عمران"
                className="w-full bg-stone-50 border rounded-xl p-2.5 text-xs font-bold outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">رقم الهاتف لتلقي صفارة الطلبات *</label>
              <input
                type="tel"
                required
                value={traderPhone}
                onChange={(e) => setTraderPhone(e.target.value)}
                placeholder="01099887766"
                className="w-full bg-stone-50 border rounded-xl p-2.5 text-xs font-bold outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">المدينة / المنطقة</label>
              <input
                type="text"
                value={traderCity}
                onChange={(e) => setTraderCity(e.target.value)}
                placeholder="المعادي"
                className="w-full bg-stone-50 border rounded-xl p-2.5 text-xs font-bold outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition"
            >
              تسجيل المتجر وبدء استقبال الطلبات 🚨
            </button>
          </form>
        )}

        {/* نموذج تسجيل عميل جديد */}
        {mode === 'register_customer' && (
          <form onSubmit={handleRegisterCustSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">اسم العميل *</label>
              <input
                type="text"
                required
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
                placeholder="أحمد علي"
                className="w-full bg-stone-50 border rounded-xl p-2.5 text-xs font-bold outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">رقم الهاتف *</label>
              <input
                type="tel"
                required
                value={custPhone}
                onChange={(e) => setCustPhone(e.target.value)}
                placeholder="01012345678"
                className="w-full bg-stone-50 border rounded-xl p-2.5 text-xs font-bold outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">الشارع والمنطقة</label>
              <input
                type="text"
                value={custStreet}
                onChange={(e) => setCustStreet(e.target.value)}
                placeholder="شارع النصر - المعادي"
                className="w-full bg-stone-50 border rounded-xl p-2.5 text-xs font-bold outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition"
            >
              تسجيل حساب العميل
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
