import React from 'react'
import { useScenario } from '../../context/ScenarioContext.jsx'

export default function Header({ tabs, activeTab, onTabChange, onToggleSidebar, polymarket, user, onAuthClick, onSignOut }) {
  const { activeScenario, state } = useScenario()
  const { isLive, isFallback, countdown, loading } = polymarket

  return (
    <header className="fixed top-0 left-0 right-0 z-40 header-glass">
      {/* Top row */}
      <div className="flex items-center justify-between px-5 py-3 gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-2xl">⚽</span>
          <div className="hidden sm:block">
            <span className="font-impact text-primary text-xl tracking-widest">WC2026</span>
            <span className="text-slate-500 text-xs ml-1.5 font-light tracking-widest">EDGE</span>
          </div>
        </div>

        {/* Live status */}
        <div className="flex items-center gap-3 text-xs">
          {loading ? (
            <span className="text-slate-500 font-light">Connecting...</span>
          ) : (
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-full px-3 py-1">
              <span className="live-dot"
                style={{ backgroundColor: isLive ? '#22c55e' : '#f59e0b',
                         boxShadow: isLive ? '0 0 6px #22c55e' : '0 0 6px #f59e0b' }} />
              <span className={`font-semibold tracking-wider text-[10px] ${isLive ? 'text-value' : 'text-warn'}`}>
                {isLive ? 'LIVE' : 'SNAPSHOT'}
              </span>
              <span className="text-slate-600 text-[10px]">{countdown}s</span>
            </div>
          )}
        </div>

        {/* Auth button */}
        {user ? (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] text-slate-500 hidden sm:block truncate max-w-[120px]">{user.email}</span>
            <button onClick={onSignOut}
              className="text-[10px] border border-navy-400 text-slate-400 hover:border-danger hover:text-danger px-2.5 py-1.5 rounded-lg transition-colors">
              Sign Out
            </button>
          </div>
        ) : (
          <button onClick={onAuthClick}
            className="btn-primary text-xs py-1.5 px-4 shrink-0">
            Sign In
          </button>
        )}

        {/* Scenario picker */}
        <button onClick={onToggleSidebar} className="scenario-pill flex items-center gap-2 px-3 py-1.5 max-w-[200px]">
          <span className="text-primary text-xs">▶</span>
          <span className="truncate text-slate-300 text-xs font-medium">{activeScenario?.name}</span>
          <span className="text-slate-600 text-[10px] shrink-0 bg-white/[0.04] rounded px-1.5 py-0.5">
            {state.scenarios.length}
          </span>
        </button>
      </div>

      {/* Tab row */}
      <div className="flex items-center gap-1.5 px-5 pb-3 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              whitespace-nowrap px-5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all shrink-0
              ${activeTab === tab.id
                ? 'tab-active'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  )
}
