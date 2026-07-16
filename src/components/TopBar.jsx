import { Sun, Moon, Shield } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LanguageContext'

export default function TopBar() {
  const { theme, toggle: toggleTheme } = useTheme()
  const { lang, toggle: toggleLang } = useLang()

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between px-4 md:px-6 py-3"
      style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
    >
      {/* Logo (mobile) / Page info (desktop hidden) */}
      <div className="flex items-center gap-2 md:hidden">
        <div
          className="w-7 h-7 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <Shield size={14} color="white" strokeWidth={2.5} />
        </div>
        <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
          BeforePay
        </span>
      </div>

      {/* Desktop: just show bank name */}
      <div className="hidden md:block">
        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
          {lang === 'ar' ? 'بنك الإنماء' : 'Inma Bank'}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleLang}
          className="px-3 py-1 rounded-full text-xs font-semibold border transition-all active:scale-95"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--bg-card)',
          }}
        >
          {lang === 'ar' ? 'EN' : 'عربي'}
        </button>

        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-full flex items-center justify-center border transition-all active:scale-95"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-secondary)',
          }}
        >
          {theme === 'dark'
            ? <Sun size={14} strokeWidth={2} />
            : <Moon size={14} strokeWidth={2} />
          }
        </button>
      </div>
    </header>
  )
}
