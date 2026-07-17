import { useState } from 'react'
import { Shield, Eye, Lock, TrendingUp, CheckCircle2 } from 'lucide-react'

const POINTS = [
  {
    icon: Eye,
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.1)',
    ar: 'عرض بيانات اشتراكاتك وتحليلها لمساعدتك في اتخاذ قرارات مالية أفضل.',
    en: 'View and analyze your subscription data to help you make better financial decisions.',
  },
  {
    icon: TrendingUp,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    ar: 'رصد تغيّرات الأسعار وتنبيهك فور ارتفاع أي اشتراك.',
    en: 'Monitor price changes and alert you whenever a subscription price increases.',
  },
  {
    icon: Lock,
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.1)',
    ar: 'بياناتك محمية ولن تُشارَك مع أي طرف ثالث بدون إذنك.',
    en: 'Your data is protected and will never be shared with third parties without your consent.',
  },
  {
    icon: Shield,
    color: '#C1552E',
    bg: 'rgba(193,85,46,0.1)',
    ar: 'تخضع جميع العمليات لمعايير الأمان الخاصة ببنك الإنماء.',
    en: 'All operations comply with Inma Bank\'s security standards.',
  },
]

export default function ConsentScreen({ onAccept, lang }) {
  const [checked, setChecked] = useState(false)
  const isAr = lang === 'ar'

  return (
    <div
      className="fixed inset-0 z-[500] flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: 'var(--bg)' }}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-md flex flex-col gap-6">

        {/* Logo + Brand */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: '#C1552E' }}
          >
            <Shield size={30} color="white" strokeWidth={2} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              BeforePay
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {isAr ? 'بنك الإنماء' : 'Inma Bank'}
            </p>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {isAr ? 'قبل أن تبدأ' : 'Before You Begin'}
          </h2>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {isAr
              ? 'نحتاج إلى إذنك لاستخدام بياناتك المالية من أجل تقديم خدمة BeforePay. يرجى مراجعة الأذونات التالية.'
              : 'We need your permission to use your financial data to deliver the BeforePay service. Please review the following permissions.'}
          </p>
        </div>

        {/* Permission points */}
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)' }}>
          {POINTS.map((p, i) => {
            const Icon = p.icon
            return (
              <div
                key={i}
                className="flex items-start gap-3 p-4"
                style={{ borderBottom: i < POINTS.length - 1 ? '1px solid var(--border)' : 'none' }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: p.bg }}
                >
                  <Icon size={16} color={p.color} strokeWidth={2} />
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {isAr ? p.ar : p.en}
                </p>
              </div>
            )
          })}
        </div>

        {/* Checkbox */}
        <button
          className="flex items-center gap-3 text-start"
          onClick={() => setChecked(v => !v)}
        >
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              backgroundColor: checked ? '#C1552E' : 'transparent',
              border: checked ? '2px solid #C1552E' : '2px solid var(--border)',
            }}
          >
            {checked && <CheckCircle2 size={14} color="white" strokeWidth={3} />}
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {isAr
              ? 'أقر بأنني قرأت وفهمت سياسة استخدام البيانات، وأوافق على منح BeforePay الأذونات المذكورة أعلاه.'
              : 'I confirm that I have read and understood the data usage policy, and I agree to grant BeforePay the permissions listed above.'}
          </p>
        </button>

        {/* Accept button */}
        <button
          onClick={() => checked && onAccept()}
          className="w-full py-4 rounded-2xl text-base font-bold text-white transition-all"
          style={{
            backgroundColor: checked ? '#C1552E' : 'var(--border)',
            cursor: checked ? 'pointer' : 'not-allowed',
            opacity: checked ? 1 : 0.5,
          }}
        >
          {isAr ? 'أوافق وأبدأ' : 'I Agree & Continue'}
        </button>

        {/* Footer note */}
        <p className="text-center text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
          {isAr
            ? 'يمكنك سحب موافقتك في أي وقت من إعدادات الحساب.'
            : 'You can withdraw your consent at any time from account settings.'}
        </p>
      </div>
    </div>
  )
}
