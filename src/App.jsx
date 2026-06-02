import React, { useState } from 'react'
import { ScenarioProvider } from './context/ScenarioContext.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { usePolymarket } from './hooks/usePolymarket.js'
import Header from './components/Layout/Header.jsx'
import ScenarioSidebar from './components/Layout/ScenarioSidebar.jsx'
import AuthModal from './components/Auth/AuthModal.jsx'
import OddsBoard from './components/OddsBoard/OddsBoard.jsx'
import Bracket from './components/Bracket/Bracket.jsx'
import EdgeFinder from './components/EdgeFinder/EdgeFinder.jsx'

const TABS = [
  { id: 'odds',     label: '📊 Odds Board' },
  { id: 'bracket', label: '🏆 My Bracket' },
  { id: 'edge',    label: '🎯 Edge Finder' },
]

function AppInner() {
  const [activeTab, setActiveTab]   = useState('odds')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authOpen, setAuthOpen]     = useState(false)
  const polymarket = usePolymarket()
  const { user, signOut, loading: authLoading } = useAuth()

  return (
    <div className="min-h-screen bg-navy-900 text-slate-200">
      <Header
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onToggleSidebar={() => setSidebarOpen(o => !o)}
        polymarket={polymarket}
        user={user}
        onAuthClick={() => setAuthOpen(true)}
        onSignOut={signOut}
      />

      <ScenarioSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}

      <main className="pt-[130px] lg:pt-[100px]">
        {activeTab === 'odds'    && <OddsBoard polymarket={polymarket} />}
        {activeTab === 'bracket' && <Bracket polymarket={polymarket} />}
        {activeTab === 'edge'    && <EdgeFinder polymarket={polymarket} />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ScenarioProvider>
        <AppInner />
      </ScenarioProvider>
    </AuthProvider>
  )
}
