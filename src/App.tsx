import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { SirenAlertBanner } from './components/SirenAlertBanner';
import { CustomerStorefront } from './components/CustomerStorefront';
import { MerchantDashboard } from './components/MerchantDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { QualityCharterModal } from './components/QualityCharterModal';
import { ShieldCheck, Phone, Heart, Store, MessageCircle } from 'lucide-react';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<'store' | 'merchant' | 'admin' | 'quality' | 'my_orders'>('store');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQualityOpen, setIsQualityOpen] = useState(false);

  const { settings, realTraders } = useStore();

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-['Cairo',sans-serif] text-stone-900 selection:bg-emerald-500 selection:text-white">
      
      {/* بانر صفارة التنبيه الصوتي الحية عند وصول أي طلب جديد */}
      <SirenAlertBanner />

      {/* الشريط العلوي الموحد */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openAuthModal={() => setIsAuthOpen(true)}
        openCartDrawer={() => setIsCartOpen(true)}
      />

      {/* المحتوى الرئيسي حسب التبويب النشط */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'store' && (
          <CustomerStorefront
            onOpenCart={() => setIsCartOpen(true)}
            onOpenQuality={() => setIsQualityOpen(true)}
            onGoToMerchantTab={() => setCurrentTab('merchant')}
          />
        )}

        {currentTab === 'merchant' && (
          <MerchantDashboard />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard />
        )}

        {currentTab === 'quality' && (
          <div className="max-w-3xl mx-auto py-8">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs space-y-6">
              <div className="flex items-center gap-3 border-b pb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-stone-900">ميثاق الجودة وسياسة الاسترجاع الفوري</h1>
                  <p className="text-xs text-stone-500">حماية العميل وسرعة تسوية أي ملاحظة على البضائع</p>
                </div>
              </div>

              <div className="prose prose-stone text-sm leading-relaxed whitespace-pre-line text-stone-700 bg-stone-50 p-6 rounded-2xl border border-stone-200">
                {settings.termsContent}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setCurrentTab('store')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition"
                >
                  العودة للمتجر والطلب الآن &larr;
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* الفوتر */}
      <footer className="bg-white border-t border-stone-200 py-8 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <div className="flex items-center justify-center gap-2 font-black text-stone-800 text-sm">
            <Store className="w-4 h-4 text-emerald-600" />
            <span>متجر بلدي - أحلى بقالة (Bekalate)</span>
          </div>
          <p className="max-w-md mx-auto text-stone-500">
            منصة حقيقية مباشرة للربط بين التجار والعملاء مع تنبيه صوتي فوري عند كل طلب وضمان استرجاع مجاني.
          </p>
          <div className="flex items-center justify-center gap-4 text-stone-600 font-bold pt-1">
            <a 
              href={`https://wa.me/${settings.supportWhatsApp.replace(/[^0-9]/g, '')}`} 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-emerald-700 flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              خدمة العملاء واتساب: {settings.supportWhatsApp}
            </a>
            <span>•</span>
            <button onClick={() => setIsQualityOpen(true)} className="hover:text-emerald-700">
              ميثاق الجودة
            </button>
          </div>
        </div>
      </footer>

      {/* المودالات المنبثقة */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenQualityCharter={() => setIsQualityOpen(true)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <QualityCharterModal
        isOpen={isQualityOpen}
        onClose={() => setIsQualityOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
