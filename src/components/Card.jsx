import { Snowflake, Wifi } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { useTranslation } from '../translations'
import { useLang } from '../contexts/LanguageContext'

export default function Card() {
  const { state, dispatch } = useApp()
  const { lang, dir } = useLang()
  const tr = useTranslation(lang)
  const { card } = state

  const usedPct = Math.round((card.usedAmount / card.monthlyLimit) * 100)

  function handleLimitChange(e) {
    const val = parseInt(e.target.value)
    if (!isNaN(val) && val >= 100 && val <= 2000) {
      dispatch({ type: 'SET_MONTHLY_LIMIT', limit: val })
    }
  }

  return (
    <div className="tab-content space-y-4">
      {/* Virtual bank card */}
      <div className="bank-card-gradient rounded-2xl p-5 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full border-4 border-white" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full border-4 border-white" />
        </div>

        <div className="relative z-10">
          {/* Top row */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs mb-0.5" style={{ color: 'rgba(238,242,247,0.5)' }}>BeforePay</p>
              <p className="text-xs font-semibold" style={{ color: 'rgba(238,242,247,0.8)' }}>
                {tr('virtualCard')} · {tr('recurringPayments')}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Wifi size={20} color="rgba(238,242,247,0.6)" style={{ transform: 'rotate(90deg)' }} />
            </div>
          </div>

          {/* Card number */}
          <p className="text-lg font-mono font-semibold text-white tracking-widest mb-6">
            •••• •••• •••• {card.lastFour}
          </p>

          {/* Bottom row */}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'rgba(238,242,247,0.4)' }}>
                {tr('cardholderName')}
              </p>
              <p className="text-sm font-semibold text-white">{card.holderName[lang]}</p>
            </div>
            <div className={`text-${dir === 'rtl' ? 'left' : 'right'}`}>
              <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'rgba(238,242,247,0.4)' }}>
                {tr('expiryDate')}
              </p>
              <p className="text-sm font-semibold text-white">12/28</p>
            </div>
          </div>
        </div>

        {/* Frozen overlay */}
        {card.frozen && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl z-20"
            style={{ backgroundColor: 'rgba(11,22,38,0.75)', backdropFilter: 'blur(4px)' }}
          >
            <Snowflake size={32} color="#60a5fa" strokeWidth={1.5} />
            <p className="text-sm font-semibold text-blue-300 mt-2">{tr('cardFrozen')}</p>
          </div>
        )}
      </div>

      {/* Usage */}
      <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {tr('monthlyLimitSetting')}
          </p>
          <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
            {card.usedAmount} / {card.monthlyLimit} {tr('sar')}
          </span>
        </div>
        <div className="w-full h-2 rounded-full mb-4" style={{ backgroundColor: 'var(--border)' }}>
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(usedPct, 100)}%`,
              backgroundColor: usedPct > 80 ? '#ef4444' : 'var(--accent)',
            }}
          />
        </div>

        {/* Limit adjuster */}
        <div>
          <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
            {tr('adjustLimit')} ({lang === 'ar' ? 'من 100 إلى 2000 ر.س' : '100 to 2000 SAR'})
          </p>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={100}
              max={2000}
              step={50}
              value={card.monthlyLimit}
              onChange={handleLimitChange}
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: 'var(--accent)' }}
            />
            <div
              className="rounded-xl px-3 py-1.5 text-sm font-bold min-w-[80px] text-center"
              style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}
            >
              {card.monthlyLimit}
            </div>
          </div>
        </div>
      </div>

      {/* Freeze toggle */}
      <div
        className="rounded-2xl p-4 flex items-center justify-between"
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {tr('freezeCard')}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {tr('freezeCardDesc')}
          </p>
        </div>

        <button
          onClick={() => dispatch({ type: 'TOGGLE_FREEZE' })}
          className="relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0"
          style={{
            backgroundColor: card.frozen ? '#3b82f6' : 'var(--border)',
          }}
        >
          <span
            className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300"
            style={{
              [dir === 'rtl'
                ? card.frozen ? 'left' : 'right'
                : card.frozen ? 'right' : 'left'
              ]: '2px',
            }}
          />
        </button>
      </div>

      {/* Card status */}
      <div
        className="rounded-2xl p-4 flex items-center gap-3"
        style={{
          backgroundColor: card.frozen ? 'rgba(59,130,246,0.08)' : 'rgba(34,197,94,0.08)',
          border: `1px solid ${card.frozen ? 'rgba(59,130,246,0.2)' : 'rgba(34,197,94,0.2)'}`,
        }}
      >
        {card.frozen
          ? <Snowflake size={18} color="#60a5fa" />
          : <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
        }
        <p className="text-sm font-medium" style={{ color: card.frozen ? '#60a5fa' : '#22c55e' }}>
          {card.frozen ? tr('cardFrozen') : tr('cardActive')}
        </p>
      </div>
    </div>
  )
}
