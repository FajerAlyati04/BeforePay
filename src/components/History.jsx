import { TrendingUp } from 'lucide-react'
import { useLang } from '../contexts/LanguageContext'
import { useTranslation } from '../translations'

const historyData = [
  {
    month: { ar: 'يوليو 2026', en: 'July 2026' },
    total: 185,
    payments: [
      { id: 1, name: { ar: 'شات جي بي تي بلاس', en: 'ChatGPT Plus' }, category: { ar: 'إنتاجية', en: 'Productivity' }, date: '2026-07-17', amount: 129, logo: 'G', color: '#10A37F', status: 'paid' },
      { id: 2, name: { ar: 'نتفليكس بريميوم', en: 'Netflix Premium' }, category: { ar: 'ترفيه', en: 'Entertainment' }, date: '2026-07-19', amount: 56, logo: 'N', color: '#E50914', status: 'paid' },
    ],
  },
  {
    month: { ar: 'يونيو 2026', en: 'June 2026' },
    total: 412,
    payments: [
      { id: 3, name: { ar: 'أدوبي كلاود الإبداعية', en: 'Adobe Creative Cloud' }, category: { ar: 'تصميم', en: 'Design' }, date: '2026-06-30', amount: 249, logo: 'A', color: '#FF0000', status: 'paid' },
      { id: 4, name: { ar: 'كانفا برو', en: 'Canva Pro' }, category: { ar: 'تصميم', en: 'Design' }, date: '2026-06-25', amount: 42, logo: 'C', color: '#00C4CC', status: 'refunded' },
      { id: 5, name: { ar: 'سبوتيفاي العائلية', en: 'Spotify Family' }, category: { ar: 'موسيقى', en: 'Music' }, date: '2026-06-23', amount: 32, logo: 'S', color: '#1DB954', status: 'paid' },
      { id: 6, name: { ar: 'نتفليكس بريميوم', en: 'Netflix Premium' }, category: { ar: 'ترفيه', en: 'Entertainment' }, date: '2026-06-19', amount: 56, logo: 'N', color: '#E50914', status: 'paid' },
      { id: 7, name: { ar: 'شات جي بي تي بلاس', en: 'ChatGPT Plus' }, category: { ar: 'إنتاجية', en: 'Productivity' }, date: '2026-06-17', amount: 75, logo: 'G', color: '#10A37F', status: 'paid' },
    ],
  },
  {
    month: { ar: 'مايو 2026', en: 'May 2026' },
    total: 205,
    payments: [
      { id: 8, name: { ar: 'أدوبي كلاود الإبداعية', en: 'Adobe Creative Cloud' }, category: { ar: 'تصميم', en: 'Design' }, date: '2026-05-30', amount: 75, logo: 'A', color: '#FF0000', status: 'paid' },
      { id: 9, name: { ar: 'سبوتيفاي العائلية', en: 'Spotify Family' }, category: { ar: 'موسيقى', en: 'Music' }, date: '2026-05-23', amount: 32, logo: 'S', color: '#1DB954', status: 'paid' },
      { id: 10, name: { ar: 'نتفليكس بريميوم', en: 'Netflix Premium' }, category: { ar: 'ترفيه', en: 'Entertainment' }, date: '2026-05-19', amount: 56, logo: 'N', color: '#E50914', status: 'paid' },
      { id: 11, name: { ar: 'شات جي بي تي بلاس', en: 'ChatGPT Plus' }, category: { ar: 'إنتاجية', en: 'Productivity' }, date: '2026-05-17', amount: 42, logo: 'G', color: '#10A37F', status: 'paid' },
    ],
  },
]

function formatDate(dateStr, lang) {
  return new Date(dateStr).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function History() {
  const { lang } = useLang()
  const tr = useTranslation(lang)

  const totalAll = historyData.reduce((sum, g) => sum + g.total, 0)

  return (
    <div className="tab-content space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            {tr('historyTitle')}
          </h1>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
          style={{ backgroundColor: 'rgba(34,197,94,0.1)' }}
        >
          <TrendingUp size={13} color="#22c55e" />
          <span className="text-sm font-bold" style={{ color: '#22c55e' }}>
            {totalAll} {tr('sar')}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {tr('totalPaid')}
          </span>
        </div>
      </div>

      {/* Groups by month */}
      {historyData.map((group, gi) => (
        <div key={gi} className="space-y-2">
          {/* Month header */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              {group.month[lang]}
            </span>
            <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>
              {group.total} {tr('sar')}
            </span>
          </div>

          {/* Payment rows */}
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)' }}>
            {group.payments.map((p, pi) => (
              <div
                key={p.id}
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  borderBottom: pi < group.payments.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                {/* Logo */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                  style={{ backgroundColor: p.color + '22', color: p.color }}
                >
                  {p.logo}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {p.name[lang]}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {p.category[lang]} · {formatDate(p.date, lang)}
                  </p>
                </div>

                {/* Amount + status */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-sm font-bold" style={{ color: p.status === 'refunded' ? 'var(--accent)' : 'var(--text-primary)' }}>
                    {p.status === 'refunded' ? '+' : ''}{p.amount} {tr('sar')}
                  </span>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={
                      p.status === 'paid'
                        ? { backgroundColor: 'rgba(34,197,94,0.12)', color: '#22c55e' }
                        : { backgroundColor: 'rgba(208,88,48,0.12)', color: 'var(--accent)' }
                    }
                  >
                    {p.status === 'paid' ? tr('statusPaid') : tr('statusRefunded')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
