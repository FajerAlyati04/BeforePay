import { Snowflake, CreditCard, Wallet, ChevronRight } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { useTranslation } from '../translations'
import { useLang } from '../contexts/LanguageContext'

const PRESETS = [100, 400, 1000, 2000]

export default function Card() {
  const { state, dispatch } = useApp()
  const { lang, dir } = useLang()
  const tr = useTranslation(lang)
  const { card, services } = state

  const usedPct = Math.round((card.usedAmount / card.monthlyLimit) * 100)
  const remaining = Math.max(card.monthlyLimit - card.usedAmount, 0)

  function setLimit(val) {
    const v = parseInt(val)
    if (!isNaN(v) && v >= 100 && v <= 2000) {
      dispatch({ type: 'SET_MONTHLY_LIMIT', limit: v })
    }
  }

  return (
    <div className="tab-content space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
          {lang === 'ar' ? 'البطاقة' : 'Card'}
        </h1>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
          style={{ backgroundColor: card.frozen ? 'rgba(59,130,246,0.1)' : 'rgba(34,197,94,0.1)' }}
        >
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: card.frozen ? '#60a5fa' : '#22c55e' }} />
          <span className="text-xs font-semibold" style={{ color: card.frozen ? '#60a5fa' : '#22c55e' }}>
            {card.frozen ? tr('cardFrozen') : tr('cardActive')}
          </span>
        </div>
      </div>

      {/* Virtual card */}
      <div className="rounded-2xl p-5 relative overflow-hidden" style={{ backgroundColor: '#0D1B2E' }}>
        {/* Top row */}
        <div className="flex justify-between items-start mb-5">
          <span className="text-base font-bold text-white">BeforePay</span>
          <span className="text-xl font-black italic text-white opacity-70" style={{ fontFamily: 'Georgia, serif', letterSpacing: '1px' }}>
            VISA
          </span>
        </div>

        {/* Chip */}
        <div className="w-10 h-7 rounded-md mb-5" style={{ backgroundColor: '#D4A843' }} />

        {/* Card number */}
        <p className="text-base font-mono font-semibold text-white tracking-widest mb-5">
          •••• •••• •••• {card.lastFour}
        </p>

        {/* Bottom info row */}
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-[9px] uppercase tracking-wider mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {tr('cardholderName')}
            </p>
            <p className="text-sm font-semibold text-white">{card.holderName[lang]}</p>
          </div>
          <div className="text-center">
            <p className="text-[9px] uppercase tracking-wider mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Expires
            </p>
            <p className="text-sm font-semibold text-white">12/28</p>
          </div>
          <div className={`text-${dir === 'rtl' ? 'left' : 'right'}`}>
            <p className="text-[9px] uppercase tracking-wider mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {tr('monthlyLimit')}
            </p>
            <p className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
              {card.monthlyLimit} {tr('sar')}
            </p>
          </div>
        </div>

        {/* Progress bar on card */}
        <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <div
            className="h-1.5 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(usedPct, 100)}%`, backgroundColor: usedPct > 80 ? '#ef4444' : 'var(--accent)' }}
          />
        </div>
        <p className={`text-[10px] mt-1.5 text-${dir === 'rtl' ? 'left' : 'right'}`} style={{ color: 'rgba(255,255,255,0.35)' }}>
          {card.usedAmount}/{card.monthlyLimit} {tr('sar')}
        </p>

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

      {/* Subtitle */}
      <p className="text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
        {lang === 'ar' ? 'بطاقة افتراضية · مدفوعات متكررة' : 'Virtual Card · Recurring Payments'}
      </p>

      {/* Add to Mobile Wallet */}
      <button
        className="w-full rounded-2xl p-4 flex items-center gap-3 transition-all active:scale-[0.99] hover:opacity-90"
        style={{ backgroundColor: 'var(--bg-card)' }}
        onClick={() => alert(lang === 'ar' ? 'سيتم فتح Apple Pay أو Google Pay لإضافة البطاقة' : 'Opens Apple Pay or Google Pay to add card')}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--bg)' }}
        >
          <Wallet size={17} style={{ color: 'var(--text-primary)' }} />
        </div>
        <span className="text-sm font-medium flex-1 text-start" style={{ color: 'var(--text-primary)' }}>
          {lang === 'ar' ? 'إضافة إلى محفظة الهاتف' : 'Add to Mobile Wallet'}
        </span>
        <ChevronRight
          size={16}
          style={{ color: 'var(--text-secondary)', transform: dir === 'rtl' ? 'rotate(180deg)' : 'none' }}
        />
      </button>

      {/* Add to Wallet / Monthly limit */}
      <div className="rounded-2xl p-4 space-y-4" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="flex items-center gap-2">
          <CreditCard size={16} style={{ color: 'var(--text-secondary)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {lang === 'ar' ? 'إضافة إلى المحفظة' : 'Add to Wallet'}
          </span>
        </div>

        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {lang === 'ar' ? 'الحد الشهري' : 'Monthly limit'}
        </p>

        {/* Big amount with -/+ */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setLimit(card.monthlyLimit - 50)}
            className="w-11 h-11 rounded-full flex items-center justify-center text-xl font-bold transition-all active:scale-95"
            style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}
          >
            −
          </button>
          <div className="text-center">
            <span className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {card.monthlyLimit}
            </span>
            <span className="text-base ms-2" style={{ color: 'var(--text-secondary)' }}>
              {tr('sar')}
            </span>
          </div>
          <button
            onClick={() => setLimit(card.monthlyLimit + 50)}
            className="w-11 h-11 rounded-full flex items-center justify-center text-xl font-bold transition-all active:scale-95"
            style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}
          >
            +
          </button>
        </div>

        {/* Preset buttons */}
        <div className="grid grid-cols-4 gap-2">
          {PRESETS.map(v => (
            <button
              key={v}
              onClick={() => setLimit(v)}
              className="py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
              style={{
                backgroundColor: card.monthlyLimit === v ? 'var(--accent)' : 'var(--bg)',
                color: card.monthlyLimit === v ? 'white' : 'var(--text-secondary)',
              }}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Slider */}
        <div>
          <input
            type="range"
            min={100}
            max={2000}
            step={50}
            value={card.monthlyLimit}
            onChange={e => setLimit(e.target.value)}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: 'var(--accent)' }}
          />
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>100 {tr('sar')}</span>
            <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>2000 {tr('sar')}</span>
          </div>
        </div>

        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {lang === 'ar'
            ? 'هذا الرصيد مخصص حصرياً لاشتراكاتك.'
            : 'This balance is used exclusively for your subscriptions.'}
        </p>
      </div>

      {/* Freeze Card */}
      <div
        className="rounded-2xl p-4 flex items-center gap-3"
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: card.frozen ? 'rgba(59,130,246,0.12)' : 'var(--bg)' }}
        >
          <Snowflake size={17} color={card.frozen ? '#60a5fa' : 'var(--text-secondary)'} />
        </div>
        <div className="flex-1 min-w-0">
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
          style={{ backgroundColor: card.frozen ? '#3b82f6' : 'var(--border)' }}
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

      {/* This Month stats */}
      <div className="space-y-2">
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {lang === 'ar' ? 'هذا الشهر' : 'This Month'}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: lang === 'ar' ? 'المنفق' : 'Spent', value: `${card.usedAmount} ${tr('sar')}` },
            { label: lang === 'ar' ? 'المتبقي' : 'Remaining', value: `${remaining} ${tr('sar')}` },
            { label: lang === 'ar' ? 'الاستخدام' : 'Usage', value: `${usedPct}%` },
            { label: lang === 'ar' ? 'الخدمات' : 'Services', value: `${services.length}` },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-card)' }}>
              <p className="text-xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                {item.value}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
