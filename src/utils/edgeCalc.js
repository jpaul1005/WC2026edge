import { STAGE_WIN_PROB } from '../data/teams.js'

// Determine user-implied win probability from bracket depth
export function userImpliedProb(teamId, groupPicks, bracketPicks, bracketMatchTree) {
  if (!bracketMatchTree) return 0

  // Check if team is champion
  const finalMatch = bracketMatchTree.final?.[0]
  if (finalMatch && bracketPicks[finalMatch.id] === teamId) {
    return STAGE_WIN_PROB.champion
  }

  // Check runner-up (was in final, didn't win)
  if (finalMatch && (finalMatch.slot1 === teamId || finalMatch.slot2 === teamId)) {
    return STAGE_WIN_PROB.runnerUp
  }

  // Check top 4 (SF)
  for (const m of bracketMatchTree.sf || []) {
    if (bracketPicks[m.id] === teamId) return STAGE_WIN_PROB.top4
    if (m.slot1 === teamId || m.slot2 === teamId) return STAGE_WIN_PROB.top4
  }

  // Check top 8 (QF)
  for (const m of bracketMatchTree.qf || []) {
    if (bracketPicks[m.id] === teamId) return STAGE_WIN_PROB.top8
    if (m.slot1 === teamId || m.slot2 === teamId) return STAGE_WIN_PROB.top8
  }

  // Check top 16 (R16)
  for (const m of bracketMatchTree.r16 || []) {
    if (bracketPicks[m.id] === teamId) return STAGE_WIN_PROB.top16
    if (m.slot1 === teamId || m.slot2 === teamId) return STAGE_WIN_PROB.top16
  }

  // Check top 32 (R32)
  for (const m of bracketMatchTree.r32 || []) {
    if (bracketPicks[m.id] === teamId) return STAGE_WIN_PROB.top32
    if (m.slot1 === teamId || m.slot2 === teamId) return STAGE_WIN_PROB.top32
  }

  // Check group stage
  for (const [group, order] of Object.entries(groupPicks || {})) {
    const pos = order.indexOf(teamId)
    if (pos === 0) return STAGE_WIN_PROB.groupWinner
    if (pos === 1) return STAGE_WIN_PROB.groupSecond
    if (pos === 2) return STAGE_WIN_PROB.groupThird
    if (pos === 3) return STAGE_WIN_PROB.groupFourth
  }

  return 0
}

export function calcEdge(userProb, marketPrice) {
  // marketPrice is in cents (0-100), same scale as userProb (0-100)
  return userProb - marketPrice
}

export function edgeLabel(edge) {
  if (edge >= 10) return 'DARK HORSE'
  if (edge >= 3)  return 'VALUE'
  if (edge >= 0)  return 'FAIR'
  if (edge >= -5) return 'SLIGHT OVERPRICED'
  return 'OVERPRICED'
}

export function edgeColor(edge) {
  if (edge >= 5)  return 'text-value'
  if (edge >= 0)  return 'text-primary'
  return 'text-danger'
}

// P&L projection for position tracker
export function projectStages(entryPrice, shares, currentPrice) {
  const invested = (entryPrice / 100) * shares
  const stages = [
    { label: 'Group Winner',  multiplier: 1.40 },
    { label: 'Round of 32',   multiplier: 1.30 },
    { label: 'Round of 16',   multiplier: 1.50 },
    { label: 'Quarter-Final', multiplier: 1.60 },
    { label: 'Semi-Final',    multiplier: 1.80 },
    { label: 'Champion 🏆',   multiplier: null, resolveAt: 100 },
  ]

  let runningPrice = currentPrice
  return stages.map(s => {
    let projPrice
    if (s.resolveAt) {
      projPrice = s.resolveAt
    } else {
      projPrice = Math.min(runningPrice * s.multiplier, 99)
    }
    runningPrice = projPrice
    const projValue = (projPrice / 100) * shares
    const pnl = projValue - invested
    const pnlPct = ((projValue - invested) / invested) * 100
    return {
      label:    s.label,
      price:    Math.round(projPrice * 100) / 100,
      value:    projValue,
      pnl,
      pnlPct,
    }
  })
}
