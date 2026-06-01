import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { GROUPS } from '../data/teams.js'

// ── Default data ──────────────────────────────────────────────────────────────
const DEFAULT_GROUP_PICKS = Object.fromEntries(
  Object.entries(GROUPS).map(([g, teams]) => [g, teams.map(t => t.id)])
)

function makeScenario(overrides = {}) {
  return {
    id:               crypto.randomUUID(),
    name:             'New Scenario',
    groupPicks:       JSON.parse(JSON.stringify(DEFAULT_GROUP_PICKS)),
    bestThirds:       [],          // up to 8 teamIds that advance as 3rd place
    bracketGenerated: false,
    r32Matches:       [],
    bracketPicks:     {},          // { matchId: winnerId }
    bracketMatchTree: { r32: [], r16: [], qf: [], sf: [], final: [] },
    positions:        [],          // position tracker entries
    userProbOverrides:{},          // { teamId: 0-100 }
    createdAt:        Date.now(),
    updatedAt:        Date.now(),
    ...overrides,
  }
}

const DEFAULT_SCENARIO = makeScenario({ name: 'Scenario A' })

// ── Reducer ───────────────────────────────────────────────────────────────────
function reducer(state, action) {
  const { scenarios, activeId } = state

  const updateScenario = (id, updater) => ({
    ...state,
    scenarios: scenarios.map(s =>
      s.id === id ? { ...updater(s), updatedAt: Date.now() } : s
    ),
  })

  switch (action.type) {
    case 'CREATE_SCENARIO': {
      const s = makeScenario({ name: action.name || `Scenario ${scenarios.length + 1}` })
      return { ...state, scenarios: [...scenarios, s], activeId: s.id }
    }
    case 'DUPLICATE_SCENARIO': {
      const src = scenarios.find(s => s.id === action.id)
      if (!src) return state
      const dup = makeScenario({
        ...JSON.parse(JSON.stringify(src)),
        id: crypto.randomUUID(),
        name: `${src.name} (copy)`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      return { ...state, scenarios: [...scenarios, dup], activeId: dup.id }
    }
    case 'DELETE_SCENARIO': {
      if (scenarios.length === 1) return state
      const rest = scenarios.filter(s => s.id !== action.id)
      return { ...state, scenarios: rest, activeId: rest[0].id }
    }
    case 'SET_ACTIVE': {
      return { ...state, activeId: action.id }
    }
    case 'RENAME_SCENARIO': {
      return updateScenario(action.id, s => ({ ...s, name: action.name }))
    }
    case 'UPDATE_GROUP_PICKS': {
      return updateScenario(activeId, s => ({
        ...s,
        groupPicks: { ...s.groupPicks, [action.group]: action.order },
        bracketGenerated: false,
        r32Matches: [],
        bracketPicks: {},
        bracketMatchTree: { r32: [], r16: [], qf: [], sf: [], final: [] },
      }))
    }
    case 'SET_BEST_THIRDS': {
      return updateScenario(activeId, s => ({
        ...s,
        bestThirds: action.bestThirds,
        bracketGenerated: false,
        r32Matches: [],
        bracketPicks: {},
        bracketMatchTree: { r32: [], r16: [], qf: [], sf: [], final: [] },
      }))
    }
    case 'GENERATE_BRACKET': {
      return updateScenario(activeId, s => ({
        ...s,
        r32Matches: action.r32Matches,
        bracketMatchTree: { r32: action.r32Matches, r16: [], qf: [], sf: [], final: [] },
        bracketGenerated: true,
        bracketPicks: {},
      }))
    }
    case 'SET_BRACKET_PICK': {
      return updateScenario(activeId, s => {
        const newPicks = { ...s.bracketPicks, [action.matchId]: action.winner }
        // Rebuild downstream rounds based on new picks
        const tree = rebuildTree(s.r32Matches, newPicks)
        return { ...s, bracketPicks: newPicks, bracketMatchTree: tree }
      })
    }
    case 'ADD_POSITION': {
      return updateScenario(activeId, s => ({
        ...s,
        positions: [...s.positions, { ...action.position, id: crypto.randomUUID(), closed: false, closedAt: null, exitPrice: null }],
      }))
    }
    case 'CLOSE_POSITION': {
      return updateScenario(activeId, s => ({
        ...s,
        positions: s.positions.map(p =>
          p.id === action.id ? { ...p, closed: true, closedAt: Date.now(), exitPrice: action.exitPrice } : p
        ),
      }))
    }
    case 'DELETE_POSITION': {
      return updateScenario(activeId, s => ({
        ...s,
        positions: s.positions.filter(p => p.id !== action.id),
      }))
    }
    case 'SET_USER_PROB_OVERRIDE': {
      return updateScenario(activeId, s => ({
        ...s,
        userProbOverrides: { ...s.userProbOverrides, [action.teamId]: action.prob },
      }))
    }
    default:
      return state
  }
}

function rebuildTree(r32Matches, picks) {
  const winners = (matches) => matches.map(m => picks[m.id] || null)

  const r32 = r32Matches || []
  const r32w = winners(r32)

  const r16 = pairUp(r32, r32w, 'r16')
  const r16w = winners(r16)

  const qf = pairUp(r16, r16w, 'qf')
  const qfw = winners(qf)

  const sf = pairUp(qf, qfw, 'sf')
  const sfw = winners(sf)

  const final = pairUp(sf, sfw, 'final')

  return { r32, r16, qf, sf, final }
}

function pairUp(prevMatches, prevWinners, roundPrefix) {
  const result = []
  for (let i = 0; i < prevMatches.length; i += 2) {
    result.push({
      id: `${roundPrefix}_${Math.floor(i / 2) + 1}`,
      slot1: prevWinners[i]   || null,
      slot2: prevWinners[i + 1] || null,
    })
  }
  return result
}

// ── Context ───────────────────────────────────────────────────────────────────
const ScenarioContext = createContext(null)
const STORAGE_KEY = 'wc2026edge_scenarios_v3'

// Clear any old versions on startup
;['wc2026edge_scenarios_v1', 'wc2026edge_scenarios_v2'].forEach(k => localStorage.removeItem(k))

export function ScenarioProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.scenarios?.length) {
          // Validate: check if team IDs in groupPicks match current GROUPS
          const validIds = new Set(Object.values(GROUPS).flat().map(t => t.id))
          const firstPicks = parsed.scenarios[0]?.groupPicks?.A || []
          const isValid = firstPicks.length > 0 && firstPicks.every(id => validIds.has(id))
          if (isValid) return parsed
          // Invalid team IDs found — clear and start fresh
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    } catch {}
    return { scenarios: [DEFAULT_SCENARIO], activeId: DEFAULT_SCENARIO.id }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const activeScenario = state.scenarios.find(s => s.id === state.activeId) || state.scenarios[0]

  return (
    <ScenarioContext.Provider value={{ state, dispatch, activeScenario }}>
      {children}
    </ScenarioContext.Provider>
  )
}

export function useScenario() {
  const ctx = useContext(ScenarioContext)
  if (!ctx) throw new Error('useScenario must be used within ScenarioProvider')
  return ctx
}
