/**
 * Tiny WebAudio synth — every sound is generated, no audio files.
 * All calls are no-ops until the first user gesture unlocks the context.
 */

import type { Tier } from './engine'

let ctx: AudioContext | null = null
let muted = false

function ac(): AudioContext | null {
  if (muted || typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function setMuted(m: boolean) {
  muted = m
}

function noiseBuffer(c: AudioContext, seconds: number) {
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * seconds), c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  return buf
}

/** Whoosh + rising tone; bigger engines are longer, brighter and higher. */
export function playBoost(tier: Tier) {
  const c = ac()
  if (!c) return
  const t = c.currentTime
  const dur = 0.6 + tier * 0.25

  const src = c.createBufferSource()
  src.buffer = noiseBuffer(c, dur)
  const bp = c.createBiquadFilter()
  bp.type = 'bandpass'
  bp.Q.value = 0.9
  bp.frequency.setValueAtTime(300 + tier * 150, t)
  bp.frequency.exponentialRampToValueAtTime(2200 + tier * 1400, t + dur * 0.7)
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.35, t + 0.06)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(bp).connect(g).connect(c.destination)
  src.start(t)
  src.stop(t + dur)

  const osc = c.createOscillator()
  osc.type = tier >= 2 ? 'sawtooth' : 'triangle'
  osc.frequency.setValueAtTime(180 + tier * 60, t)
  osc.frequency.exponentialRampToValueAtTime(520 + tier * 320, t + dur * 0.8)
  const og = c.createGain()
  og.gain.setValueAtTime(0.0001, t)
  og.gain.exponentialRampToValueAtTime(0.08 + tier * 0.015, t + 0.05)
  og.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 2400 + tier * 800
  osc.connect(lp).connect(og).connect(c.destination)
  osc.start(t)
  osc.stop(t + dur)
}

/** Coughing engine: a few low, choppy pops, then a falling whistle. */
export function playSputter() {
  const c = ac()
  if (!c) return
  const t = c.currentTime
  for (let i = 0; i < 5; i++) {
    const at = t + i * 0.16 + Math.random() * 0.05
    const src = c.createBufferSource()
    src.buffer = noiseBuffer(c, 0.12)
    const lp = c.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 380 - i * 40
    const g = c.createGain()
    g.gain.setValueAtTime(0.5 - i * 0.07, at)
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.11)
    src.connect(lp).connect(g).connect(c.destination)
    src.start(at)
  }
  const osc = c.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(900, t + 0.7)
  osc.frequency.exponentialRampToValueAtTime(140, t + 2.2)
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t + 0.7)
  g.gain.exponentialRampToValueAtTime(0.07, t + 0.8)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 2.2)
  osc.connect(g).connect(c.destination)
  osc.start(t + 0.7)
  osc.stop(t + 2.3)
}

export function playMiss() {
  const c = ac()
  if (!c) return
  const t = c.currentTime
  const osc = c.createOscillator()
  osc.type = 'square'
  osc.frequency.setValueAtTime(160, t)
  osc.frequency.linearRampToValueAtTime(110, t + 0.18)
  const g = c.createGain()
  g.gain.setValueAtTime(0.06, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2)
  osc.connect(g).connect(c.destination)
  osc.start(t)
  osc.stop(t + 0.22)
}

export function playTick(urgent: boolean) {
  const c = ac()
  if (!c) return
  const t = c.currentTime
  const osc = c.createOscillator()
  osc.type = 'sine'
  osc.frequency.value = urgent ? 1320 : 880
  const g = c.createGain()
  g.gain.setValueAtTime(0.05, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06)
  osc.connect(g).connect(c.destination)
  osc.start(t)
  osc.stop(t + 0.07)
}

export function playChime() {
  const c = ac()
  if (!c) return
  const t = c.currentTime
  ;[523.25, 659.25, 783.99].forEach((f, i) => {
    const osc = c.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = f
    const g = c.createGain()
    const at = t + i * 0.09
    g.gain.setValueAtTime(0.0001, at)
    g.gain.exponentialRampToValueAtTime(0.08, at + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.5)
    osc.connect(g).connect(c.destination)
    osc.start(at)
    osc.stop(at + 0.55)
  })
}
