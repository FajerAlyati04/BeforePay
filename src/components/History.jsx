import { paymentHistory } from '../data'
import { useLang } from '../contexts/LanguageContext'
import { useTranslation } from '../translations'

const STATUS = {
  paid: {
    label: { ar: 'مدفوع', en: 'Paid' },
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.1)',
    icon: '✓',
  },
  refunded: {
    label: { ar: 'مُسترد', en: 'Refunded' },
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    icon: '⟳',
  },
  pending: {
    label: { ar: 'قيد المعالجة', en: 'Pending' },
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.1)',
    icon: '◷',
  },
  failed: {
    label: { ar: 'فشل', en: 'Failed' },
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.1)',
    icon: '✕',
  },
}

function formatDate(dateStr, lang) {
  return new Date(dateStr).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function History() {
  const { lang } = useLang()
  const tr = useTranslation(lang)

  const totalPaid = paymentHistory.reduce((sum, g) => {
    return sum + g.payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  }, 0)

  return (
    <div className="tab-content space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
          {lang === 'ar' ? 'تاريخ المدفوعات' : 'Payment History'}
        </h1>
        <div className="flex items-center gap-1.5 mt-2">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{ backgroundColor: 'rgba(34,197,94,0.1)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
            </svg>
            <span className="text-xs font-bold" style={{ color: '#22c55e' }}>
              {totalPaid} {tr('sar')}
            </span>
            <span className="text-xs" style={{ color: '#22c55e', opacity: 0.8 }}>
              {lang === 'ar' ? 'إجمالي المدفوع' : 'total paid'}
            </span>
          </div>
        </div>
      </div>

      {/* Months */}
      {paymentHistory.map((group, gi) => (
        <div key={gi} className="space-y-2">
          {/* Month header */}
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {group.month[lang]}
            </span>
            <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
              {group.total} {tr('sar')}
            </span>
          </div>

          {/* Payment rows */}
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)' }}>
            {group.payments.map((p, i) => {
              const st = STATUS[p.status] || STATUS.paid
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-3 px-4 py-3.5"
                  style={{
                    borderBottom: i < group.payments.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.logo}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                      {p.name[lang]}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                      {p.category[lang]} · {formatDate(p.date, lang)}
                    </p>
                  </div>

                  {/* Amount + status */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      {p.status === 'refunded' ? '+' : ''}{p.amount} {tr('sar')}
                    </span>
                    <div
                      className="flex items-center gap-1 px-2 py-0.5 rounded-lg"
                      style={{ backgroundColor: st.bg }}
                    >
                      <span style={{ color: st.color, fontSize: 10, fontWeight: 700 }}>{st.icon}</span>
                      <span className="text-[10px] font-semibold" style={{ color: st.color }}>
                        {st.label[lang]}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
