import { CheckCircle, Clock, Snowflake, AlertTriangle, ArrowLeft, ArrowRight, TrendingUp, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { useTranslation } from '../translations'
import { useLang } from '../contexts/LanguageContext'
import ServiceModal from './ServiceModal'

function formatDate(dateStr, lang) {
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1)
  if (dateStr === today.toISOString().split('T')[0]) return lang === 'ar' ? 'اليوم' : 'Today'
  if (dateStr === tomorrow.toISOString().split('T')[0]) return lang === 'ar' ? 'غداً' : 'Tomorrow'
  return date.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric' })
}

function daysUntil(dateStr) {
  const today = new Date(); today.setHours(0,0,0,0)
  const target = new Date(dateStr)
  return Math.ceil((target - today) / 86400000)
}

function StatusBadge({ service, lang, tr }) {
  if (service.status === 'needs_decision') {
    return (
      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
        {tr('statusNeedsDecision')}
      </span>
    )
  }
  if (service.priceChanged) {
    return (
      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
        {tr('priceIncreased')}
      </span>
    )
  }
  if (service.trialEnding) {
    return (
      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}>
        {tr('trialEnding')}
      </span>
    )
  }
  if (service.unusedDays > 0) {
    return (
      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(99,102,241,0.12)', color: '#6366f1' }}>
        {tr('unused')}
      </span>
    )
  }
  return null
}

export default function Home({ setActive }) {
  const { state, dispatch } = useApp()
  const { lang, dir } = useLang()
  const tr = useTranslation(lang)
  const [selected, setSelected] = useState(null)

  const { services, card } = state
  const needsDecision = services.find(s => s.status === 'needs_decision')
  const upcoming = services
    .filter(s => daysUntil(s.nextDate) <= 7)
    .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate))
    .slice(0, 3)

  const usedPct = Math.round((card.usedAmount / card.monthlyLimit) * 100)
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight

  function handleDecision(id, decision) {
    dispatch({ type: 'SET_DECISION', id, decision })
  }

  const decisionService = needsDecision && needsDecision.decision ? null : needsDecision

  return (
    <div className="tab-content space-y-4">
      <ServiceModal service={selected} onClose={() => setSelected(null)} />
      {/* Monthly card */}
      <div
        className="rounded-2xl p-4"
        style={{ backgroundColor: '#0D1B2E' }}
      >
        <p className="text-xs font-medium mb-3" style={{ color: 'rgba(238,242,247,0.6)' }}>
          {tr('recurringCard')}
        </p>
        <div className="flex items-end justify-between mb-3">
          <div>
            <span className="text-3xl font-bold text-white">{card.usedAmount}</span>
            <span className="text-sm ms-1" style={{ color: 'rgba(238,242,247,0.6)' }}>
              {tr('sar')}
            </span>
          </div>
          <div className={`text-${dir === 'rtl' ? 'left' : 'right'}`}>
            <p className="text-xs" style={{ color: 'rgba(238,242,247,0.5)' }}>{tr('monthlyLimit')}</p>
            <p className="text-sm font-semibold text-white">{card.monthlyLimit} {tr('sar')}</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
          <div
            className="h-2 rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(usedPct, 100)}%`,
              backgroundColor: usedPct > 80 ? '#ef4444' : 'var(--accent)',
            }}
          />
        </div>
        <p className="text-xs mt-2" style={{ color: 'rgba(238,242,247,0.5)' }}>
          {usedPct}% {tr('usedOf')} {card.monthlyLimit} {tr('sar')}
        </p>
        {card.frozen && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: 'rgba(59,130,246,0.2)' }}>
            <Snowflake size={14} color="#60a5fa" />
            <span className="text-xs text-blue-300">{tr('cardFrozen')}</span>
          </div>
        )}
      </div>

      {/* Needs decision card */}
      {decisionService && (
        <div
          className="rounded-2xl p-4 border"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'rgba(239,68,68,0.25)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} color="#ef4444" />
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {tr('needsDecisionToday')}
            </p>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
              style={{ backgroundColor: decisionService.color }}
            >
              {decisionService.logo}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                {decisionService.name[lang]}
              </p>
              <div className="flex items-center gap-1.5">
                {decisionService.priceChanged && (
                  <TrendingUp size={12} color="#ef4444" />
                )}
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {decisionService.amount} {tr('sar')} · {formatDate(decisionService.nextDate, lang)}
                </span>
                {decisionService.oldAmount && (
                  <span className="text-xs line-through" style={{ color: 'var(--text-secondary)' }}>
                    {decisionService.oldAmount}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Reasons */}
          {decisionService.reasons && (
            <ul className="space-y-1.5 mb-4">
              {decisionService.reasons[lang].map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold" style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
                    {i + 1}
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDecision(decisionService.id, 'continued')}
              className="py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
              style={{ backgroundColor: 'var(--accent)', color: 'white' }}
            >
              {tr('btnContinue')}
            </button>
            <button
              onClick={() => handleDecision(decisionService.id, 'postponed')}
              className="py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', backgroundColor: 'transparent' }}
            >
              {tr('btnPostpone')}
            </button>
            <button
              onClick={() => handleDecision(decisionService.id, 'frozen')}
              className="py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
              style={{ backgroundColor: 'rgba(59,130,246,0.12)', color: '#60a5fa' }}
            >
              {tr('btnFreeze')}
            </button>
          </div>
        </div>
      )}

      {/* Decision result feedback */}
      {needsDecision && needsDecision.decision && (
        <div
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{ backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}
        >
          <CheckCircle size={18} color="#22c55e" className="flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium" style={{ color: '#22c55e' }}>
              {needsDecision.decision === 'continued' ? tr('decisionContinued')
               : needsDecision.decision === 'postponed' ? tr('decisionPostponed')
               : tr('decisionFrozen')}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {needsDecision.name[lang]}
            </p>
          </div>
          <button
            onClick={() => dispatch({ type: 'CLEAR_DECISION', id: needsDecision.id })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 flex-shrink-0"
            style={{ borderColor: 'rgba(34,197,94,0.3)', color: '#22c55e', backgroundColor: 'rgba(34,197,94,0.08)' }}
          >
            <RotateCcw size={12} strokeWidth={2.5} />
            {tr('btnUndo')}
          </button>
        </div>
      )}

      {/* Upcoming payments */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {tr('upcomingPayments')}
          </h2>
          <button
            onClick={() => setActive('payments')}
            className="flex items-center gap-1 text-xs font-medium transition-all"
            style={{ color: 'var(--accent)' }}
          >
            {tr('viewAll')}
            <ArrowIcon size={13} />
          </button>
        </div>

        <div className="space-y-2">
          {upcoming.map(s => (
            <div
              key={s.id}
              className="rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:opacity-90 active:scale-[0.99] transition-all"
              style={{ backgroundColor: 'var(--bg-card)' }}
              onClick={() => setSelected(s)}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                style={{ backgroundColor: s.color }}
              >
                {s.logo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {s.name[lang]}
                  </p>
                  <StatusBadge service={s} lang={lang} tr={tr} />
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {formatDate(s.nextDate, lang)}
                </p>
              </div>
              <span className="text-sm font-semibold flex-shrink-0" style={{ color: 'var(--text-primary)' }}>
                {s.amount} {tr('sar')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
