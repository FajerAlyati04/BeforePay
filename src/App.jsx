import { useState } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider, useLang } from './contexts/LanguageContext'
import { AppProvider } from './contexts/AppContext'
import Navigation from './components/Navigation'
import TopBar from './components/TopBar'
import Home from './components/Home'
import Payments from './components/Payments'
import Card from './components/Card'
import BankDashboard from './components/BankDashboard'
import History from './components/History'
import ConsentScreen from './components/ConsentScreen'

function AppContent() {
  const [activeTab, setActiveTab] = useState('home')
  const [consented, setConsented] = useState(() => !!localStorage.getItem('bp_consent_v2'))
  const { lang, dir } = useLang()

  function handleAccept() {
    localStorage.setItem('bp_consent_v2', '1')
    setConsented(true)
  }

  if (!consented) {
    return <ConsentScreen onAccept={handleAccept} lang={lang} />
  }

  const fontClass = lang === 'ar' ? 'font-arabic' : 'font-latin'

  const screens = {
    home: Home,
    payments: Payments,
    card: Card,
    bank: BankDashboard,
    history: History,
  }

  const ActiveScreen = screens[activeTab]

  return (
    <div
      className={`min-h-screen ${fontClass}`}
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}
      dir={dir}
    >
      {/* Sidebar (desktop only) */}
      <Navigation active={activeTab} setActive={setActiveTab} />

      {/* Main area */}
      <div className="md:ps-[220px] flex flex-col min-h-screen">
        {/* Top bar */}
        <TopBar />

        {/* Screen content */}
        <main className="flex-1 px-4 md:px-8 py-4 pb-24 md:pb-8 max-w-[900px] mx-auto w-full">
          <div key={activeTab} className="tab-content">
            <ActiveScreen setActive={setActiveTab} />
          </div>
        </main>
      </div>

      {/* Bottom nav (mobile only) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around px-2 py-2"
        style={{ backgroundColor: 'var(--bg)', borderTop: '1px solid var(--border)' }}
      >
        {[
          { id: 'home', label: { ar: 'الرئيسية', en: 'Home' }, icon: '⊞' },
          { id: 'payments', label: { ar: 'المدفوعات', en: 'Payments' }, icon: '≡' },
          { id: 'card', label: { ar: 'البطاقة', en: 'Card' }, icon: '▣' },
          { id: 'bank', label: { ar: 'البنك', en: 'Bank' }, icon: '◫' },
          { id: 'history', label: { ar: 'التاريخ', en: 'History' }, icon: '◷' },
        ].map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all"
              style={{ color: isActive ? 'var(--accent)' : 'var(--text-secondary)' }}
            >
              <TabIcon id={tab.id} isActive={isActive} />
              <span className="text-[10px] font-medium">{tab.label[lang]}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

function TabIcon({ id, isActive }) {
  const size = 20
  const stroke = isActive ? 2.5 : 1.8
  const color = 'currentColor'

  if (id === 'home') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
  if (id === 'payments') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  )
  if (id === 'card') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  )
  if (id === 'bank') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  )
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
