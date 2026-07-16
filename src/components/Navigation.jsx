import { useTranslation } from '../translations'
import { useLang } from '../contexts/LanguageContext'

const tabs = [
  {
    id: 'home', key: 'navHome',
    icon: (s) => (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={s} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    id: 'payments', key: 'navPayments',
    icon: (s) => (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={s} strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
  },
  {
    id: 'card', key: 'navCard',
    icon: (s) => (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={s} strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    id: 'bank', key: 'navBank',
    icon: (s) => (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={s} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
]

export default function Navigation({ active, setActive }) {
  const { lang, dir } = useLang()
  const tr = useTranslation(lang)

  return (
    <nav
      className="hidden md:flex flex-col py-5 gap-1 fixed top-0 h-full z-20 w-[220px]"
      style={{
        backgroundColor: '#10253F',
        [dir === 'rtl' ? 'right' : 'left']: 0,
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 mb-5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <span className="font-bold text-base text-white">BeforePay</span>
      </div>

      {/* Bank badge */}
      <div className="px-5 mb-3">
        <span
          className="text-xs px-2.5 py-1 rounded-lg font-medium"
          style={{ color: 'var(--accent)', backgroundColor: 'rgba(193,85,46,0.15)' }}
        >
          {lang === 'ar' ? 'بنك الإنماء' : 'Inma Bank'}
        </span>
      </div>

      {/* Tabs */}
      {tabs.map(({ id, key, icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            onClick={() => setActive(id)}
            className="flex items-center gap-3 mx-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              backgroundColor: isActive ? 'var(--accent)' : 'transparent',
              color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
              textAlign: dir === 'rtl' ? 'right' : 'left',
            }}
          >
            {icon(isActive ? 2.5 : 1.8)}
            {tr(key)}
          </button>
        )
      })}

      {/* Footer */}
      <div className="mt-auto px-5 pb-2">
        <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
          {lang === 'ar' ? 'نسخة 1.0.0' : 'v1.0.0'}
        </p>
      </div>
    </nav>
  )
}
