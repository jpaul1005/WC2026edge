import React, { useState, useMemo } from 'react'
import { useScenario } from '../../context/ScenarioContext.jsx'
import { TEAM_BY_ID, ALL_TEAMS } from '../../data/teams.js'
import { projectStages } from '../../utils/edgeCalc.js'

const MARKET_TYPES = [
  'Tournament Winner',
  'Group Winner',
  'Reaches QF',
  'Reaches SF',
  'Reaches Final',
]

function fmt(n) {
  const abs = Math.abs(n)
  return (n < 0 ? '-' : '+') + '$' + abs.toFixed(2)
}
function fmtUsd(n) {
  return '$' + Math.abs(n).toFixed(2)
}
function fmtPct(n) {
  return (n >= 0 ? '+' : '') + n.toFixed(1) + '%'
}

// ── Add Position Form ─────────────────────────────────────────────────────────
function AddPositionForm({ onAdd, onCancel }) {
  const [form, setForm] = useState({
    teamId: '',
    marketType: 'Tournament Winner',
    shares: '',
    entryPrice: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    if (!form.teamId || !form.shares || !form.entryPrice) return
    onAdd({
      teamId:     form.teamId,
      marketType: form.marketType,
      shares:     parseFloat(form.shares),
      entryPrice: parseFloat(form.entryPrice),
      date:       form.date,
      notes:      form.notes,
    })
  }

  return (
    <form onSubmit={submit} className="card p-5 mb-6">
      <h3 className="text-sm font-bold text-slate-200 mb-4">Add Position</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="text-xs text-slate-500 block mb-1">Team</label>
          <select
            className="input w-full"
            value={form.teamId}
            onChange={e => set('teamId', e.target.value)}
            required
          >
            <option value="">Select team...</option>
            {ALL_TEAMS.sort((a, b) => a.name.localeCompare(b.name)).map(t => (
              <option key={t.id} value={t.id}>{t.flag} {t.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Market Type</label>
          <select
            className="input w-full"
            value={form.marketType}
            onChange={e => set('marketType', e.target.value)}
          >
            {MARKET_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Shares</label>
          <input
            type="number"
            className="input w-full"
            placeholder="e.g. 100"
            min="0.01"
            step="0.01"
            value={form.shares}
            onChange={e => set('shares', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Entry Price (¢)</label>
          <input
            type="number"
            className="input w-full"
            placeholder="e.g. 22"
            min="0.01"
            max="99.99"
            step="0.01"
            value={form.entryPrice}
            onChange={e => set('entryPrice', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Date</label>
          <input
            type="date"
            className="input w-full"
            value={form.date}
            onChange={e => set('date', e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Notes (optional)</label>
          <input
            className="input w-full"
            placeholder="e.g. pre-draw value play"
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary">Add Position</button>
        <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
      </div>
    </form>
  )
}

// ── Stage Projection Table ────────────────────────────────────────────────────
function StageProjection({ position, currentPrice }) {
  const projections = projectStages(position.entryPrice, position.shares, currentPrice)
  const invested = (position.entryPrice / 100) * position.shares

  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-slate-500">
            <th className="text-left py-1 pr-3">Stage</th>
            <th className="text-right py-1 pr-3">Est. Price</th>
            <th className="text-right py-1 pr-3">Value</th>
            <th className="text-right py-1">P&amp;L</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-600">
          {projections.map(p => (
            <tr key={p.label} className="hover:bg-navy-600/30">
              <td className="py-1 pr-3 text-slate-300">{p.label}</td>
              <td className="py-1 pr-3 text-right text-primary">{p.price.toFixed(1)}¢</td>
              <td className="py-1 pr-3 text-right text-slate-300">{fmtUsd(p.value)}</td>
              <td className={`py-1 text-right font-semibold ${p.pnl >= 0 ? 'text-value' : 'text-danger'}`}>
                {fmt(p.pnl)} ({fmtPct(p.pnlPct)})
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Position Card ─────────────────────────────────────────────────────────────
function PositionCard({ position, polymarket, onClose, onDelete }) {
  const [showProjection, setShowProjection] = useState(false)
  const [closeMode, setCloseMode] = useState(false)
  const [exitPrice, setExitPrice] = useState('')
  const team = TEAM_BY_ID[position.teamId]
  const currentPrice = polymarket.getPriceForTeam(position.teamId)
  const invested   = (position.entryPrice / 100) * position.shares
  const currentVal = (currentPrice / 100) * position.shares
  const pnl        = currentVal - invested
  const pnlPct     = (pnl / invested) * 100
  const cashOut    = currentVal

  // Closed position
  if (position.closed) {
    const realizedPnl = position.exitPrice
      ? ((position.exitPrice / 100) * position.shares) - invested
      : null
    return (
      <div className="card p-4 opacity-70">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{team?.flag}</span>
            <div>
              <div className="text-sm font-semibold text-slate-400 line-through">{team?.name}</div>
              <div className="text-xs text-slate-600">{position.marketType}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 mb-0.5">Closed</div>
            {realizedPnl != null && (
              <div className={`text-sm font-bold ${realizedPnl >= 0 ? 'text-value' : 'text-danger'}`}>
                {fmt(realizedPnl)}
              </div>
            )}
          </div>
        </div>
        <div className="mt-2 text-xs text-slate-600 flex gap-4">
          <span>Entry: {position.entryPrice.toFixed(1)}¢</span>
          {position.exitPrice && <span>Exit: {position.exitPrice.toFixed(1)}¢</span>}
          <span>{position.shares} shares</span>
        </div>
        <button onClick={onDelete} className="mt-2 text-[10px] text-slate-600 hover:text-danger">Remove</button>
      </div>
    )
  }

  return (
    <div className={`card p-4 border-l-2 ${pnl >= 0 ? 'border-l-value' : 'border-l-danger'}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl leading-none">{team?.flag}</span>
          <div>
            <div className="text-sm font-semibold text-slate-100">{team?.name}</div>
            <div className="text-xs text-slate-500">{position.marketType}</div>
            {position.notes && <div className="text-[10px] text-slate-600 mt-0.5 italic">{position.notes}</div>}
          </div>
        </div>
        <div className={`text-right`}>
          <div className={`text-lg font-bold ${pnl >= 0 ? 'text-value' : 'text-danger'}`}>{fmt(pnl)}</div>
          <div className={`text-xs ${pnl >= 0 ? 'text-value/70' : 'text-danger/70'}`}>{fmtPct(pnlPct)}</div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
        {[
          { label: 'Entry', value: `${position.entryPrice.toFixed(1)}¢` },
          { label: 'Current', value: `${currentPrice.toFixed(1)}¢`, highlight: true },
          { label: 'Shares', value: position.shares.toLocaleString() },
          { label: 'Invested', value: fmtUsd(invested) },
          { label: 'Value Now', value: fmtUsd(currentVal) },
          { label: 'Cash Out', value: fmtUsd(cashOut), green: true },
        ].map(s => (
          <div key={s.label} className="bg-navy-800 rounded p-2 text-center">
            <div className="text-slate-500 text-[10px] mb-0.5">{s.label}</div>
            <div className={`font-semibold ${s.highlight ? 'text-primary' : s.green ? 'text-value' : 'text-slate-200'}`}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          onClick={() => setShowProjection(p => !p)}
          className="btn-ghost text-xs py-1 px-3"
        >
          {showProjection ? 'Hide' : 'Stage Projections'}
        </button>
        <button
          onClick={() => setCloseMode(c => !c)}
          className="btn-ghost text-xs py-1 px-3"
        >
          Close Position
        </button>
        <button onClick={onDelete} className="text-slate-500 hover:text-danger text-xs px-2">
          🗑
        </button>
      </div>

      {closeMode && (
        <div className="flex gap-2 mt-2">
          <input
            type="number"
            className="input text-xs py-1 w-32"
            placeholder="Exit price (¢)"
            min="0"
            max="100"
            step="0.01"
            value={exitPrice}
            onChange={e => setExitPrice(e.target.value)}
          />
          <button
            onClick={() => { onClose(parseFloat(exitPrice) || currentPrice); setCloseMode(false) }}
            className="btn-primary text-xs py-1 px-3"
          >
            Confirm Close
          </button>
          <button onClick={() => setCloseMode(false)} className="btn-ghost text-xs py-1 px-2">✕</button>
        </div>
      )}

      {showProjection && (
        <StageProjection position={position} currentPrice={currentPrice} />
      )}
    </div>
  )
}

// ── Main Tab ──────────────────────────────────────────────────────────────────
export default function PositionTracker({ polymarket }) {
  const { activeScenario, dispatch } = useScenario()
  const [showAdd, setShowAdd] = useState(false)
  const [showClosed, setShowClosed] = useState(false)

  const positions     = activeScenario.positions || []
  const openPositions = positions.filter(p => !p.closed)
  const closedPositions = positions.filter(p => p.closed)

  const portfolio = useMemo(() => {
    let totalInvested = 0
    let totalValue    = 0
    openPositions.forEach(p => {
      const cur = polymarket.getPriceForTeam(p.teamId)
      totalInvested += (p.entryPrice / 100) * p.shares
      totalValue    += (cur / 100) * p.shares
    })
    const pnl    = totalValue - totalInvested
    const pnlPct = totalInvested > 0 ? (pnl / totalInvested) * 100 : 0
    return { totalInvested, totalValue, pnl, pnlPct }
  }, [openPositions, polymarket.markets])

  const realizedPnl = useMemo(() => {
    return closedPositions.reduce((sum, p) => {
      if (!p.exitPrice) return sum
      const invested = (p.entryPrice / 100) * p.shares
      const received = (p.exitPrice / 100) * p.shares
      return sum + (received - invested)
    }, 0)
  }, [closedPositions])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-lg font-bold text-slate-100">Position Tracker</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track your Polymarket bets and P&amp;L</p>
        </div>
        <button onClick={() => setShowAdd(a => !a)} className="btn-primary">
          {showAdd ? '✕ Cancel' : '+ Add Position'}
        </button>
      </div>

      {showAdd && (
        <AddPositionForm
          onAdd={pos => { dispatch({ type: 'ADD_POSITION', position: pos }); setShowAdd(false) }}
          onCancel={() => setShowAdd(false)}
        />
      )}

      {/* Portfolio summary */}
      {openPositions.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total Invested',   value: fmtUsd(portfolio.totalInvested), color: 'text-slate-200' },
            { label: 'Current Value',    value: fmtUsd(portfolio.totalValue),    color: 'text-primary' },
            { label: 'Unrealized P&L',   value: `${fmt(portfolio.pnl)} (${fmtPct(portfolio.pnlPct)})`, color: portfolio.pnl >= 0 ? 'text-value' : 'text-danger' },
            { label: 'Realized P&L',     value: fmt(realizedPnl), color: realizedPnl >= 0 ? 'text-value' : 'text-danger' },
          ].map(s => (
            <div key={s.label} className="card p-4">
              <div className="text-xs text-slate-500 mb-1">{s.label}</div>
              <div className={`text-base font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Open positions */}
      {openPositions.length === 0 && !showAdd ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">💰</div>
          <h2 className="text-lg font-bold text-slate-200 mb-2">No Positions Yet</h2>
          <p className="text-slate-500 text-sm">Add a position to start tracking your Polymarket bets</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {openPositions.map(p => (
            <PositionCard
              key={p.id}
              position={p}
              polymarket={polymarket}
              onClose={exitPrice => dispatch({ type: 'CLOSE_POSITION', id: p.id, exitPrice })}
              onDelete={() => dispatch({ type: 'DELETE_POSITION', id: p.id })}
            />
          ))}
        </div>
      )}

      {/* Closed positions */}
      {closedPositions.length > 0 && (
        <div>
          <button
            onClick={() => setShowClosed(s => !s)}
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 mb-4"
          >
            <span>{showClosed ? '▼' : '▶'}</span>
            Closed Positions ({closedPositions.length})
          </button>
          {showClosed && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {closedPositions.map(p => (
                <PositionCard
                  key={p.id}
                  position={p}
                  polymarket={polymarket}
                  onClose={() => {}}
                  onDelete={() => dispatch({ type: 'DELETE_POSITION', id: p.id })}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
