import { TrendingUp, AlertTriangle, Archive, Activity } from 'lucide-react'
import { bankMetrics } from '../data'
import { useTranslation } from '../translations'
import { useLang } from '../contexts/LanguageContext'
import { useApp } from '../contexts/AppContext'

function MetricCard({ icon: Icon, iconColor, iconBg, title, value, sub }) {
  return (
    <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-card)' }}>
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={17} color={iconColor} strokeWidth={2} />
        </div>
      </div>
      <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
      <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{title}</p>
      {sub && <p className="text-[10px] mt-1" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>{sub}</p>}
    </div>
  )
}

export default function BankDashboard() {
  const { lang } = useLang()
  const tr = useTranslation(lang)
  const { state } = useApp()

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

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          icon={TrendingUp}
          iconColor="#22c55e"
          iconBg="rgba(34,197,94,0.12)"
          title={tr('savingsPotential')}
          value={`${Math.max(savingsPotential, bankMetrics.totalSavingsPotential)} ${tr('sar')}`}
          sub={lang === 'ar' ? 'إذا راجعت الخدمات غير المستخدمة' : 'If you review unused services'}
        />
        <MetricCard
          icon={TrendingUp}
          iconColor="#ef4444"
          iconBg="rgba(239,68,68,0.12)"
          title={tr('priceChangedServices')}
          value={`${priceChangedCount} ${lang === 'ar' ? 'خدمة' : 'services'}`}
          sub={lang === 'ar' ? 'رفعت أسعارها هذا الشهر' : 'Raised prices this month'}
        />
        <MetricCard
          icon={Archive}
          iconColor="#8b5cf6"
          iconBg="rgba(139,92,246,0.12)"
          title={tr('unusedServices')}
          value={`${unusedCount} ${lang === 'ar' ? 'خدمة' : 'services'}`}
          sub={lang === 'ar' ? 'لم تُستخدم منذ 30 يوم+' : 'Unused for 30+ days'}
        />
        <MetricCard
          icon={Activity}
          iconColor="#f59e0b"
          iconBg="rgba(245,158,11,0.12)"
          title={tr('riskScore')}
          value={`${bankMetrics.riskScore}/100`}
          sub={lang === 'ar' ? 'متوسط المخاطرة' : 'Medium risk'}
        />
      </div>

      {/* Merchants table */}
      <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-card)' }}>
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          {tr('mostChangedMerchants')}
        </h2>
        <div className="space-y-2">
          {bankMetrics.merchants.map((m, i) => (
            <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: i < bankMetrics.merchants.length - 1 ? '1px solid var(--border)' : 'none' }}>
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

        {/* Legend */}
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
    </div>
  )
}
