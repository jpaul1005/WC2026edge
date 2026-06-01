import React, { useState } from 'react'
import { GROUPS, TEAM_BY_ID } from '../../data/teams.js'
import { useScenario } from '../../context/ScenarioContext.jsx'

const GROUP_KEYS = Object.keys(GROUPS)

function TeamRow({ teamId, position, onMoveUp, onMoveDown, isFirst, isLast, qualifies, isThird }) {
  const team = TEAM_BY_ID[teamId]
  if (!team) return null

  return (
    <div className={`
      flex items-center gap-2 px-3 py-2 rounded transition-colors group
      ${qualifies === 'auto' ? 'bg-primary/10' : ''}
      ${qualifies === 'third' ? 'bg-warn/10' : ''}
      ${qualifies === 'out' ? 'opacity-50' : ''}
    `}>
      <span className="text-slate-500 text-xs w-4 text-center font-mono">{position}</span>
      <span className="text-lg leading-none">{team.flag}</span>
      <span className="text-sm text-slate-200 flex-1 truncate">{team.name}</span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="text-slate-500 hover:text-primary disabled:opacity-20 text-xs w-5 h-5 flex items-center justify-center"
        >▲</button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="text-slate-500 hover:text-primary disabled:opacity-20 text-xs w-5 h-5 flex items-center justify-center"
        >▼</button>
      </div>
      {qualifies === 'auto' && <span className="tag-primary text-[10px] shrink-0">ADV</span>}
      {qualifies === 'third' && <span className="tag-warn text-[10px] shrink-0">3rd</span>}
      {qualifies === 'out'   && <span className="text-[10px] text-slate-600 shrink-0">OUT</span>}
    </div>
  )
}

function GroupCard({ groupKey }) {
  const { activeScenario, dispatch } = useScenario()
  const order = activeScenario.groupPicks[groupKey] || GROUPS[groupKey].map(t => t.id)
  const bestThirds = activeScenario.bestThirds || []

  const move = (fromIdx, toIdx) => {
    const newOrder = [...order]
    const [item] = newOrder.splice(fromIdx, 1)
    newOrder.splice(toIdx, 0, item)
    dispatch({ type: 'UPDATE_GROUP_PICKS', group: groupKey, order: newOrder })
  }

  const toggleThird = (teamId) => {
    const isIn = bestThirds.includes(teamId)
    let newThirds
    if (isIn) {
      newThirds = bestThirds.filter(id => id !== teamId)
    } else {
      if (bestThirds.length >= 8) {
        alert('You can only select 8 best 3rd-place teams.')
        return
      }
      newThirds = [...bestThirds, teamId]
    }
    dispatch({ type: 'SET_BEST_THIRDS', bestThirds: newThirds })
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-navy-600 border-b border-navy-500">
        <span className="text-primary font-bold text-sm">Group {groupKey}</span>
        <span className="text-slate-500 text-xs">{order.length} teams</span>
      </div>
      <div className="divide-y divide-navy-600">
        {order.map((teamId, idx) => {
          let qualifies = 'out'
          if (idx === 0 || idx === 1) qualifies = 'auto'
          else if (idx === 2 && bestThirds.includes(teamId)) qualifies = 'third'

          return (
            <div key={teamId} className="relative">
              <TeamRow
                teamId={teamId}
                position={idx + 1}
                isFirst={idx === 0}
                isLast={idx === order.length - 1}
                qualifies={qualifies}
                onMoveUp={() => idx > 0 && move(idx, idx - 1)}
                onMoveDown={() => idx < order.length - 1 && move(idx, idx + 1)}
              />
              {idx === 2 && (
                <button
                  onClick={() => toggleThird(teamId)}
                  className={`absolute right-8 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                    bestThirds.includes(teamId)
                      ? 'border-warn/60 text-warn bg-warn/10'
                      : 'border-navy-400 text-slate-500 hover:border-warn/40 hover:text-warn/70'
                  }`}
                  title="Toggle as best 3rd place qualifier"
                >
                  {bestThirds.includes(teamId) ? '★' : '☆'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function GroupStage() {
  const { activeScenario } = useScenario()
  const bestThirdsCount = activeScenario.bestThirds?.length || 0

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-slate-500">
          Top 2 from each group auto-advance. Select up to 8 best 3rd-place teams with ☆.
        </p>
        <span className={`text-xs font-semibold ${bestThirdsCount === 8 ? 'text-value' : 'text-slate-400'}`}>
          3rd place: {bestThirdsCount}/8 selected
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {GROUP_KEYS.map(g => <GroupCard key={g} groupKey={g} />)}
      </div>
    </div>
  )
}
