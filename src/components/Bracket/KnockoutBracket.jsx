import React, { useState } from 'react'
import { TEAM_BY_ID } from '../../data/teams.js'
import { useScenario } from '../../context/ScenarioContext.jsx'

const ROUND_MAP = {
  r32:   { key: 'r32',   title: 'Round of 32',   },
  r16:   { key: 'r16',   title: 'Round of 16',   },
  qf:    { key: 'qf',    title: 'Quarter-Finals', },
  sf:    { key: 'sf',    title: 'Semi-Finals',    },
  final: { key: 'final', title: 'Final',          },
}

// Stage price multipliers when a team advances
const STAGE_MULTIPLIERS = {
  r32:   1.30,
  r16:   1.50,
  qf:    1.60,
  sf:    1.80,
  final: null, // resolves at 100¢
}

function TeamSlot({ teamId, isWinner, onClick, disabled, price }) {
  const team = teamId ? TEAM_BY_ID[teamId] : null
  if (!teamId) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded bg-navy-600/40 border border-dashed border-navy-500">
        <span className="text-slate-600 text-xs">TBD</span>
      </div>
    )
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center gap-2 px-3 py-2 rounded border transition-all text-left
        ${isWinner
          ? 'bg-primary/20 border-primary/60 text-primary font-semibold'
          : 'bg-navy-600/60 border-navy-500 text-slate-300 hover:border-primary/40 hover:bg-navy-600'
        }
        ${disabled ? 'cursor-default' : 'cursor-pointer'}
      `}
    >
      <span className="text-base leading-none">{team?.flag || '🏳️'}</span>
      <span className="text-xs truncate flex-1">{team?.name || teamId}</span>
      {price != null && (
        <span className={`text-[10px] font-mono shrink-0 ${isWinner ? 'text-primary' : 'text-slate-500'}`}>
          {price.toFixed(1)}¢
        </span>
      )}
      {isWinner && <span className="text-primary text-xs shrink-0">✓</span>}
    </button>
  )
}

function MatchCard({ match, bracketPicks, onPick, polymarket }) {
  const winner = bracketPicks[match.id]
  const bothReady = match.slot1 && match.slot2
  const p1 = match.slot1 ? polymarket.getTournamentPrice(match.slot1) : null
  const p2 = match.slot2 ? polymarket.getTournamentPrice(match.slot2) : null

  return (
    <div className="card p-2 min-w-[170px]">
      <div className="space-y-1">
        <TeamSlot teamId={match.slot1} isWinner={winner === match.slot1} price={p1}
          disabled={!bothReady} onClick={() => bothReady && onPick(match.id, match.slot1)} />
        <div className="text-[10px] text-slate-600 text-center font-mono">vs</div>
        <TeamSlot teamId={match.slot2} isWinner={winner === match.slot2} price={p2}
          disabled={!bothReady} onClick={() => bothReady && onPick(match.id, match.slot2)} />
      </div>
    </div>
  )
}

// ── Bet Simulator ─────────────────────────────────────────────────────────────
function BetSimulator({ matchTree, bracketPicks, polymarket }) {
  const [teamId, setTeamId] = useState('')
  const [amount, setAmount] = useState('')

  // Collect all teams that appear anywhere in the bracket
  const allBracketTeams = React.useMemo(() => {
    const seen = new Set()
    Object.values(matchTree).flat().forEach(m => {
      if (m.slot1) seen.add(m.slot1)
      if (m.slot2) seen.add(m.slot2)
    })
    return [...seen].map(id => TEAM_BY_ID[id]).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name))
  }, [matchTree])

  const currentPrice = teamId ? polymarket.getTournamentPrice(teamId) : null
  const dollars = parseFloat(amount) || 0
  const shares = currentPrice && dollars > 0 ? (dollars / (currentPrice / 100)) : 0

  // Figure out how far user picked this team
  const rounds = ['r32', 'r16', 'qf', 'sf', 'final']
  const projections = React.useMemo(() => {
    if (!teamId || !dollars) return []
    let runningPrice = currentPrice

    return rounds.map(round => {
      const matches = matchTree[round] || []
      const isPickedThisRound = matches.some(m => bracketPicks[m.id] === teamId)
      const appearsThisRound  = matches.some(m => m.slot1 === teamId || m.slot2 === teamId)

      let projPrice
      if (round === 'final') {
        projPrice = 100 // resolves at $1.00
      } else {
        const mult = STAGE_MULTIPLIERS[round]
        projPrice = Math.min((runningPrice || currentPrice) * mult, 99)
      }
      runningPrice = projPrice

      const projValue = (projPrice / 100) * shares
      const pnl       = projValue - dollars
      const pnlPct    = dollars > 0 ? (pnl / dollars) * 100 : 0

      const label = {
        r32:   'Wins R32 → R16',
        r16:   'Wins R16 → QF',
        qf:    'Wins QF → SF',
        sf:    'Wins SF → Final',
        final: '🏆 World Cup Champion',
      }[round]

      return {
        round, label, projPrice, projValue, pnl, pnlPct,
        isPicked: isPickedThisRound,
        appears:  appearsThisRound,
      }
    })
  }, [teamId, dollars, currentPrice, shares, matchTree, bracketPicks])

  const team = teamId ? TEAM_BY_ID[teamId] : null

  return (
    <div className="card p-5 mb-6 border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-primary text-lg">💵</span>
        <h3 className="text-sm font-bold text-slate-200">Bet Simulator</h3>
        <span className="text-xs text-slate-500">— see your projected payout at each stage</span>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div>
          <label className="text-xs text-slate-500 block mb-1">Team</label>
          <select className="input text-xs" value={teamId} onChange={e => setTeamId(e.target.value)}>
            <option value="">Select a team...</option>
            {allBracketTeams.map(t => (
              <option key={t.id} value={t.id}>{t.flag} {t.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Bet Amount (USD)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
            <input
              type="number" min="0.01" step="0.01"
              className="input text-xs pl-6 w-32"
              placeholder="10.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>
        </div>
        {team && currentPrice && (
          <div className="flex items-end pb-0.5">
            <div className="bg-navy-800 rounded px-3 py-2 text-xs">
              <div className="text-slate-500 mb-0.5">{team.flag} Current odds</div>
              <div className="text-primary font-bold">{currentPrice.toFixed(1)}¢</div>
              {dollars > 0 && <div className="text-slate-400">{shares.toFixed(1)} shares</div>}
            </div>
          </div>
        )}
      </div>

      {projections.length > 0 && dollars > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-navy-500">
                <th className="text-left py-2 pr-4">Stage</th>
                <th className="text-right py-2 pr-4">Est. Price</th>
                <th className="text-right py-2 pr-4">Your Shares Value</th>
                <th className="text-right py-2">Profit / Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-600">
              <tr className="text-slate-400">
                <td className="py-2 pr-4">
                  <span className="text-slate-500">Entry (now)</span>
                </td>
                <td className="text-right py-2 pr-4 text-primary">{currentPrice?.toFixed(1)}¢</td>
                <td className="text-right py-2 pr-4">${dollars.toFixed(2)}</td>
                <td className="text-right py-2 text-slate-500">—</td>
              </tr>
              {projections.map(p => (
                <tr key={p.round}
                  className={`transition-colors ${p.isPicked ? 'bg-value/5' : ''}`}>
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-2">
                      <span className={p.isPicked ? 'text-value font-semibold' : 'text-slate-400'}>
                        {p.label}
                      </span>
                      {p.isPicked && <span className="tag-value text-[9px]">YOUR PICK</span>}
                    </div>
                  </td>
                  <td className="text-right py-2 pr-4 text-primary font-mono">
                    {p.round === 'final' ? '100¢' : `~${p.projPrice.toFixed(1)}¢`}
                  </td>
                  <td className="text-right py-2 pr-4 text-slate-300 font-mono">
                    ${p.projValue.toFixed(2)}
                  </td>
                  <td className={`text-right py-2 font-bold font-mono ${p.pnl >= 0 ? 'text-value' : 'text-danger'}`}>
                    {p.pnl >= 0 ? '+' : ''}${p.pnl.toFixed(2)}
                    <span className="text-[10px] ml-1 opacity-70">
                      ({p.pnlPct >= 0 ? '+' : ''}{p.pnlPct.toFixed(0)}%)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[10px] text-slate-600 mt-2">
            * Prices are estimated based on typical Polymarket movement when teams advance. Actual prices will vary.
          </p>
        </div>
      )}

      {(!teamId || !dollars) && (
        <div className="text-center py-6 text-slate-600 text-xs">
          Select a team and enter a bet amount to see your projected stage-by-stage payout
        </div>
      )}
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function KnockoutBracket({ round, matchTree, bracketPicks, polymarket }) {
  const { dispatch } = useScenario()
  const config = ROUND_MAP[round]
  if (!config) return null

  const matches = matchTree[config.key] || []

  const handlePick = (matchId, teamId) => {
    dispatch({ type: 'SET_BRACKET_PICK', matchId, winner: teamId })
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500">
        <div className="text-4xl mb-3">🔒</div>
        <div>Complete previous rounds to unlock {config.title}</div>
      </div>
    )
  }

  return (
    <div>
      {/* Bet Simulator — shown on all knockout rounds */}
      <BetSimulator matchTree={matchTree} bracketPicks={bracketPicks} polymarket={polymarket} />

      <div className="flex items-center gap-3 mb-5">
        <h2 className="text-sm font-bold text-slate-200">{config.title}</h2>
        <div className="h-px flex-1 bg-navy-500" />
        <span className="text-xs text-slate-500">{matches.length} matches · click a team to advance them</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {matches.map(match => (
          <MatchCard
            key={match.id}
            match={match}
            bracketPicks={bracketPicks}
            onPick={handlePick}
            polymarket={polymarket}
          />
        ))}
      </div>
    </div>
  )
}
