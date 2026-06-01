import React, { useState, useEffect, useRef } from 'react'
import { useScenario } from '../../context/ScenarioContext.jsx'

export default function ScenarioSidebar({ open, onClose }) {
  const { state, dispatch, activeScenario } = useScenario()
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [newName, setNewName] = useState('')
  const sidebarRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, onClose])

  const startEdit = (s) => {
    setEditingId(s.id)
    setEditName(s.name)
  }

  const saveEdit = () => {
    if (editName.trim()) {
      dispatch({ type: 'RENAME_SCENARIO', id: editingId, name: editName.trim() })
    }
    setEditingId(null)
  }

  const createNew = () => {
    const name = newName.trim() || `Scenario ${state.scenarios.length + 1}`
    dispatch({ type: 'CREATE_SCENARIO', name })
    setNewName('')
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div
        ref={sidebarRef}
        className="fixed top-0 right-0 z-50 h-full w-80 bg-navy-800 border-l border-navy-500 flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-navy-500">
          <div>
            <h2 className="text-primary font-bold text-sm">SCENARIOS</h2>
            <p className="text-slate-500 text-xs mt-0.5">Bracket & position sets</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg leading-none">✕</button>
        </div>

        {/* Scenario list */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-2">
          {state.scenarios.map(s => (
            <div
              key={s.id}
              className={`
                card p-3 cursor-pointer transition-all group
                ${s.id === activeScenario.id ? 'border-primary/60 bg-primary/5' : 'hover:border-navy-400'}
              `}
              onClick={() => { dispatch({ type: 'SET_ACTIVE', id: s.id }); onClose() }}
            >
              {editingId === s.id ? (
                <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                  <input
                    autoFocus
                    className="input flex-1 text-xs py-1"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditingId(null) }}
                  />
                  <button onClick={saveEdit} className="text-value text-xs px-2">✓</button>
                  <button onClick={() => setEditingId(null)} className="text-slate-400 text-xs px-1">✕</button>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {s.id === activeScenario.id && (
                        <span className="text-primary text-xs">▶</span>
                      )}
                      <span className="text-sm text-slate-200 font-medium truncate">{s.name}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {s.positions?.filter(p => !p.closed).length || 0} open positions
                      {s.bracketGenerated && ' · bracket set'}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={e => { e.stopPropagation(); startEdit(s) }}
                      className="text-slate-400 hover:text-primary text-xs p-1"
                      title="Rename"
                    >✏️</button>
                    <button
                      onClick={e => { e.stopPropagation(); dispatch({ type: 'DUPLICATE_SCENARIO', id: s.id }) }}
                      className="text-slate-400 hover:text-primary text-xs p-1"
                      title="Duplicate"
                    >⎘</button>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        if (state.scenarios.length > 1 && confirm(`Delete "${s.name}"?`)) {
                          dispatch({ type: 'DELETE_SCENARIO', id: s.id })
                        }
                      }}
                      className="text-slate-400 hover:text-danger text-xs p-1"
                      title="Delete"
                    >🗑</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Create new */}
        <div className="p-3 border-t border-navy-500">
          <div className="flex gap-2">
            <input
              className="input flex-1 text-xs"
              placeholder="New scenario name..."
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') createNew() }}
            />
            <button onClick={createNew} className="btn-primary text-xs px-3">+</button>
          </div>
        </div>
      </div>
    </>
  )
}
