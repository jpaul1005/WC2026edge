import React, { useState, useMemo } from 'react'
import { TEAM_BY_ID } from '../../data/teams.js'
import { FALLBACK_MARKETS } from '../../data/fallbackOdds.js'

const CATEGORIES   = ['All', 'Favourite', 'Contender', 'Dark Horse']
const MARKET_TYPES = ['All Types', 'Tournament Winner', 'Group Winner', 'Golden Boot — Player']

function categorize(price) {
  if (price >= 10) return 'Favourite'
  if (price >= 3)  return 'Contender'
  return 'Dark Horse'
}

const MARKET_TYPE_ICON = {
  'Tournament Winner':  '🏆',
  'Group Winner':       '📋',
  'Golden Boot — Player': '👟',
  'Golden Boot — Nation': '🌍',
  'Reaches Final':      '🥈',
  'Reaches Semi-Final': '4️⃣',
}

function OddsCard({ market }) {
  const team = TEAM_BY_ID[market.teamId]
  const category = categorize(market.price)
  const barWidth = Math.min(market.price * 5, 100) // scale up for visibility on small %s

  const categoryColor = {
    Favourite:    'text-value   border-value/30   bg-value/10',
    Contender:    'text-primary border-primary/30 bg-primary/10',
    'Dark Horse': 'text-warn    border-warn/30   bg-warn/10',
  }[category]

  const marketType = market.marketType || 'Tournament Winner'
  const typeIcon   = MARKET_TYPE_ICON[marketType] || '📊'

  return (
    <div className="card p-4 hover:border-primary/40 transition-colors group flex flex-col">
      {/* Market type badge */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-xs">{typeIcon}</span>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{marketType}</span>
      </div>

      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-3xl leading-none">{team?.flag || '🏳️'}</span>
          <div className="min-w-0">
            {market.playerName
              ? <>
                  <div className="text-sm font-semibold text-white truncate">{market.playerName}</div>
                  <div className="text-xs text-slate-500 font-light">{team?.name}</div>
                </>
              : <>
                  <div className="text-sm font-semibold text-white truncate">{team?.name || market.teamId}</div>
                  <div className="text-xs text-slate-500 font-light">{team?.confederation}</div>
                </>
            }
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-stat text-2xl text-primary" style={{textShadow:'0 0 12px rgba(0,198,255,0.5)'}}>
            {market.price.toFixed(1)}¢
          </div>
          <div className="text-[10px] text-slate-500 font-light">{market.price.toFixed(1)}% implied</div>
        </div>
      </div>

      {/* Probability bar */}
      <div className="prob-bar-track mb-3">
        <div className="prob-bar-fill" style={{ width: `${Math.max(barWidth, 2)}%` }} />
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span className={`text-[10px] px-2 py-0.5 rounded-md border font-bold tracking-widest ${categoryColor}`}>
          {category.toUpperCase()}
        </span>
        <a href={market.url} target="_blank" rel="noopener noreferrer"
          className="text-[10px] text-slate-600 hover:text-primary transition-colors font-medium">
          View bet →
        </a>
      </div>
    </div>
  )
}

export default function OddsBoard({ polymarket }) {
  const { markets, isLive, isFallback, lastUpdated, loading } = polymarket
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeType, setActiveType]         = useState('All Types')
  const [search, setSearch] = useState('')

  const displayMarkets = markets.length > 0 ? markets : FALLBACK_MARKETS

  const filtered = useMemo(() => {
    return displayMarkets
      .map(m => ({ ...m, category: categorize(m.price) }))
      .filter(m => {
        if (activeCategory !== 'All' && m.category !== activeCategory) return false
        if (activeType !== 'All Types' && (m.marketType || 'Tournament Winner') !== activeType) return false
        if (search) {
          const team = TEAM_BY_ID[m.teamId]
          const name = (team?.name || m.teamId || '').toLowerCase()
          if (!name.includes(search.toLowerCase())) return false
        }
        return true
      })
      .sort((a, b) => b.price - a.price)
  }, [displayMarkets, activeCategory, activeType, search])

  const grouped = useMemo(() => {
    if (activeCategory !== 'All') return { [activeCategory]: filtered }
    return {
      Favourite:   filtered.filter(m => m.category === 'Favourite'),
      Contender:   filtered.filter(m => m.category === 'Contender'),
      'Dark Horse': filtered.filter(m => m.category === 'Dark Horse'),
    }
  }, [filtered, activeCategory])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Status bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-lg font-bold text-slate-100">Live Odds Board</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isFallback
              ? '⚠️ Using snapshot odds — live API unavailable (CORS)'
              : isLive
              ? `✓ Live from Polymarket — ${displayMarkets.length} markets`
              : 'Connecting...'}
          </p>
        </div>
        <div className="text-xs text-slate-500">
          {lastUpdated && `Updated ${lastUpdated.toLocaleTimeString()}`}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          className="input text-xs w-48"
          placeholder="Search team..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {/* Bet type filter */}
        <div className="flex flex-wrap gap-1">
          {MARKET_TYPES.map(t => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                activeType === t
                  ? 'bg-primary text-navy-900'
                  : 'border border-navy-500 text-slate-400 hover:border-primary/50 hover:text-slate-200'
              }`}
            >
              {t === 'All Types' ? 'All Bets' : t}
            </button>
          ))}
        </div>
        {/* Tier filter */}
        <div className="flex gap-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-navy-500 text-slate-100 border border-primary/40'
                  : 'border border-navy-600 text-slate-500 hover:border-navy-400 hover:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-500">
          <div className="text-center">
            <div className="text-4xl mb-3 animate-spin">⚽</div>
            <div>Loading live odds...</div>
          </div>
        </div>
      ) : (
        Object.entries(grouped).map(([cat, items]) => (
          items.length > 0 && (
            <section key={cat} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{cat}</h2>
                <div className="h-px flex-1 bg-navy-500" />
                <span className="text-xs text-slate-500">{items.length} markets</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {items.map(m => <OddsCard key={m.id} market={m} />)}
              </div>
            </section>
          )
        ))
      )}
    </div>
  )
}
