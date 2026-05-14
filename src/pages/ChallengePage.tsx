import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useDrawingEngine } from '../hooks/useDrawingEngine'
import { useGameStore } from '../store/useGameStore'
import { HudPanels } from '../components/HudPanels'
import { AudioEngine } from '../engine/effects/audioEngine'
import type { AttemptResult, LiveScore } from '../types/drawing'

interface ChallengePageProps {
  mode: 'solo' | 'timeAttack'
}

const thresholds = [70, 80, 90, 95]

export function ChallengePage({ mode }: ChallengePageProps) {
  const live = useGameStore((s) => s.live)
  const thresholdHits = useGameStore((s) => s.thresholdHits)
  const hitThreshold = useGameStore((s) => s.hitThreshold)
  const completeAttempt = useGameStore((s) => s.completeAttempt)
  const setScreen = useGameStore((s) => s.setScreen)
  const markDrawing = useGameStore((s) => s.markDrawing)

  const [secondsLeft, setSecondsLeft] = useState(30)
  const audioRef = useRef<AudioEngine | null>(null)
  const startedTimerRef = useRef(false)

  const onFinish = useCallback(
    (result: AttemptResult) => {
      completeAttempt(result)
    },
    [completeAttempt],
  )

  const onLiveUpdate = useCallback((score: LiveScore, speed: number, commentary: string) => {
    useGameStore.getState().updateLive(score, speed, commentary)
    audioRef.current?.setIntensity(score.score)
  }, [])

  const { containerRef, canvasRef, isDrawing, liveScore, finishAttempt, clearCanvas, debugEventCount } = useDrawingEngine({
    mode,
    onLiveUpdate,
    onFinish,
  })

  useEffect(() => {
    markDrawing(isDrawing)
  }, [isDrawing, markDrawing])

  useEffect(() => {
    audioRef.current = new AudioEngine()
    return () => {
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!isDrawing || mode !== 'timeAttack' || startedTimerRef.current) return
    startedTimerRef.current = true

    const interval = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          clearInterval(interval)
          finishAttempt()
          return 0
        }
        return current - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [clearCanvas, finishAttempt, isDrawing, mode])

  useEffect(() => {
    if (!liveScore) return

    for (const t of thresholds) {
      if (liveScore.score >= t && !thresholdHits.includes(t)) {
        hitThreshold(t)
        audioRef.current?.thresholdPulse()
      }
    }
  }, [hitThreshold, liveScore, thresholdHits])

  const ringClass = useMemo(() => {
    const score = live.accuracy
    if (score >= 90) return 'ring-emerald-300/60'
    if (score >= 80) return 'ring-lime-300/50'
    if (score >= 70) return 'ring-amber-300/55'
    return 'ring-orange-300/40'
  }, [live.accuracy])

  return (
    <main className="min-h-screen bg-void p-3 text-white md:p-5">
      <div className="mx-auto grid min-h-[95vh] max-w-[1600px] grid-cols-1 gap-3 lg:grid-cols-[280px_1fr_320px]">
        <HudPanels
          live={live}
          mode={mode}
          secondsLeft={secondsLeft}
          leftClassName="order-none"
          rightClassName="order-none"
        />

        <section
          ref={containerRef}
          className={`order-first min-h-[62vh] relative overflow-hidden rounded-3xl border border-cyan-100/20 bg-slate-950/75 ring-1 lg:order-none lg:min-h-0 ${ringClass}`}
        >
          <motion.div
            className="pointer-events-none absolute left-4 top-4 rounded-full border border-cyan-200/20 px-3 py-1 text-xs uppercase tracking-[0.3em] text-cyan-200"
            animate={{ scale: live.accuracy >= 90 ? [1, 1.06, 1] : 1 }}
            transition={{ duration: 0.5 }}
          >
            Live Orbit Zone
          </motion.div>


          <canvas ref={canvasRef} className="h-full w-full touch-none" onPointerDown={() => void audioRef.current?.start()} />

          {/* Debug overlay: shows live point count and pointer event count */}
          <div style={{
            position: 'absolute',
            top: 12,
            right: 16,
            zIndex: 20,
            background: 'rgba(0,0,0,0.55)',
            color: '#fff',
            fontSize: 13,
            padding: '6px 12px',
            borderRadius: 8,
            pointerEvents: 'none',
            fontFamily: 'monospace',
          }}>
            pts: {liveScore?.sampleCount ?? 0} | events: {debugEventCount}
          </div>

          <div className="pointer-events-none absolute bottom-4 left-4 rounded-xl border border-cyan-200/15 bg-slate-900/40 px-3 py-2 text-xs text-slate-300">
            Input ready: mouse, touch, stylus, pen. Release to inspect, then tap Finalize Attempt.
          </div>
        </section>

        <div className="panel-glass flex flex-col gap-3 p-4">
          <button className="btn-secondary" onClick={() => setScreen('landing')}>Exit</button>
          <button className="btn-secondary" onClick={() => setScreen('leaderboard')}>Leaderboard</button>
          <button className="btn-primary" onClick={finishAttempt}>Finalize Attempt</button>
          <p className="mt-2 text-xs text-slate-400">Threshold hits: {thresholdHits.join(', ') || 'none yet'}</p>
        </div>
      </div>
    </main>
  )
}
