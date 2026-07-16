import { useState } from 'react'
import { TrendingUp, AlertCircle, Clock, XCircle } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { useTranslation } from '../translations'
import { useLang } from '../contexts/LanguageContext'
import ServiceModal from './ServiceModal'

function daysUntil(dateStr) {
  const today = new Date(); today.setHours(0,0,0,0)
  return Math.ceil((new Date(dateStr) - today) / 86400000)
}

function formatDate(dateStr, lang) {
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1)
  if (dateStr === today.toISOString().split('T')[0]) return lang === 'ar' ? 'اليوم' : 'Today'
  if (dateStr === tomorrow.toISOString().split('T')[0]) return lang === 'ar' ? 'غداً' : 'Tomorrow'
  return date.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric' })
}

function StatusChip({ service, tr }) {
  if (service.status === 'needs_decision') {
    return <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>{tr('statusNeedsDecision')}</span>
  }
  if (service.status === 'trial_ending') {
    return <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}>{tr('statusTrialEnding')}</span>
  }
  if (service.status === 'unused') {
    return <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(99,102,241,0.12)', color: '#6366f1' }}>{tr('statusUnused')}</span>
  }
  return <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>{tr('statusActive')}</span>
}

export default function Payments() {
  const { state } = useApp()
  const { lang } = useLang()
  const tr = useTranslation(lang)
  const [filter, setFilter] = useState(30)
  const [selected, setSelected] = useState(null)

  const filtered = state.services
    .filter(s => daysUntil(s.nextDate) <= filter && daysUntil(s.nextDate) >= 0)
    .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate))

  const total = filtered.reduce((sum, s) => sum + s.amount, 0)

  return (
    <div className="tab-content space-y-4">
      <ServiceModal service={selected} onClose={() => setSelected(null)} />
      {/* Filter toggle */}
      <div className="flex items-center gap-2">
        <div
          className="flex rounded-xl p-1 gap-1"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          {[7, 30].map(days => (
            <button
              key={days}
              onClick={() => setFilter(days)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: filter === days ? 'var(--accent)' : 'transparent',
                color: filter === days ? 'white' : 'var(--text-secondary)',
              }}
            >
              {days === 7 ? tr('filter7days') : tr('filter30days')}
            </button>
          ))}
        </div>
        <span className="text-xs ms-auto" style={{ color: 'var(--text-secondary)' }}>
          {filtered.length} {lang === 'ar' ? 'خدمة' : 'services'} · {total} {tr('sar')}
        </span>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-12 gap-2">
          <XCircle size={32} style={{ color: 'var(--text-secondary)', opacity: 0.4 }} />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{tr('noPaymentsInRange')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(s => {
            const days = daysUntil(s.nextDate)
            const isUrgent = s.status === 'needs_decision'
            return (
              <div
                key={s.id}
                className="rounded-xl p-3 border transition-all cursor-pointer hover:opacity-90 active:scale-[0.99]"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: isUrgent ? 'rgba(239,68,68,0.3)' : 'transparent',
                }}
                onClick={() => setSelected(s)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.logo}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {s.name[lang]}
                      </p>
                      <StatusChip service={s} tr={tr} />
                      {s.priceChanged && (
                        <TrendingUp size={12} color="#ef4444" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {s.category[lang]}
                      </p>
                      <span style={{ color: 'var(--border)' }}>·</span>
                      <p className="text-xs" style={{ color: days <= 3 ? '#f59e0b' : 'var(--text-secondary)' }}>
                        {formatDate(s.nextDate, lang)}
                      </p>
                    </div>
                  </div>

                  <div className={`text-${lang === 'ar' ? 'left' : 'right'} flex-shrink-0`}>
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      {s.amount} <span className="text-xs font-normal">{tr('sar')}</span>
                    </p>
                    {s.oldAmount && (
                      <p className="text-xs line-through" style={{ color: 'var(--text-secondary)' }}>
                        {s.oldAmount} {tr('sar')}
                      </p>
                    )}
                    {s.unusedDays > 0 && (
                      <p className="text-[10px]" style={{ color: '#6366f1' }}>
                        {s.unusedDays} {lang === 'ar' ? 'يوم بدون استخدام' : 'days unused'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Decision result */}
                {s.decision && (
                  <div className="mt-2 pt-2 flex items-center gap-1.5" style={{ borderTop: '1px solid var(--border)' }}>
                    <Clock size={11} style={{ color: 'var(--text-secondary)' }} />
                    <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                      {s.decision === 'continued' ? tr('decisionContinued')
                       : s.decision === 'postponed' ? tr('decisionPostponed')
                       : tr('decisionFrozen')}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
