import { Sun, Moon, Shield } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LanguageContext'

export default function Header() {
  const { theme, toggle: toggleTheme } = useTheme()
  const { lang, dir, toggle: toggleLang } = useLang()

  return (
    <header
      className="flex items-center justify-between px-4 py-3 sticky top-0 z-30"
      style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <Shield size={16} color="white" strokeWidth={2.5} />
        </div>
        <span className="font-bold text-base" style={{ color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
          BeforePay
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Lang toggle */}
        <button
          onClick={toggleLang}
          className="px-3 py-1 rounded-full text-xs font-semibold border transition-all"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--bg-card)',
          }}
        >
          {lang === 'ar' ? 'EN' : 'عربي'}
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-full flex items-center justify-center border transition-all"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-secondary)',
          }}
        >
          {theme === 'dark'
            ? <Sun size={15} strokeWidth={2} />
            : <Moon size={15} strokeWidth={2} />
          }
        </button>
      </div>
    </header>
  )
}
