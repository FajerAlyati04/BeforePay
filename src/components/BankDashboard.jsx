import { useState } from 'react'
import { TrendingUp, Archive, Activity, X, ChevronRight } from 'lucide-react'
import { bankMetrics } from '../data'
import { useTranslation } from '../translations'
import { useLang } from '../contexts/LanguageContext'
import { useApp } from '../contexts/AppContext'

// ─── KPI Detail Bottom Sheet ───────────────────────────────────────────────
function KpiSheet({ type, services, onClose, lang, tr }) {
  if (!type) return null

  const unusedServices = services.filter(s => s.unusedDays > 0)
  const priceChangedServices = services.filter(s => s.priceChanged)
  const highRisk = services.filter(s => s.riskLevel === 'high')
  const medRisk = services.filter(s => s.riskLevel === 'medium')
  const lowRisk = services.filter(s => s.riskLevel === 'low')

  const savingsItems = [
    ...priceChangedServices.map(s => ({
      service: s,
      reason: lang === 'ar'
        ? `زيادة سعر ${Math.round(((s.amount - (s.oldAmount || 0)) / (s.oldAmount || 1)) * 100)}%`
        : `Price up ${Math.round(((s.amount - (s.oldAmount || 0)) / (s.oldAmount || 1)) * 100)}%`,
      saving: s.amount - (s.oldAmount || 0),
    })),
    ...unusedServices.map(s => ({
      service: s,
      reason: lang === 'ar' ? `غير مستخدمة ${s.unusedDays} يوم` : `Unused ${s.unusedDays} days`,
      saving: s.amount,
    })),
  ]

  const SHEETS = {
    savings: {
      title: lang === 'ar' ? 'إمكانية التوفير' : 'Savings Potential',
      subtitle: lang === 'ar' ? 'إذا راجعت الخدمات غير المستخدمة' : 'If you review unused services',
      iconColor: '#22c55e',
      iconBg: 'rgba(34,197,94,0.12)',
      Icon: TrendingUp,
      body: (
        <div className="space-y-2">
          <div
            className="rounded-2xl p-4 flex items-center justify-between"
            style={{ backgroundColor: 'var(--bg)' }}
          >
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? 'إجمالي التوفير المحتمل' : 'Potential Monthly Savings'}
            </span>
            <span className="text-xl font-bold" style={{ color: '#22c55e' }}>
              {bankMetrics.totalSavingsPotential} {tr('sar')}
            </span>
          </div>
          {savingsItems.map(({ service, reason, saving }) => (
            <div
              key={service.id}
              className="flex items-center gap-3 py-3"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                style={{ backgroundColor: service.color }}
              >
                {service.logo}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {service.name[lang]}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{reason}</p>
              </div>
              <span className="text-sm font-bold" style={{ color: '#ef4444' }}>
                -{saving} {tr('sar')}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    price: {
      title: lang === 'ar' ? 'الخدمات المتغيرة الأسعار' : 'Price-Changed Services',
      subtitle: lang === 'ar' ? 'رفعت أسعارها هذا الشهر' : 'Raised prices this month',
      iconColor: '#ef4444',
      iconBg: 'rgba(239,68,68,0.12)',
      Icon: TrendingUp,
      body: (
        <div className="space-y-3">
          {priceChangedServices.map(s => {
            const pct = Math.round(((s.amount - (s.oldAmount || 0)) / (s.oldAmount || 1)) * 100)
            return (
              <div key={s.id} className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.logo}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {s.name[lang]}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.category[lang]}</p>
                  </div>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-lg"
                    style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#ef4444' }}
                  >
                    +{pct}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="flex-1 rounded-xl p-3 text-center"
                    style={{ backgroundColor: 'var(--bg-card)' }}
                  >
                    <p className="text-[10px] mb-0.5" style={{ color: 'var(--text-secondary)' }}>
                      {lang === 'ar' ? 'السعر القديم' : 'Old Price'}
                    </p>
                    <p
                      className="text-base font-bold line-through"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {s.oldAmount} {tr('sar')}
                    </p>
                  </div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: 18 }}>→</span>
                  <div
                    className="flex-1 rounded-xl p-3 text-center"
                    style={{ backgroundColor: 'var(--bg-card)' }}
                  >
                    <p className="text-[10px] mb-0.5" style={{ color: 'var(--text-secondary)' }}>
                      {lang === 'ar' ? 'السعر الجديد' : 'New Price'}
                    </p>
                    <p className="text-base font-bold" style={{ color: '#ef4444' }}>
                      {s.amount} {tr('sar')}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ),
    },
    unused: {
      title: lang === 'ar' ? 'الخدمات غير المستخدمة' : 'Unused Services',
      subtitle: lang === 'ar' ? 'لم تُستخدم منذ 30 يوم+' : 'Unused for 30+ days',
      iconColor: '#8b5cf6',
      iconBg: 'rgba(139,92,246,0.12)',
      Icon: Archive,
      body: (
        <div className="space-y-3">
          {unusedServices.map(s => (
            <div key={s.id} className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                  style={{ backgroundColor: s.color }}
                >
                  {s.logo}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {s.name[lang]}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.category[lang]}</p>
                </div>
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {s.amount} {tr('sar')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="rounded-xl p-2.5" style={{ backgroundColor: 'var(--bg-card)' }}>
                  <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'آخر استخدام' : 'Last Used'}
                  </p>
                  <p className="text-xs font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? `منذ ${s.unusedDays} يوم` : `${s.unusedDays} days ago`}
                  </p>
                </div>
                <div className="rounded-xl p-2.5" style={{ backgroundColor: 'var(--bg-card)' }}>
                  <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'عند الإلغاء' : 'If Cancelled'}
                  </p>
                  <p className="text-xs font-semibold mt-1" style={{ color: '#22c55e' }}>
                    +{s.amount} {tr('sar')}
                  </p>
                </div>
              </div>
              <div
                className="flex items-center gap-2 py-2.5 px-3 rounded-xl"
                style={{ backgroundColor: 'rgba(34,197,94,0.1)' }}
              >
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#22c55e' }}
                >
                  <span style={{ color: 'white', fontSize: 9, fontWeight: 700 }}>✓</span>
                </div>
                <p className="text-xs font-semibold" style={{ color: '#22c55e' }}>
                  {lang === 'ar'
                    ? `الإلغاء يوفر لك ${s.amount} ريال/شهرياً`
                    : `Cancelling saves you ${s.amount} SAR/month`}
                </p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    risk: {
      title: lang === 'ar' ? 'درجة المخاطرة' : 'Risk Score',
      subtitle: lang === 'ar' ? 'متوسط المخاطرة' : 'Medium risk',
      iconColor: '#f59e0b',
      iconBg: 'rgba(245,158,11,0.12)',
      Icon: Activity,
      body: (() => {
        const r = 38
        const circ = 2 * Math.PI * r
        const filled = circ * (bankMetrics.riskScore / 100)
        const groups = [
          { level: 'high', label: lang === 'ar' ? 'مرتفع المخاطرة' : 'High Risk', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', list: highRisk },
          { level: 'medium', label: lang === 'ar' ? 'متوسط المخاطرة' : 'Medium Risk', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', list: medRisk },
          { level: 'low', label: lang === 'ar' ? 'منخفض المخاطرة' : 'Low Risk', color: '#22c55e', bg: 'rgba(34,197,94,0.08)', list: lowRisk },
        ].filter(g => g.list.length > 0)

        return (
          <div className="space-y-4">
            {/* Gauge */}
            <div className="flex flex-col items-center py-2">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r={r} fill="none" strokeWidth="10" stroke="var(--border)" />
                  <circle
                    cx="50" cy="50" r={r} fill="none" strokeWidth="10"
                    stroke="#f59e0b"
                    strokeDasharray={`${filled} ${circ}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {bankMetrics.riskScore}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>/100</span>
                </div>
              </div>
              {/* Counts row */}
              <div className="flex items-center gap-5 mt-3">
                {[
                  { label: lang === 'ar' ? 'مرتفع' : 'High Risk', count: highRisk.length, color: '#ef4444' },
                  { label: lang === 'ar' ? 'متوسط' : 'Medium Risk', count: medRisk.length, color: '#f59e0b' },
                  { label: lang === 'ar' ? 'منخفض' : 'Low Risk', count: lowRisk.length, color: '#22c55e' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                    <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Services grouped by risk level */}
            {groups.map(group => (
              <div key={group.level}>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: group.color }} />
                  <p className="text-xs font-semibold" style={{ color: group.color }}>{group.label}</p>
                </div>
                <div className="space-y-2">
                  {group.list.map(s => (
                    <div
                      key={s.id}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: group.bg }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs flex-shrink-0"
                        style={{ backgroundColor: s.color }}
                      >
                        {s.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {s.name[lang]}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.category[lang]}</p>
                      </div>
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {s.amount} {tr('sar')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      })(),
    },
  }

  const c = SHEETS[type]
  const Icon = c.Icon

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl"
        style={{ backgroundColor: 'var(--bg-card)', maxHeight: '85vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: 'var(--border)' }} />
        </div>

        {/* Header */}
        <div
          className="flex items-center gap-3 px-5 py-3"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: c.iconBg }}
          >
            <Icon size={18} color={c.iconColor} />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{c.title}</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{c.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--bg)' }}
          >
            <X size={15} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        <div className="p-5">{c.body}</div>
      </div>
    </div>
  )
}

// ─── Clickable Metric Card ──────────────────────────────────────────────────
function MetricCard({ icon: Icon, iconColor, iconBg, title, value, sub, onClick }) {
  return (
    <button
      className="rounded-2xl p-4 text-start w-full transition-all active:scale-[0.97] hover:opacity-90"
      style={{ backgroundColor: 'var(--bg-card)' }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={17} color={iconColor} strokeWidth={2} />
        </div>
        <ChevronRight size={14} style={{ color: 'var(--text-secondary)', marginTop: 2 }} />
      </div>
      <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
      <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{title}</p>
      {sub && (
        <p className="text-[10px] mt-1" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
          {sub}
        </p>
      )}
    </button>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function BankDashboard() {
  const { lang } = useLang()
  const tr = useTranslation(lang)
  const { state } = useApp()
  const [activeSheet, setActiveSheet] = useState(null)

  const unusedCount = state.services.filter(s => s.unusedDays > 0).length
  const priceChangedCount = state.services.filter(s => s.priceChanged).length
  const savingsPotential = state.services
    .filter(s => s.unusedDays > 0 || s.priceChanged)
    .reduce((sum, s) => sum + (s.priceChanged ? s.amount - (s.oldAmount || 0) : s.amount), 0)

  return (
    <div className="tab-content space-y-4">
      {/* Title */}
      <div>
        <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
          {tr('bankTitle')}
        </h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          {tr('bankName')}
        </p>
      </div>

      {/* Metrics grid — all 4 clickable */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          icon={TrendingUp}
          iconColor="#22c55e"
          iconBg="rgba(34,197,94,0.12)"
          title={tr('savingsPotential')}
          value={`${Math.max(savingsPotential, bankMetrics.totalSavingsPotential)} ${tr('sar')}`}
          sub={lang === 'ar' ? 'إذا راجعت الخدمات غير المستخدمة' : 'If you review unused services'}
          onClick={() => setActiveSheet('savings')}
        />
        <MetricCard
          icon={TrendingUp}
          iconColor="#ef4444"
          iconBg="rgba(239,68,68,0.12)"
          title={tr('priceChangedServices')}
          value={`${priceChangedCount} ${lang === 'ar' ? 'خدمة' : 'services'}`}
          sub={lang === 'ar' ? 'رفعت أسعارها هذا الشهر' : 'Raised prices this month'}
          onClick={() => setActiveSheet('price')}
        />
        <MetricCard
          icon={Archive}
          iconColor="#8b5cf6"
          iconBg="rgba(139,92,246,0.12)"
          title={tr('unusedServices')}
          value={`${unusedCount} ${lang === 'ar' ? 'خدمة' : 'services'}`}
          sub={lang === 'ar' ? 'لم تُستخدم منذ 30 يوم+' : 'Unused for 30+ days'}
          onClick={() => setActiveSheet('unused')}
        />
        <MetricCard
          icon={Activity}
          iconColor="#f59e0b"
          iconBg="rgba(245,158,11,0.12)"
          title={tr('riskScore')}
          value={`${bankMetrics.riskScore}/100`}
          sub={lang === 'ar' ? 'متوسط المخاطرة' : 'Medium risk'}
          onClick={() => setActiveSheet('risk')}
        />
      </div>

      {/* Merchants table */}
      <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-card)' }}>
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          {tr('mostChangedMerchants')}
        </h2>
        <div className="space-y-2">
          {bankMetrics.merchants.map((m, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2"
              style={{ borderBottom: i < bankMetrics.merchants.length - 1 ? '1px solid var(--border)' : 'none' }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: i === 0 ? '#ef4444' : i === 1 ? '#f59e0b' : 'var(--text-secondary)' }}
                >
                  {i + 1}
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {m.name[lang]}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {m.changes} {tr('priceChanges')}
                </span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-lg"
                  style={{
                    backgroundColor: i === 0 ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
                    color: i === 0 ? '#ef4444' : '#f59e0b',
                  }}
                >
                  +{m.changePercent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk distribution bars */}
      <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-card)' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          {tr('riskDistribution')}
        </h2>
        <div className="space-y-3">
          {bankMetrics.riskDistribution.map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {item.label[lang]}
                </span>
                <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                  {item.value}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
                <div
                  className="h-3 rounded-full transition-all duration-700"
                  style={{ width: `${item.value}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          {bankMetrics.riskDistribution.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                {item.label[lang]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Detail Sheet */}
      <KpiSheet
        type={activeSheet}
        services={state.services}
        onClose={() => setActiveSheet(null)}
        lang={lang}
        tr={tr}
      />
    </div>
  )
}
