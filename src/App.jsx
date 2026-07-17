import { useState } from 'react'
import { Home as HomeIcon, List, CreditCard, BarChart2, Clock } from 'lucide-react'
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

function AppContent() {
  const [activeTab, setActiveTab] = useState('home')
  const { lang, dir } = useLang()

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
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around px-1 pt-2 pb-3"
        style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}
      >
        {[
          { id: 'home', label: { ar: 'الرئيسية', en: 'Home' }, Icon: HomeIcon },
          { id: 'payments', label: { ar: 'المدفوعات', en: 'Payments' }, Icon: List },
          { id: 'card', label: { ar: 'البطاقة', en: 'Card' }, Icon: CreditCard },
          { id: 'bank', label: { ar: 'البنك', en: 'Bank' }, Icon: BarChart2 },
          { id: 'history', label: { ar: 'السجل', en: 'History' }, Icon: Clock },
        ].map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all flex-1"
              style={{ color: isActive ? 'var(--accent)' : 'var(--text-secondary)' }}
            >
              <tab.Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{tab.label[lang]}</span>
            </button>
          )
        })}
      </nav>
    </div>
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
