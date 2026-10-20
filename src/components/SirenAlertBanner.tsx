import React from 'react';
import { useStore } from '../context/StoreContext';
import { BellRing, VolumeX, CheckCircle, PackageCheck } from 'lucide-react';

export const SirenAlertBanner: React.FC = () => {
  const { isSirenRinging, activeAlertOrder, stopSirenAlert, updateOrderStatus } = useStore();

  if (!isSirenRinging || !activeAlertOrder) return null;

  const handleAcceptAndStop = () => {
    updateOrderStatus(activeAlertOrder.id, 'preparing', 'تم قبول الطلب وبدء التجهيز من التاجر');
    stopSirenAlert();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white shadow-2xl animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-white text-red-600 p-2 rounded-full animate-bounce">
            <BellRing className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg">🚨 تنبيه صوتي عاجل: طلب جديد وارد!</span>
              <span className="bg-red-800 text-amber-200 text-xs px-2 py-0.5 rounded-full font-bold">
                #{activeAlertOrder.orderNumber}
              </span>
            </div>
            <p className="text-sm text-red-100">
              العميل: <strong className="text-white">{activeAlertOrder.customerName}</strong> ({activeAlertOrder.customerPhone}) 
              — الإجمالي: <strong className="text-amber-300">{activeAlertOrder.total} ج.م</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAcceptAndStop}
            className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-sm shadow transition"
          >
            <PackageCheck className="w-5 h-5" />
            قبول الطلب وبدء التجهيز (إيقاف الصوت)
          </button>
          
          <button
            onClick={stopSirenAlert}
            className="bg-red-800 hover:bg-red-900 active:scale-95 text-white font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 text-sm transition"
            title="إيقاف الصوت فقط"
          >
            <VolumeX className="w-5 h-5" />
            كتم الصوت
          </button>
        </div>
      </div>
    </div>
  );
};
