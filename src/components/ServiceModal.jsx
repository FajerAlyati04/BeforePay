import { X, ExternalLink, Calendar, TrendingUp, AlertCircle, Clock, CreditCard, XCircle } from 'lucide-react'
import { useLang } from '../contexts/LanguageContext'
import { useTranslation } from '../translations'
import { useApp } from '../contexts/AppContext'

function formatDate(dateStr, lang) {
  return new Date(dateStr).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export default function ServiceModal({ service, onClose }) {
  const { lang } = useLang()
  const tr = useTranslation(lang)
  const { dispatch } = useApp()

  if (!service) return null

  const riskColor =
    service.riskLevel === 'high' ? '#ef4444' :
    service.riskLevel === 'medium' ? '#f59e0b' : '#22c55e'

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--bg-card)', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-lg flex-shrink-0"
            style={{ backgroundColor: service.color }}
          >
            {service.logo}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              {service.name[lang]}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {service.category[lang]}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-70"
            style={{ backgroundColor: 'var(--bg)' }}
          >
            <X size={16} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Price */}
          <div className="flex items-center justify-between p-4 rounded-2xl" style={{ backgroundColor: 'var(--bg)' }}>
            <div>
              <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'المبلغ الشهري' : 'Monthly Amount'}
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {service.amount} <span className="text-sm font-normal">{tr('sar')}</span>
              </p>
              {service.oldAmount && (
                <p className="text-xs mt-0.5 line-through" style={{ color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'كان' : 'was'} {service.oldAmount} {tr('sar')}
                </p>
              )}
            </div>
            <div
              className="text-xs font-semibold px-3 py-1.5 rounded-xl"
              style={{ backgroundColor: riskColor + '18', color: riskColor }}
            >
              {service.riskLevel === 'high' ? (lang === 'ar' ? 'خطر عالٍ' : 'High Risk') :
               service.riskLevel === 'medium' ? (lang === 'ar' ? 'خطر متوسط' : 'Med Risk') :
               (lang === 'ar' ? 'خطر منخفض' : 'Low Risk')}
            </div>
          </div>

          {/* Description */}
          {service.description && (
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {service.description[lang]}
            </p>
          )}

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                icon: <Calendar size={14} />,
                label: lang === 'ar' ? 'الفاتورة القادمة' : 'Next Billing',
                value: formatDate(service.nextDate, lang),
              },
              {
                icon: <Clock size={14} />,
                label: lang === 'ar' ? 'دورة الفوترة' : 'Billing Cycle',
                value: service.billingCycle?.[lang] ?? '—',
              },
              {
                icon: <Calendar size={14} />,
                label: lang === 'ar' ? 'تاريخ البدء' : 'Start Date',
                value: service.startDate ? formatDate(service.startDate, lang) : '—',
              },
              ...(service.unusedDays > 0 ? [{
                icon: <AlertCircle size={14} color="#6366f1" />,
                label: lang === 'ar' ? 'أيام بدون استخدام' : 'Days Unused',
                value: service.unusedDays + (lang === 'ar' ? ' يوم' : ' days'),
                highlight: true,
              }] : []),
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg)' }}>
                <div className="flex items-center gap-1.5 mb-1" style={{ color: 'var(--text-secondary)' }}>
                  {item.icon}
                  <span className="text-[10px]">{item.label}</span>
                </div>
                <p className="text-xs font-semibold" style={{ color: item.highlight ? '#6366f1' : 'var(--text-primary)' }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Features */}
          {service.features && (
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'المميزات المشمولة' : 'Included Features'}
              </p>
              <div className="space-y-1.5">
                {service.features[lang].map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: service.color }} />
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price increase warning */}
          {service.priceChanged && service.reasons && (
            <div
              className="rounded-xl p-3 space-y-1.5"
              style={{ backgroundColor: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <div className="flex items-center gap-1.5">
                <TrendingUp size={13} color="#ef4444" />
                <p className="text-xs font-semibold" style={{ color: '#ef4444' }}>
                  {lang === 'ar' ? 'تنبيه الذكاء الاصطناعي' : 'AI Alert'}
                </p>
              </div>
              {service.reasons[lang].map((r, i) => (
                <p key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>• {r}</p>
              ))}
            </div>
          )}

          {/* Pay Now + Cancel Plan — for needs_decision services */}
          {service.status === 'needs_decision' && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  dispatch({ type: 'PAY_SERVICE', amount: service.amount })
                  dispatch({ type: 'SET_DECISION', id: service.id, decision: 'continued' })
                  onClose()
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                <CreditCard size={14} />
                {lang === 'ar' ? 'ادفع الآن' : 'Pay Now'}
              </button>
              <button
                onClick={() => {
                  dispatch({ type: 'SET_DECISION', id: service.id, decision: 'frozen' })
                  onClose()
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
                style={{ backgroundColor: 'transparent', border: '1.5px solid #ef4444', color: '#ef4444' }}
              >
                <XCircle size={14} />
                {lang === 'ar' ? 'إلغاء الاشتراك' : 'Cancel Plan'}
              </button>
            </div>
          )}

          {/* Website link */}
          {service.website && (
            <a
              href={service.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
              style={{ backgroundColor: service.color + '18', color: service.color }}
            >
              <ExternalLink size={14} />
              {lang === 'ar' ? 'زيارة الموقع' : 'Visit Website'}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
