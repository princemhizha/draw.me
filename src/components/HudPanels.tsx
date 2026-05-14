import { motion } from 'framer-motion'
import type { LiveHudState } from '../types/game'

interface HudPanelsProps {
  live: LiveHudState
  mode: 'solo' | 'timeAttack'
  secondsLeft?: number
  leftClassName?: string
  rightClassName?: string
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-300/90">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-700/50">
        <motion.div
          className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-emerald-300 to-emerald-200"
          animate={{ width: `${value}%` }}
          transition={{ type: 'spring', stiffness: 180, damping: 28 }}
        />
      </div>
    </div>
  )
}

export function HudPanels({ live, mode, secondsLeft, leftClassName = '', rightClassName = '' }: HudPanelsProps) {
  return (
    <>
      <aside className={`panel-glass flex h-full flex-col gap-5 p-4 md:p-5 ${leftClassName}`}>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/85">Live Accuracy</p>
          <p className="font-display text-5xl text-white">{live.accuracy}%</p>
        </div>
        <Meter label="Stability" value={live.stability} />
        <Meter label="Smoothness" value={live.smoothness} />
      </aside>

      <aside className={`panel-glass flex h-full flex-col gap-5 p-4 md:p-5 ${rightClassName}`}>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/85">Mode</p>
          <p className="font-mono text-sm text-slate-100">{mode === 'solo' ? 'Solo Challenge' : 'Time Attack'}</p>
          {mode === 'timeAttack' && typeof secondsLeft === 'number' && (
            <p className="font-mono text-xs text-amber-300">{secondsLeft}s remaining</p>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/85">Speed</p>
          <p className="font-display text-3xl text-white">{live.speed}</p>
          <p className="text-xs text-slate-400">px/s</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/85">Precision Status</p>
          <p className="font-mono text-sm text-emerald-300">{live.precisionStatus}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/85">AI Commentary</p>
          <p className="text-sm text-slate-200">{live.commentary}</p>
        </div>
      </aside>
    </>
  )
}
