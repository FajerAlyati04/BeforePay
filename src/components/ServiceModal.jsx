import { X, ExternalLink, Calendar, TrendingUp, RefreshCw, Play, CreditCard, XCircle } from 'lucide-react'
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

  const riskLabel =
    service.riskLevel === 'high'
      ? (lang === 'ar' ? 'خطر عالٍ' : 'High Risk')
      : service.riskLevel === 'medium'
      ? (lang === 'ar' ? 'خطر متوسط' : 'Med Risk')
      : (lang === 'ar' ? 'خطر منخفض' : 'Low Risk')

  const priceChangePct = service.oldAmount
    ? Math.round(((service.amount - service.oldAmount) / service.oldAmount) * 100)
    : null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.82)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg flex flex-col rounded-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--bg-card)', maxHeight: '86vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex-shrink-0 flex items-center gap-4 p-5 pb-4">
          {/* Large logo */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-white text-2xl flex-shrink-0 shadow-lg"
            style={{ backgroundColor: service.color }}
          >
            {service.logo}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-xl leading-tight" style={{ color: 'var(--text-primary)' }}>
              {service.name[lang]}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {service.category[lang]}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:opacity-70"
            style={{ backgroundColor: 'var(--bg)' }}
          >
            <X size={16} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-4">

          {/* Price block */}
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? 'المبلغ الشهري' : 'Monthly Amount'}
            </p>
            <div className="flex items-end justify-between gap-2">
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold leading-none" style={{ color: 'var(--text-primary)' }}>
                  {service.amount}
                </span>
                <span className="text-lg font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  {tr('sar')}
                  {service.oldAmount && (
                    <span className="ms-1.5 line-through text-base font-normal">
                      ({service.oldAmount})
                    </span>
                  )}
                </span>
              </div>
              {/* Risk badge */}
              <div
                className="flex-shrink-0 px-3 py-1.5 rounded-xl text-sm font-bold"
                style={{ backgroundColor: riskColor + '18', color: riskColor }}
              >
                {riskLabel}
              </div>
            </div>
          </div>

          {/* Price change banner */}
          {service.priceChanged && priceChangePct && (
            <div
              className="flex items-center gap-3 p-3.5 rounded-xl"
              style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <TrendingUp size={18} color="#ef4444" strokeWidth={2} className="flex-shrink-0" />
              <p className="text-sm font-semibold" style={{ color: '#ef4444' }}>
                {lang === 'ar'
                  ? `السعر ارتفع من ${service.oldAmount} إلى ${service.amount} ${tr('sar')} (+${priceChangePct}%)`
                  : `Price raised from ${service.oldAmount} to ${service.amount} SAR (+${priceChangePct}%)`}
              </p>
            </div>
          )}

          {/* Description */}
          {service.description && (
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {service.description[lang]}
            </p>
          )}

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-4 rounded-xl space-y-2" style={{ backgroundColor: 'var(--bg)' }}>
              <div className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                <Calendar size={14} />
                <span className="text-xs">{lang === 'ar' ? 'الفاتورة القادمة' : 'Next Billing'}</span>
              </div>
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                {formatDate(service.nextDate, lang)}
              </p>
            </div>
            <div className="p-4 rounded-xl space-y-2" style={{ backgroundColor: 'var(--bg)' }}>
              <div className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                <RefreshCw size={14} />
                <span className="text-xs">{lang === 'ar' ? 'دورة الفوترة' : 'Billing Cycle'}</span>
              </div>
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                {service.billingCycle?.[lang] ?? '—'}
              </p>
            </div>
            <div className="p-4 rounded-xl space-y-2 col-span-2" style={{ backgroundColor: 'var(--bg)' }}>
              <div className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                <Play size={13} />
                <span className="text-xs">{lang === 'ar' ? 'تاريخ البدء' : 'Start Date'}</span>
              </div>
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                {service.startDate ? formatDate(service.startDate, lang) : '—'}
              </p>
            </div>
          </div>

          {/* Features */}
          {service.features && (
            <div>
              <p className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'المميزات المشمولة' : 'Included Features'}
              </p>
              <div className="space-y-2.5">
                {service.features[lang].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: service.color }}
                    />
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pay Now + Cancel Plan */}
          {service.status === 'needs_decision' && (
            <div className="flex gap-2.5 pt-1">
              <button
                onClick={() => {
                  dispatch({ type: 'PAY_SERVICE', amount: service.amount })
                  dispatch({ type: 'SET_DECISION', id: service.id, decision: 'continued' })
                  onClose()
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white transition-all active:scale-95"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                <CreditCard size={15} />
                {lang === 'ar' ? 'ادفع الآن' : 'Pay Now'}
              </button>
              <button
                onClick={() => {
                  dispatch({ type: 'SET_DECISION', id: service.id, decision: 'frozen' })
                  onClose()
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all active:scale-95"
                style={{ border: '1.5px solid #ef4444', color: '#ef4444' }}
              >
                <XCircle size={15} />
                {lang === 'ar' ? 'إلغاء الاشتراك' : 'Cancel Plan'}
              </button>
            </div>
          )}

          {/* Visit Website */}
          {service.website && (
            <a
              href={service.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-95"
              style={{ backgroundColor: 'var(--bg)', color: 'var(--text-secondary)' }}
            >
              <ExternalLink size={15} />
              {lang === 'ar' ? 'زيارة الموقع' : 'Visit Website'}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
