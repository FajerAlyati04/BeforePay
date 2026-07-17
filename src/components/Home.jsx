import {
  CheckCircle, Clock, Snowflake, ArrowLeft, ArrowRight,
  TrendingUp, RotateCcw, CreditCard, Bell,
} from 'lucide-react'
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
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return Math.ceil((new Date(dateStr) - today) / 86400000)
}

function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-1 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
      <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{children}</h2>
    </div>
  )
}

export default function Home({ setActive }) {
  const { state, dispatch } = useApp()
  const { lang, dir } = useLang()
  const tr = useTranslation(lang)
  const [selected, setSelected] = useState(null)
  const [pendingAction, setPendingAction] = useState(null) // 'continue' | 'freeze' | null

  const { services, card } = state
  const needsDecision = services.find(s => s.status === 'needs_decision')
  const upcoming = services
    .filter(s => daysUntil(s.nextDate) <= 7)
    .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate))
    .slice(0, 4)

  const usedPct = Math.round((card.usedAmount / card.monthlyLimit) * 100)
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight

  function handleActionClick(action) {
    if (action === 'continue') {
      setPendingAction('continue')
    } else if (action === 'freeze') {
      setPendingAction('freeze')
    } else {
      dispatch({ type: 'SET_DECISION', id: needsDecision.id, decision: 'postponed' })
    }
  }

  function confirmContinue() {
    dispatch({ type: 'PAY_SERVICE', amount: needsDecision.amount })
    dispatch({ type: 'SET_DECISION', id: needsDecision.id, decision: 'continued' })
    setPendingAction(null)
  }

  function confirmFreeze() {
    dispatch({ type: 'SET_DECISION', id: needsDecision.id, decision: 'frozen' })
    setPendingAction(null)
  }

  const showButtons = needsDecision && !needsDecision.decision && !pendingAction

  return (
    <div className="tab-content space-y-4">
      <ServiceModal service={selected} onClose={() => setSelected(null)} />

      {/* Monthly spend card */}
      <div className="rounded-2xl p-4" style={{ backgroundColor: '#10253F' }}>
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-xs mb-1" style={{ color: 'rgba(238,242,247,0.55)' }}>
              {tr('recurringCard')}
            </p>
            <div className="flex items-end gap-1">
              <span className="text-3xl font-bold text-white">{card.usedAmount}</span>
              <span className="text-sm mb-0.5" style={{ color: 'rgba(238,242,247,0.6)' }}>{tr('sar')}</span>
            </div>
          </div>
          <div className={`text-${dir === 'rtl' ? 'left' : 'right'}`}>
            <p className="text-xs" style={{ color: 'rgba(238,242,247,0.5)' }}>{tr('monthlyLimit')}</p>
            <p className="text-sm font-semibold text-white">{card.monthlyLimit} {tr('sar')}</p>
          </div>
        </div>
        <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
          <div
            className="h-2 rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(usedPct, 100)}%`,
              backgroundColor: usedPct > 80 ? '#ef4444' : '#22c55e',
            }}
          />
        </div>
        <p className="text-xs mt-2" style={{ color: 'rgba(238,242,247,0.45)' }}>
          {usedPct}% {tr('usedOf')} {card.monthlyLimit} {tr('sar')}
        </p>
        {card.frozen && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: 'rgba(59,130,246,0.2)' }}>
            <Snowflake size={13} color="#60a5fa" />
            <span className="text-xs text-blue-300">{tr('cardFrozen')}</span>
          </div>
        )}
      </div>

      {/* AI Decision section */}
      {needsDecision && (
        <div>
          <SectionTitle>{lang === 'ar' ? 'قرار الذكاء الاصطناعي' : 'AI Decision'}</SectionTitle>

          {/* Default buttons state */}
          {showButtons && (
            <div
              className="rounded-2xl p-4"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                  style={{ backgroundColor: needsDecision.color }}
                >
                  {needsDecision.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                      {needsDecision.name[lang]}
                    </p>
                    {needsDecision.priceChanged && (
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#ef4444' }}
                      >
                        +72%
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {needsDecision.oldAmount
                      ? (lang === 'ar'
                          ? `ارتفع السعر من ${needsDecision.oldAmount} إلى ${needsDecision.amount} ريال`
                          : `Price raised from ${needsDecision.oldAmount} to ${needsDecision.amount} SAR`)
                      : `${needsDecision.amount} ${tr('sar')}`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleActionClick('continue')}
                  className="py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22c55e' }}
                >
                  <CheckCircle size={13} strokeWidth={2.5} />
                  {tr('btnContinue')}
                </button>
                <button
                  onClick={() => handleActionClick('postpone')}
                  className="py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  style={{ backgroundColor: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}
                >
                  <Clock size={13} strokeWidth={2.5} />
                  {tr('btnPostpone')}
                </button>
                <button
                  onClick={() => handleActionClick('freeze')}
                  className="py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#ef4444' }}
                >
                  <Snowflake size={13} strokeWidth={2.5} />
                  {tr('btnFreeze')}
                </button>
              </div>
            </div>
          )}

          {/* Confirmation: Continue → Pay */}
          {pendingAction === 'continue' && (
            <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-card)' }}>
              <div className="flex items-center gap-2 mb-1">
                <CreditCard size={16} color="var(--accent)" />
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?'}
                </p>
              </div>
              <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'ar'
                  ? `سيتم خصم ${needsDecision.amount} ريال لـ ${needsDecision.name.ar} من بطاقة مدفوعاتك المتكررة.`
                  : `This will charge ${needsDecision.amount} SAR for ${needsDecision.name.en} from your recurring payments card.`}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={confirmContinue}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  <CreditCard size={14} />
                  {lang === 'ar' ? 'نعم، ادفع الآن' : 'Yes, Pay Now'}
                </button>
                <button
                  onClick={() => setPendingAction(null)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold border transition-all active:scale-95"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', backgroundColor: 'transparent' }}
                >
                  {lang === 'ar' ? 'رجوع' : 'Go Back'}
                </button>
              </div>
            </div>
          )}

          {/* Confirmation: Freeze */}
          {pendingAction === 'freeze' && (
            <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-card)' }}>
              <div className="flex items-center gap-2 mb-1">
                <Snowflake size={16} color="#ef4444" />
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?'}
                </p>
              </div>
              <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'ar'
                  ? `سيتم تجميد اشتراك ${needsDecision.name.ar}. لن يتم إجراء أي خصومات.`
                  : `This will freeze the ${needsDecision.name.en} subscription. No charges will be made.`}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={confirmFreeze}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
                  style={{ backgroundColor: '#ef4444' }}
                >
                  <Snowflake size={14} />
                  {lang === 'ar' ? 'نعم، جمّد' : 'Yes, Freeze'}
                </button>
                <button
                  onClick={() => setPendingAction(null)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold border transition-all active:scale-95"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', backgroundColor: 'transparent' }}
                >
                  {lang === 'ar' ? 'رجوع' : 'Go Back'}
                </button>
              </div>
            </div>
          )}

          {/* Result: Continued (payment processed) */}
          {needsDecision.decision === 'continued' && (
            <div
              className="rounded-2xl p-4"
              style={{ backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle size={16} color="#22c55e" className="flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: '#22c55e' }}>
                    {lang === 'ar' ? 'تم الدفع بنجاح' : 'Payment Processed'}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {needsDecision.name[lang]} · {needsDecision.amount} {tr('sar')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Result: Postponed */}
          {needsDecision.decision === 'postponed' && (
            <div className="rounded-2xl p-4 space-y-2.5" style={{ backgroundColor: 'var(--bg-card)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={15} color="#f59e0b" />
                  <span className="text-sm font-semibold" style={{ color: '#f59e0b' }}>
                    {lang === 'ar' ? 'مؤجل' : 'Postponed'} · {needsDecision.name[lang]}
                  </span>
                </div>
                <button
                  onClick={() => dispatch({ type: 'CLEAR_DECISION', id: needsDecision.id })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
                  style={{ backgroundColor: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}
                >
                  <RotateCcw size={11} strokeWidth={2.5} />
                  {tr('btnUndo')}
                </button>
              </div>
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ backgroundColor: 'rgba(245,158,11,0.08)' }}
              >
                <Bell size={12} color="#f59e0b" className="flex-shrink-0" />
                <span className="text-xs" style={{ color: '#f59e0b' }}>
                  {lang === 'ar' ? 'سنذكرك بعد يومين بهذه العملية' : "We'll remind you in 2 days about this charge"}
                </span>
              </div>
            </div>
          )}

          {/* Result: Frozen */}
          {needsDecision.decision === 'frozen' && (
            <div
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{ backgroundColor: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
            >
              <Snowflake size={16} color="#60a5fa" className="flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: '#60a5fa' }}>
                  {lang === 'ar' ? 'تم التجميد' : 'Frozen'}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {needsDecision.name[lang]}
                </p>
              </div>
              <button
                onClick={() => dispatch({ type: 'CLEAR_DECISION', id: needsDecision.id })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold flex-shrink-0 transition-all active:scale-95"
                style={{ backgroundColor: 'rgba(59,130,246,0.12)', color: '#60a5fa' }}
              >
                <RotateCcw size={11} strokeWidth={2.5} />
                {tr('btnUndo')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Upcoming payments */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <SectionTitle>{lang === 'ar' ? 'أقرب المدفوعات' : 'Upcoming Payments'}</SectionTitle>
          <button
            onClick={() => setActive('payments')}
            className="flex items-center gap-1 text-xs font-medium transition-all"
            style={{ color: 'var(--accent)' }}
          >
            {tr('viewAll')}
            <ArrowIcon size={13} />
          </button>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)' }}>
          {upcoming.map((s, i) => {
            const days = daysUntil(s.nextDate)
            const dotColor = s.status === 'needs_decision' ? '#ef4444'
              : s.unusedDays > 0 ? '#6366f1'
              : s.trialEnding ? '#8b5cf6'
              : '#22c55e'
            return (
              <div
                key={s.id}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:opacity-90 active:scale-[0.99] transition-all"
                style={{ borderBottom: i < upcoming.length - 1 ? '1px solid var(--border)' : 'none' }}
                onClick={() => setSelected(s)}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                  style={{ backgroundColor: s.color + '22', color: s.color }}
                >
                  {s.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {s.name[lang]}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {days === 0 ? (lang === 'ar' ? 'اليوم' : 'Today')
                      : days === 1 ? (lang === 'ar' ? 'غداً' : 'Tomorrow')
                      : `${days} ${lang === 'ar' ? 'أيام' : 'days'}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    {s.amount} <span className="text-xs font-normal">{tr('sar')}</span>
                  </span>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
