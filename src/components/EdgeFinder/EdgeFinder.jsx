import React, { useMemo } from 'react'
import { useScenario } from '../../context/ScenarioContext.jsx'
import { ALL_TEAMS, TEAM_BY_ID, GROUPS } from '../../data/teams.js'
import { userImpliedProb, calcEdge, edgeLabel, edgeColor } from '../../utils/edgeCalc.js'

const WC_WINNER_URL = 'https://polymarket.com/event/world-cup-winner'

// ── Shared edge card ──────────────────────────────────────────────────────────
function EdgeCard({ teamId, marketPrice, userProb, overrideProb, url, dispatch }) {
  const team = TEAM_BY_ID[teamId]
  const effectiveProb = overrideProb != null ? overrideProb : userProb
  const edge = calcEdge(effectiveProb, marketPrice)
  const color = edgeColor(edge)
  const label = edgeLabel(edge)

  const tagClass = edge >= 5 ? 'tag-value' : edge >= 0 ? 'tag-primary' : 'tag-danger'

  return (
    <div className="card p-4 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl leading-none">{team?.flag}</span>
          <div>
            <div className="text-sm font-semibold text-slate-100">{team?.name}</div>
            <span className={`text-[10px] ${tagClass} px-1.5 py-0.5 rounded border`}>{label}</span>
          </div>
        </div>
        <div className={`font-stat text-3xl shrink-0 ${color}`}
          style={{ textShadow: edge >= 5 ? '0 0 12px rgba(34,197,94,0.5)' : edge < 0 ? '0 0 12px rgba(239,68,68,0.4)' : 'none' }}>
          {edge > 0 ? '+' : ''}{edge.toFixed(1)}%
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
        <div className="bg-navy-800 rounded p-2">
          <div className="text-slate-500 mb-0.5">Polymarket</div>
          <div className="text-primary font-bold">{marketPrice.toFixed(1)}¢</div>
          <div className="text-slate-400">{marketPrice.toFixed(1)}% implied</div>
        </div>
        <div className="bg-navy-800 rounded p-2">
          <div className="text-slate-500 mb-0.5">Your Estimate</div>
          <div className={`font-bold ${effectiveProb > marketPrice ? 'text-value' : 'text-danger'}`}>
            {effectiveProb.toFixed(1)}%
          </div>
          {overrideProb != null && <div className="text-warn text-[10px]">manual</div>}
        </div>
      </div>

      <div className="mb-3 space-y-1">
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
            <span>Market</span><span>{marketPrice.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 bg-navy-600 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-primary/60" style={{ width: `${Math.min(marketPrice * 2, 100)}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
            <span>Yours</span><span>{effectiveProb.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 bg-navy-600 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${effectiveProb > marketPrice ? 'bg-value' : 'bg-danger/60'}`}
              style={{ width: `${Math.min(effectiveProb * 2, 100)}%` }} />
          </div>
        </div>
      </div>

      {dispatch && (
        <div className="mb-3">
          <label className="text-[10px] text-slate-500 block mb-1">
            Manual override: {overrideProb != null ? `${overrideProb.toFixed(0)}%` : 'off'}
          </label>
          <input
            type="range" min="0" max="100" step="0.5"
            value={overrideProb != null ? overrideProb : userProb}
            onChange={e => dispatch({ type: 'SET_USER_PROB_OVERRIDE', teamId, prob: parseFloat(e.target.value) })}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-primary"
          />
          {overrideProb != null && (
            <button onClick={() => dispatch({ type: 'SET_USER_PROB_OVERRIDE', teamId, prob: undefined })}
              className="text-[10px] text-slate-500 hover:text-danger mt-1">Reset to bracket</button>
          )}
        </div>
      )}

      <a href={url} target="_blank" rel="noopener noreferrer"
        className="w-full block text-center text-xs border border-navy-500 hover:border-primary text-slate-400 hover:text-primary py-1.5 rounded transition-colors">
        Open on Polymarket →
      </a>
    </div>
  )
}

function Section({ title, subtitle, items, emptyMsg }) {
  if (items.length === 0) return (
    <div className="text-slate-600 text-xs py-4">{emptyMsg}</div>
  )
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map(e => <EdgeCard key={e.teamId + e.url} {...e} />)}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function EdgeFinder({ polymarket }) {
  const { activeScenario, dispatch } = useScenario()
  const { groupPicks, bracketPicks, bracketMatchTree, bracketGenerated, userProbOverrides } = activeScenario
  const { getTournamentPrice, getGroupWinnerPrice, getGroupWinnerUrl } = polymarket

  // ── Section 1: Tournament Winner edges (based on bracket deep-run picks) ──
  const tournamentEdges = useMemo(() => {
    if (!bracketGenerated) return []
    return ALL_TEAMS.map(team => {
      const marketPrice = getTournamentPrice(team.id)
      const userProb    = userImpliedProb(team.id, groupPicks, bracketPicks, bracketMatchTree)
      const overrideProb = userProbOverrides?.[team.id]
      const effectiveProb = overrideProb != null ? overrideProb : userProb
      const edge = calcEdge(effectiveProb, marketPrice)
      return { teamId: team.id, marketPrice, userProb, overrideProb, edge, url: WC_WINNER_URL, dispatch }
    }).filter(e => e.userProb > 0 || e.overrideProb != null)
  }, [bracketGenerated, groupPicks, bracketPicks, bracketMatchTree, userProbOverrides, getTournamentPrice])

  // ── Section 2: Group Winner edges (based on group stage picks) ──
  const groupEdges = useMemo(() => {
    return Object.entries(groupPicks || {}).flatMap(([group, order]) => {
      return order.map((teamId, pos) => {
        const marketPrice = getGroupWinnerPrice(teamId)
        if (marketPrice === null) return null
        // User's implied probability: picked 1st = 100%, 2nd = 0% (didn't pick to win group)
        const userProb  = pos === 0 ? 100 : 0
        const edge      = calcEdge(userProb, marketPrice)
        return {
          teamId,
          marketPrice,
          userProb,
          overrideProb: undefined,
          edge,
          url: getGroupWinnerUrl(teamId),
          dispatch: null, // no manual override for group edges
        }
      }).filter(Boolean)
    })
  }, [groupPicks, getGroupWinnerPrice, getGroupWinnerUrl])

  if (!bracketGenerated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center py-24">
          <div className="text-5xl mb-4">🎯</div>
          <h2 className="text-lg font-bold text-slate-200 mb-2">Edge Finder</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Set your group picks and generate your bracket in the <strong className="text-primary">My Bracket</strong> tab first.
          </p>
        </div>
      </div>
    )
  }

  const tValue     = tournamentEdges.filter(e => e.edge >= 3).sort((a, b) => b.edge - a.edge)
  const tOverpriced = tournamentEdges.filter(e => e.edge < 0).sort((a, b) => a.edge - b.edge)

  const gValue      = groupEdges.filter(e => e.edge >= 3).sort((a, b) => b.edge - a.edge)
  const gOverpriced = groupEdges.filter(e => e.edge < 0).sort((a, b) => a.edge - b.edge)

  const bestEdge = Math.max(...tournamentEdges.map(e => e.edge), 0)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-slate-100">Edge Finder</h1>
        <p className="text-xs text-slate-500 mt-0.5">Your bracket picks vs live Polymarket odds — split by bet type</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {[
          { label: 'Tournament Value Bets',  value: tValue.length,      color: 'text-value' },
          { label: 'Best Tournament Edge',   value: bestEdge > 0 ? `+${bestEdge.toFixed(1)}%` : '—', color: 'text-value' },
          { label: 'Group Winner Value Bets',value: gValue.length,      color: 'text-primary' },
          { label: 'Overpriced (Total)',      value: tOverpriced.length + gOverpriced.length, color: 'text-danger' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <div className={`font-stat text-3xl ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-1 font-light">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── SECTION 1: Tournament Winner ── */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest">🏆 Tournament Winner</h2>
          <div className="h-px flex-1 bg-navy-500" />
          <a href={WC_WINNER_URL} target="_blank" rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-primary">polymarket.com/event/world-cup-winner ↗</a>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          Compares how far you picked each team in your bracket vs their odds to win the entire World Cup.
        </p>

        {tValue.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-value uppercase tracking-widest">✅ Value Bets</span>
              <span className="text-xs text-slate-500">({tValue.length})</span>
            </div>
            <Section items={tValue} />
          </div>
        )}
        {tOverpriced.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-danger uppercase tracking-widest">❌ Overpriced / Avoid</span>
              <span className="text-xs text-slate-500">({tOverpriced.length})</span>
            </div>
            <Section items={tOverpriced} />
          </div>
        )}
      </div>

      {/* ── SECTION 2: Group Winner ── */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest">📋 Group Winner</h2>
          <div className="h-px flex-1 bg-navy-500" />
          <span className="text-xs text-slate-500">each links to its specific group market</span>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          Compares the team you picked to win each group vs the odds for that specific group winner market on Polymarket.
        </p>

        {gValue.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-value uppercase tracking-widest">✅ Value Bets</span>
              <span className="text-xs text-slate-500">({gValue.length})</span>
            </div>
            <Section items={gValue} />
          </div>
        )}
        {gOverpriced.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-danger uppercase tracking-widest">❌ Overpriced / Avoid</span>
              <span className="text-xs text-slate-500">({gOverpriced.length})</span>
            </div>
            <Section items={gOverpriced} />
          </div>
        )}
      </div>
    </div>
  )
}
