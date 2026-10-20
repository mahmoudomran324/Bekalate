import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, X, CheckCircle, AlertTriangle, Truck, RotateCcw } from 'lucide-react';

interface QualityCharterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QualityCharterModal: React.FC<QualityCharterModalProps> = ({ isOpen, onClose }) => {
  const { settings } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-black text-stone-900 text-lg">ميثاق الجودة وسياسة الاسترجاع</h3>
              <p className="text-xs text-stone-500">حماية العميل وحقوق التجار الحقيقيين</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-700 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-1.5 text-emerald-900">
            <h4 className="font-black flex items-center gap-1.5 text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              تعهد الجودة الفائقة (فرز أول)
            </h4>
            <p>
              {settings.qualityCharter || 'نحن في متجر بلدي نضمن لك سلامة ونظافة المحصول من شجرة الفلاح وحتى باب منزلك مع ضمان استرداد فوري للأموال.'}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-800 font-bold flex items-center justify-center shrink-0">
                1
              </div>
              <p>
                <strong>الفرز الأول إجباري:</strong> يلتزم كل تاجر معتمد بتجهيز أصناف طازجة 100% خالية من أي كدمات أو تلف أو عيوب.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-800 font-bold flex items-center justify-center shrink-0">
                2
              </div>
              <p>
                <strong>الاسترجاع الفوري المجاني:</strong> يحق للعميل عند استلام الطلب فحص كافة الأصناف وإرجاع أي صنف غير مطابق للمواصفات واسترداد قيمته فوراً وبدون أي رسوم شحن إضافية.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-800 font-bold flex items-center justify-center shrink-0">
                3
              </div>
              <p>
                <strong>عقوبات التاجر الصارمة:</strong> في حال إرسال أي بضاعة تالفة، يتحمل التاجر تكلفة الشحن وقيمة البضاعة مع إيقاف حسابه فوراً لحين مراجعة الإدارة.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 text-xs flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              فريق المتابعة والمشرفين يراجعون تقييمات العملاء بصفة دورية لضمان أعلى معايير النزاهة.
            </span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition"
          >
            فهمت وموافق على ميثاق الجودة
          </button>
        </div>

      </div>
    </div>
  );
};
