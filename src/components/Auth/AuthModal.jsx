import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AuthModal({ onClose }) {
  const { signIn, signUp } = useAuth()
  const [mode, setMode]       = useState('login') // 'login' | 'signup'
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (mode === 'login') {
      const { error } = await signIn(email, password)
      if (error) setError(error.message)
      else onClose()
    } else {
      const { error } = await signUp(email, password)
      if (error) setError(error.message)
      else setSuccess('Account created! Check your email to confirm, then log in.')
    }
    setLoading(false)
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="card w-full max-w-md p-8 relative" onClick={e => e.stopPropagation()}>
          {/* Close */}
          <button onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-white text-lg">✕</button>

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-2">⚽</div>
            <h2 className="font-impact text-2xl text-primary tracking-widest">WC2026 EDGE</h2>
            <p className="text-slate-500 text-xs mt-1 font-light">
              {mode === 'login' ? 'Sign in to sync your bracket across devices' : 'Create an account to save your bracket'}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex rounded-xl overflow-hidden border border-white/10 mb-6">
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }}
                className={`flex-1 py-2.5 text-sm font-semibold transition-all ${
                  mode === m ? 'bg-primary text-navy-900' : 'text-slate-400 hover:text-slate-200'
                }`}>
                {m === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 block mb-1.5">Email</label>
              <input
                type="email" required
                className="input w-full"
                placeholder="you@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1.5">Password</label>
              <input
                type="password" required
                className="input w-full"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-danger text-xs bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            {success && (
              <div className="text-value text-xs bg-value/10 border border-value/20 rounded-lg px-3 py-2">
                {success}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 text-sm mt-2 disabled:opacity-50">
              {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-6">
            Your data is private and only visible to you.
          </p>
        </div>
      </div>
    </>
  )
}
