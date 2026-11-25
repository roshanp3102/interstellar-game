/**
 * Pure game rules for Interstellar — matching, engines, traps, sky stages.
 * No React here so it stays easy to unit test.
 */

import { PROMPTS, type Prompt } from './prompts'

export const ROUNDS = 7
export const ROUND_SECONDS = 25
export const GUESSES_PER_ROUND = 5

export type Tier = 0 | 1 | 2 | 3 | 4

export interface EngineInfo {
  tier: Tier
  name: string
  short: string
  km: number
  color: string
  glow: string
  blurb: string
}

export const ENGINES: EngineInfo[] = [
  { tier: 0, name: 'Jet Engine', short: 'JET', km: 2, color: '#ff9b3d', glow: '#ffd38a', blurb: 'Everyday answers. A steady climb through the low clouds.' },
  { tier: 1, name: 'Rocket Boost', short: 'ROCKET', km: 5, color: '#ff4d2e', glow: '#ffb347', blurb: 'A little less common. A sharp upward surge.' },
  { tier: 2, name: 'Plasma Thruster', short: 'PLASMA', km: 10, color: '#2fd6ff', glow: '#b8f3ff', blurb: 'Solid, uncommon picks. Electric-blue thrust.' },
  { tier: 3, name: 'Hyperdrive', short: 'HYPER', km: 20, color: '#b46bff', glow: '#e6ccff', blurb: 'Obscure deep cuts. Stars stretch into streaks.' },
  { tier: 4, name: 'FTL / Tachyon Drive', short: 'FTL', km: 40, color: '#ffffff', glow: '#ff7af5', blurb: 'One secret answer per round. Reality bends.' },
]

// ── Answer matching ────────────────────────────────────────────────────────

export function normalize(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['’`]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/^(the|a|an) /, '')
}

/** Compact key: no spaces, light plural folding. */
function keyOf(norm: string): string {
  let k = norm.replace(/ /g, '')
  if (k.length > 4 && k.endsWith('es') && !k.endsWith('ses')) k = k.slice(0, -2)
  else if (k.length > 3 && k.endsWith('s') && !k.endsWith('ss')) k = k.slice(0, -1)
  return k
}

function levenshtein(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]
    let rowMin = i
    for (let j = 1; j <= b.length; j++) {
      const v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
      cur.push(v)
      if (v < rowMin) rowMin = v
    }
    if (rowMin > max) return max + 1
    prev = cur
  }
  return prev[b.length]
}

export interface Answer {
  /** Stable id within the prompt (the display name). */
  id: string
  display: string
  tier: Tier
  keys: string[]
}

export interface CompiledPrompt {
  id: string
  category: string
  answers: Answer[]
}

export function compilePrompt(p: Prompt): CompiledPrompt {
  const answers: Answer[] = []
  p.tiers.forEach((list, tier) => {
    for (const entry of list) {
      const [display, ...aliases] = entry.split('/')
      const keys = Array.from(new Set([display, ...aliases].map((s) => keyOf(normalize(s))).filter(Boolean)))
      answers.push({ id: display, display, tier: tier as Tier, keys })
    }
  })
  return { id: p.id, category: p.category, answers }
}

/** Find the answer a guess refers to: exact key first, then a small typo allowance. */
export function matchAnswer(prompt: CompiledPrompt, guess: string): Answer | null {
  const k = keyOf(normalize(guess))
  if (!k) return null
  for (const a of prompt.answers) if (a.keys.includes(k)) return a
  if (k.length < 5) return null
  const allowance = k.length >= 10 ? 2 : 1
  let best: Answer | null = null
  let bestD = allowance + 1
  for (const a of prompt.answers) {
    for (const key of a.keys) {
      if (key.length < 5) continue
      const d = levenshtein(k, key, allowance)
      if (d < bestD) {
        bestD = d
        best = a
      }
    }
  }
  return best
}

// ── Traps ──────────────────────────────────────────────────────────────────

/** Odds of the trap hiding in each tier — obvious answers are the riskiest. The FTL answer is never a trap. */
const TRAP_TIER_ODDS = [0.46, 0.31, 0.15, 0.08]

export function pickTrap(prompt: CompiledPrompt, rand: () => number = Math.random): Answer {
  const byTier = [0, 1, 2, 3].map((t) => prompt.answers.filter((a) => a.tier === t))
  let r = rand()
  let tier = 0
  for (; tier < 3; tier++) {
    if (byTier[tier].length && r < TRAP_TIER_ODDS[tier]) break
    r -= TRAP_TIER_ODDS[tier]
  }
  while (!byTier[tier].length) tier = (tier + 1) % 4
  const pool = byTier[tier]
  return pool[Math.floor(rand() * pool.length)]
}

// ── Daily flight ───────────────────────────────────────────────────────────

/** The game day flips at midnight in this zone, so everyone shares one puzzle. */
export const DAY_ZONE = 'America/New_York'

const dayFormat = new Intl.DateTimeFormat('en-CA', { timeZone: DAY_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' })
const clockFormat = new Intl.DateTimeFormat('en-GB', { timeZone: DAY_ZONE, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' })

/** Today's game day as YYYY-MM-DD. */
export function dayKey(now: number = Date.now()): string {
  return dayFormat.format(now)
}

/** Seconds until the next game day (may be an hour off on a clock-change day). */
export function secondsToNextDay(now: number = Date.now()): number {
  const [h, m, s] = clockFormat.format(now).split(':').map(Number)
  return 86400 - (h * 3600 + m * 60 + s)
}

/** Small seeded generator: the same seed always gives the same sequence. */
export function seededRandom(seed: string): () => number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619)
  return () => {
    h = (h + 0x6d2b79f5) | 0
    let t = Math.imul(h ^ (h >>> 15), 1 | h)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(list: readonly T[], rand: () => number): T[] {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Keep one seeded rarest answer as the round's only FTL; the rest become Hyperdrive. */
export function withSingleFtl(prompt: CompiledPrompt, rand: () => number): CompiledPrompt {
  const rarest = prompt.answers.filter((a) => a.tier === 4)
  const ftl = rarest[Math.floor(rand() * rarest.length)]
  return {
    ...prompt,
    answers: prompt.answers.map((a) => (a.tier === 4 && a !== ftl ? { ...a, tier: 3 as Tier } : a)),
  }
}

const EPOCH = Date.UTC(2026, 0, 1)

/**
 * Categories for a day. The pool is dealt out in shuffled cycles so nothing
 * repeats inside a cycle, or on the days either side of a cycle boundary.
 */
function dailyCategories(day: string): Prompt[] {
  const n = Math.max(0, Math.round((Date.parse(`${day}T00:00:00Z`) - EPOCH) / 86400000))
  const daysPerCycle = Math.floor(PROMPTS.length / ROUNDS)
  const cycle = Math.floor(n / daysPerCycle)
  let dealt: Prompt[] = []
  for (let c = 0; c <= cycle; c++) {
    const yesterday = new Set(dealt.slice((daysPerCycle - 1) * ROUNDS))
    const mixed = shuffle(PROMPTS, seededRandom(`cycle:${c}`))
    const fresh = mixed.filter((p) => !yesterday.has(p))
    const rest = [...fresh.slice(ROUNDS), ...mixed.filter((p) => yesterday.has(p))]
    dealt = [...fresh.slice(0, ROUNDS), ...shuffle(rest, seededRandom(`rest:${c}`))].slice(0, daysPerCycle * ROUNDS)
  }
  const at = (n % daysPerCycle) * ROUNDS
  return dealt.slice(at, at + ROUNDS)
}

export interface DailyRound {
  prompt: CompiledPrompt
  trap: Answer
}

/** Everyone gets the same rounds, traps and FTL answers on the same day. */
export function dailyRounds(day: string): DailyRound[] {
  return dailyCategories(day).map((p) => {
    const rand = seededRandom(`${day}:${p.id}`)
    const prompt = withSingleFtl(compilePrompt(p), rand)
    return { prompt, trap: pickTrap(prompt, rand) }
  })
}

// ── Sky stages ─────────────────────────────────────────────────────────────

export interface Stage {
  name: string
  from: number
}

export const STAGES: Stage[] = [
  { name: 'Lower Clouds', from: 0 },
  { name: 'Stratosphere', from: 12 },
  { name: 'Edge of the Atmosphere', from: 50 },
  { name: 'Low Orbit', from: 100 },
  { name: 'Deep Space', from: 400 },
  { name: 'Interstellar', from: 600 },
]

export function stageFor(km: number): Stage {
  let s = STAGES[0]
  for (const st of STAGES) if (km >= st.from) s = st
  return s
}

export function formatKm(km: number): string {
  if (km >= 100) return `${Math.round(km).toLocaleString()} km`
  return `${km.toFixed(1)} km`
}
