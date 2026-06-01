import React, { useState } from 'react'
import { useScenario } from '../../context/ScenarioContext.jsx'
import { buildR32Matchups } from '../../utils/bracketLogic.js'
import { TEAM_BY_ID } from '../../data/teams.js'
import GroupStage from './GroupStage.jsx'
import KnockoutBracket from './KnockoutBracket.jsx'

const ROUNDS = [
  { id: 'groups', label: 'Groups' },
  { id: 'r32',    label: 'R32' },
  { id: 'r16',    label: 'R16' },
  { id: 'qf',     label: 'QF' },
  { id: 'sf',     label: 'Semis' },
  { id: 'final',  label: 'Final' },
]

export default function Bracket({ polymarket }) {
  const { activeScenario, dispatch } = useScenario()
  const [round, setRound] = useState('groups')

  const { groupPicks, bestThirds, bracketGenerated, bracketMatchTree, bracketPicks } = activeScenario

  const handleGenerateBracket = () => {
    const r32Matches = buildR32Matchups(groupPicks, bestThirds)
    dispatch({ type: 'GENERATE_BRACKET', r32Matches })
    setRound('r32')
  }

  // Determine champion
  const finalMatch = bracketMatchTree.final?.[0]
  const champion = finalMatch ? bracketPicks[finalMatch.id] : null

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-lg font-bold text-slate-100">My Bracket</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            48 teams · 12 groups · R32 → Final
          </p>
        </div>
        {!bracketGenerated && round === 'groups' && (
          <button onClick={handleGenerateBracket} className="btn-primary">
            Generate Bracket →
          </button>
        )}
        {bracketGenerated && (
          <button
            onClick={() => {
              dispatch({ type: 'GENERATE_BRACKET', r32Matches: buildR32Matchups(groupPicks, bestThirds) })
              setRound('r32')
            }}
            className="btn-ghost text-xs"
          >
            Regenerate
          </button>
        )}
      </div>

      {/* Round navigation */}
      <div className="flex gap-1 overflow-x-auto mb-6 pb-1">
        {ROUNDS.map(r => (
          <button
            key={r.id}
            onClick={() => {
              if (r.id !== 'groups' && !bracketGenerated) {
                alert('Generate the bracket first from the Groups tab.')
                return
              }
              setRound(r.id)
            }}
            className={`
              whitespace-nowrap px-4 py-1.5 rounded text-xs font-semibold transition-all shrink-0
              ${round === r.id
                ? 'bg-primary/20 text-primary border border-primary/50'
                : 'border border-navy-500 text-slate-400 hover:text-slate-200 hover:border-navy-400'
              }
              ${r.id !== 'groups' && !bracketGenerated ? 'opacity-40 cursor-not-allowed' : ''}
            `}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Champion banner */}
      {champion && (
        <ChampionBanner teamId={champion} polymarket={polymarket} />
      )}

      {round === 'groups' && (
        <GroupStage groupPicks={groupPicks} bestThirds={bestThirds} />
      )}

      {round !== 'groups' && bracketGenerated && (
        <KnockoutBracket
          round={round}
          matchTree={bracketMatchTree}
          bracketPicks={bracketPicks}
          polymarket={polymarket}
        />
      )}
    </div>
  )
}

function ChampionBanner({ teamId, polymarket }) {
  const team = TEAM_BY_ID[teamId]
  const price = polymarket.getPriceForTeam(teamId)
  return (
    <div className="card border-primary/40 bg-primary/5 p-4 mb-6 flex items-center gap-4">
      <span className="text-4xl">{team?.flag}</span>
      <div>
        <div className="text-xs text-primary font-bold uppercase tracking-widest mb-1">🏆 Your Champion</div>
        <div className="text-lg font-bold text-slate-100">{team?.name}</div>
        <div className="text-xs text-slate-400">Polymarket: {price.toFixed(1)}¢ · {price.toFixed(1)}% implied</div>
      </div>
    </div>
  )
}
