/**
 * /play — the game. Full-screen sky with the HUD and round overlays on top.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Volume2, VolumeX } from 'lucide-react'
import { FlightScene } from '../../game/FlightScene'
import { Altimeter, EventBanner, GuessConsole, RoundPill, TimerRing, updateAltimeter } from '../../game/Hud'
import { Briefing, Debrief, Landed, TitleCard } from '../../game/Overlays'
import { useGame } from '../../game/useGame'
import { setMuted } from '../../game/sound'

export default function PlayPage() {
  const game = useGame()
  const { state } = game
  const readoutRef = useRef<HTMLSpanElement>(null)
  const stageRef = useRef<HTMLSpanElement>(null)
  const markerRef = useRef<HTMLDivElement>(null)
  const [muted, setMutedState] = useState(false)

  const onFrame = useCallback((km: number) => {
    updateAltimeter(km, { readout: readoutRef.current, stage: stageRef.current, marker: markerRef.current })
  }, [])

  // Dev-only test hook so automated play-tests can hit the trap on purpose.
  useEffect(() => {
    if (import.meta.env.DEV) (window as unknown as { __trap?: string }).__trap = state.trap?.display
  }, [state.trap])

  const prompt = state.rounds[state.round]?.prompt
  const inRound = state.phase === 'flying' || state.phase === 'debrief'

  return (
    <div className="game-root" data-testid="game">
      <title>Interstellar — cardboard trivia flight</title>
      <FlightScene targetAltitude={state.altitude} event={state.event} onFrame={onFrame} />

      {/* Top bar */}
      <div className="hud-top">
        <Link to="/" className="paper-card brand font-marker">Interstellar</Link>
        {prompt && state.phase !== 'title' && state.phase !== 'landed' ? (
          <div className="paper-card category-card">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs uppercase tracking-[0.25em] opacity-70">Round {state.round + 1}</span>
              <RoundPill round={state.round} />
            </div>
            <div className="font-marker text-xl leading-tight sm:text-2xl">{state.phase === 'briefing' ? 'Mystery category' : prompt.category}</div>
          </div>
        ) : (
          <div className="flex-1" />
        )}
        <div className="flex items-start gap-2">
          {prompt && state.phase !== 'title' && state.phase !== 'landed' && (
            <TimerRing timeLeft={game.timeLeft} active={state.phase === 'flying'} />
          )}
          <button
            className="paper-card icon-btn"
            aria-label={muted ? 'Unmute' : 'Mute'}
            onClick={() => {
              setMuted(!muted)
              setMutedState(!muted)
            }}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      <Altimeter readoutRef={readoutRef} stageRef={stageRef} markerRef={markerRef} />

      {inRound && <EventBanner event={state.event} trapName={state.trap?.display} />}

      {inRound && (
        <div className="hud-bottom">
          <GuessConsole state={state} onGuess={game.guess} onBank={game.bank} />
        </div>
      )}

      {state.phase === 'title' && <TitleCard onStart={game.start} />}
      {state.phase === 'briefing' && <Briefing state={state} onLaunch={game.launchRound} />}
      {state.phase === 'debrief' && <Debrief state={state} onNext={game.next} />}
      {state.phase === 'landed' && <Landed state={state} onAgain={game.start} />}
    </div>
  )
}
