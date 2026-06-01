import { useState, useEffect, useCallback, useRef } from 'react'
import { FALLBACK_MARKETS, FALLBACK_ODDS, GROUP_WINNER_MARKETS, TOP_SCORER_MARKETS } from '../data/fallbackOdds.js'
import { TEAM_BY_ID } from '../data/teams.js'

const REFRESH_INTERVAL = 60_000
const GAMMA_API = 'https://gamma-api.polymarket.com'

function parsePrice(market) {
  // Gamma API returns outcomePrices as a JSON string: "[\"0.18\",\"0.82\"]"
  // OR as an actual array, OR uses a top-level `price` field
  try {
    let raw = market.outcomePrices
    if (typeof raw === 'string') raw = JSON.parse(raw)
    if (Array.isArray(raw) && raw.length > 0) {
      const p = parseFloat(raw[0])
      if (!isNaN(p) && p > 0 && p <= 1) return p * 100   // decimal → cents
      if (!isNaN(p) && p > 1 && p <= 100) return p        // already cents
    }
  } catch {}
  // fallback to top-level price field
  const p = parseFloat(market.price ?? market.lastTradePrice ?? 0)
  if (!isNaN(p) && p > 0 && p <= 1)   return p * 100
  if (!isNaN(p) && p > 1 && p <= 100) return p
  return null
}

function detectMarketType(question) {
  const q = (question || '').toLowerCase()
  if (q.includes('top scorer') || q.includes('golden boot')) return 'Top Scorer'
  if (q.includes('group') && q.includes('win'))               return 'Group Winner'
  if (q.includes('reach') && q.includes('final'))             return 'Reaches Final'
  if (q.includes('reach') && q.includes('semi'))              return 'Reaches Semi-Final'
  if (q.includes('reach') && q.includes('quarter'))           return 'Reaches Quarter-Final'
  return 'Tournament Winner'
}

function buildPolymarketUrl(market) {
  return `https://polymarket.com/event/world-cup-winner`
}

function parseMarketToCard(market) {
  const q = (market.question || '').toLowerCase()
  const teamId = Object.keys(TEAM_BY_ID).find(id => {
    const name = TEAM_BY_ID[id].name.toLowerCase()
    return q.includes(name)
  })
  if (!teamId) return null

  const price = parsePrice(market)
  if (price === null || isNaN(price) || price <= 0 || price > 100) return null

  const rounded = Math.round(price * 100) / 100
  return {
    id:         market.id || market.conditionId,
    teamId,
    _teamId:    teamId,
    question:   market.question,
    marketType: detectMarketType(market.question),
    price:      rounded,
    category:   rounded < 5 ? 'Dark Horse' : rounded < 15 ? 'Contender' : 'Favourite',
    url:        buildPolymarketUrl({ ...market, _teamId: teamId }),
    updatedAt:  market.updatedAt || new Date().toISOString(),
  }
}

export function usePolymarket() {
  const [markets, setMarkets]     = useState([])
  const [isLive, setIsLive]       = useState(false)
  const [isFallback, setIsFallback] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL / 1000)
  const [loading, setLoading]     = useState(true)
  const timerRef    = useRef(null)
  const countdownRef = useRef(null)

  const loadFallback = useCallback(() => {
    const cards = [
      ...FALLBACK_MARKETS,
      ...GROUP_WINNER_MARKETS,
      ...TOP_SCORER_MARKETS,
    ].map(m => ({ ...m, updatedAt: new Date().toISOString() }))
    setMarkets(cards)
    setIsLive(false)
    setIsFallback(true)
    setLastUpdated(new Date())
    setLoading(false)
  }, [])

  const fetchMarkets = useCallback(async () => {
    try {
      const res = await fetch(
        `${GAMMA_API}/markets?tag_slug=fifa-world-cup-2026&active=true&limit=100`,
        { signal: AbortSignal.timeout(8000) }
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const raw = Array.isArray(data) ? data : data.markets || []
      const cards = raw.map(parseMarketToCard).filter(Boolean)

      if (cards.length < 5) {
        // broader fallback search
        const res2 = await fetch(
          `${GAMMA_API}/markets?search=world+cup+2026&active=true&limit=200`,
          { signal: AbortSignal.timeout(8000) }
        )
        if (res2.ok) {
          const data2 = await res2.json()
          const more = (Array.isArray(data2) ? data2 : data2.markets || [])
            .map(parseMarketToCard)
            .filter(m => m && !cards.find(c => c.id === m.id))
          cards.push(...more)
        }
      }

      if (cards.length >= 3) {
        // Merge live Tournament Winner odds with our hardcoded Group/Scorer markets
        const merged = [
          ...cards,
          ...GROUP_WINNER_MARKETS.map(m => ({ ...m, updatedAt: new Date().toISOString() })),
          ...TOP_SCORER_MARKETS.map(m =>  ({ ...m, updatedAt: new Date().toISOString() })),
        ]
        setMarkets(merged)
        setIsLive(true)
        setIsFallback(false)
        setLastUpdated(new Date())
        setLoading(false)
        return
      }
      throw new Error('Insufficient valid market data')
    } catch {
      loadFallback()
    }
  }, [loadFallback])

  const startCountdown = useCallback(() => {
    setCountdown(REFRESH_INTERVAL / 1000)
    if (countdownRef.current) clearInterval(countdownRef.current)
    countdownRef.current = setInterval(() => {
      setCountdown(c => (c <= 1 ? REFRESH_INTERVAL / 1000 : c - 1))
    }, 1000)
  }, [])

  useEffect(() => {
    fetchMarkets()
    startCountdown()
    timerRef.current = setInterval(() => {
      fetchMarkets()
      startCountdown()
    }, REFRESH_INTERVAL)
    return () => {
      clearInterval(timerRef.current)
      clearInterval(countdownRef.current)
    }
  }, [fetchMarkets, startCountdown])

  // Tournament winner price only
  const getTournamentPrice = useCallback((teamId) => {
    const m = markets.find(m => m.teamId === teamId && m.marketType === 'Tournament Winner')
    if (m) return m.price
    return FALLBACK_ODDS.tournamentWinner[teamId] ?? 0.5
  }, [markets])

  // Group winner price only
  const getGroupWinnerPrice = useCallback((teamId) => {
    const m = markets.find(m => m.teamId === teamId && m.marketType === 'Group Winner')
    return m ? m.price : null
  }, [markets])

  // Group winner market URL
  const getGroupWinnerUrl = useCallback((teamId) => {
    const m = markets.find(m => m.teamId === teamId && m.marketType === 'Group Winner')
    return m?.url || 'https://polymarket.com/event/world-cup-winner'
  }, [markets])

  // Legacy — used by position tracker (tournament winner)
  const getPriceForTeam = useCallback((teamId) => {
    return getTournamentPrice(teamId)
  }, [getTournamentPrice])

  return { markets, isLive, isFallback, lastUpdated, countdown, loading, getPriceForTeam, getTournamentPrice, getGroupWinnerPrice, getGroupWinnerUrl, refetch: fetchMarkets }
}
