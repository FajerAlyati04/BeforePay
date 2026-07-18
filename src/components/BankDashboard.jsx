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
      title: lang === 'ar' ? 'اشتراكات بدون تفاعل' : 'Inactive Subscriptions',
      subtitle: lang === 'ar' ? 'لم يُتَّخذ قرار عليها منذ فترة' : 'No decision made for a while',
      iconColor: '#8b5cf6',
      iconBg: 'rgba(139,92,246,0.12)',
      Icon: Archive,
      body: (
        <div className="space-y-3">
          {unusedServices.map(s => (
            <div key={s.id} className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg)' }}>
              {/* Header row */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
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
                <span className="text-sm font-bold flex-shrink-0" style={{ color: 'var(--text-primary)' }}>
                  {s.amount} {tr('sar')}
                </span>
              </div>

              {/* Stat boxes */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--bg-card)' }}>
                  <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'آخر فتح للتفاصيل' : 'Last Opened'}
                  </p>
                  <p className="text-sm font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? `منذ ${s.unusedDays} يوم` : `${s.unusedDays} days ago`}
                  </p>
                </div>
                <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--bg-card)' }}>
                  <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'آخر قرار متخذ' : 'Last Decision'}
                  </p>
                  <p className="text-sm font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? 'قبل تجديدين' : '2 renewals ago'}
                  </p>
                </div>
              </div>

              {/* Savings banner */}
              <div
                className="flex items-center gap-2 py-2.5 px-3 rounded-xl"
                style={{ backgroundColor: 'rgba(34,197,94,0.12)' }}
              >
                <span style={{ color: '#22c55e', fontWeight: 700, fontSize: 13 }}>✓</span>
                <p className="text-xs font-semibold" style={{ color: '#22c55e' }}>
                  {lang === 'ar'
                    ? `الإلغاء يوفر لك ${s.amount} ر.س شهرياً`
                    : `Cancelling saves you ${s.amount} SAR/month`}
                </p>
              </div>
            </div>
          ))}

          {/* Explanation footer */}
          <p className="text-xs leading-relaxed text-center pt-1 pb-2" style={{ color: 'var(--text-secondary)' }}>
            {lang === 'ar'
              ? "نعتبر الاشتراك «بدون تفاعل» إذا مرّ عليه تجديدان متتاليان بدون أن تتخذ قراراً (متابعة أو تجميد)، أو لم تفتح تفاصيله من داخل التطبيق منذ فترة طويلة."
              : "A subscription is considered \"inactive\" if two consecutive renewals passed without a decision (keep or freeze), or its details haven't been opened in a long time."}
          </p>
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
        function riskReason(s) {
          if (s.riskLevel === 'high' && s.priceChanged) {
            const pct = Math.round(((s.amount - (s.oldAmount || 0)) / (s.oldAmount || 1)) * 100)
            return lang === 'ar'
              ? `زيادة سعر ${pct}% خلال آخر تجديد`
              : `Price increased ${pct}% at last renewal`
          }
          if (s.riskLevel === 'medium' && s.unusedDays > 0) {
            return lang === 'ar'
              ? `لم تُفتح تفاصيله منذ ${s.unusedDays} يوم`
              : `Details not opened for ${s.unusedDays} days`
          }
          if (s.riskLevel === 'medium' && s.trialEnding) {
            return lang === 'ar'
              ? 'الفترة التجريبية تنتهي قريباً'
              : 'Free trial ending soon'
          }
          if (s.riskLevel === 'medium') {
            return lang === 'ar'
              ? 'لم يُتخذ قرار منذ تجديدين متتاليين'
              : 'No decision made for 2 consecutive renewals'
          }
          return lang === 'ar'
            ? 'سعر مستقر وتفاعل منتظم'
            : 'Stable price and regular interaction'
        }

        const groups = [
          { level: 'high',   label: lang === 'ar' ? 'مرتفع المخاطرة'  : 'High Risk',   color: '#ef4444', list: highRisk },
          { level: 'medium', label: lang === 'ar' ? 'متوسط المخاطرة'  : 'Medium Risk', color: '#f59e0b', list: medRisk  },
          { level: 'low',    label: lang === 'ar' ? 'منخفض المخاطرة'  : 'Low Risk',    color: '#22c55e', list: lowRisk  },
        ].filter(g => g.list.length > 0)

        return (
          <div className="space-y-1">
            {/* Score — plain number */}
            <div className="text-center py-4">
              <span className="text-6xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {bankMetrics.riskScore}
              </span>
              <span className="text-xl ms-1" style={{ color: 'var(--text-secondary)' }}>/100</span>
            </div>

            {/* Groups */}
            {groups.map(group => (
              <div key={group.level} className="space-y-1.5">
                {/* Section label */}
                <p
                  className="text-xs font-bold pt-3 pb-1"
                  style={{ color: group.color }}
                  dir={lang === 'ar' ? 'rtl' : 'ltr'}
                >
                  {group.label}
                </p>
                {group.list.map(s => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 p-4 rounded-2xl"
                    style={{ backgroundColor: 'var(--bg)' }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                      style={{ backgroundColor: s.color }}
                    >
                      {s.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {s.name[lang]}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        {riskReason(s)}
                      </p>
                    </div>
                    <span className="text-sm font-bold flex-shrink-0" style={{ color: 'var(--text-primary)' }}>
                      {s.amount} {tr('sar')}
                    </span>
                  </div>
                ))}
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
      className="fixed inset-0 z-[100] flex items-start justify-center px-6 pt-16 pb-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl"
        style={{ backgroundColor: 'var(--bg-card)', maxHeight: '86vh', overflowY: 'auto' }}
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
