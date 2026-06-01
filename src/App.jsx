import React, { useState } from 'react'
import { ScenarioProvider } from './context/ScenarioContext.jsx'
import { usePolymarket } from './hooks/usePolymarket.js'
import Header from './components/Layout/Header.jsx'
import ScenarioSidebar from './components/Layout/ScenarioSidebar.jsx'
import OddsBoard from './components/OddsBoard/OddsBoard.jsx'
import Bracket from './components/Bracket/Bracket.jsx'
import EdgeFinder from './components/EdgeFinder/EdgeFinder.jsx'
import PositionTracker from './components/PositionTracker/PositionTracker.jsx'

const TABS = [
  { id: 'odds',     label: '📊 Odds Board' },
  { id: 'bracket', label: '🏆 My Bracket' },
  { id: 'edge',    label: '🎯 Edge Finder' },
]

function AppInner() {
  const [activeTab, setActiveTab] = useState('odds')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const polymarket = usePolymarket()

  return (
    <div className="min-h-screen bg-navy-900 text-slate-200 font-mono">
      <Header
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onToggleSidebar={() => setSidebarOpen(o => !o)}
        polymarket={polymarket}
      />

      {/* Scenario sidebar overlay (mobile) / fixed panel (desktop) */}
      <ScenarioSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="pt-[104px] lg:pt-[64px]">
        {activeTab === 'odds'    && <OddsBoard polymarket={polymarket} />}
        {activeTab === 'bracket' && <Bracket polymarket={polymarket} />}
        {activeTab === 'edge'    && <EdgeFinder polymarket={polymarket} />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ScenarioProvider>
      <AppInner />
    </ScenarioProvider>
  )
}
