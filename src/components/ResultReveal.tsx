import { motion } from 'framer-motion'
import type { AttemptResult } from '../types/drawing'

interface ResultRevealProps {
  result: AttemptResult
  onReplay: () => void
  onLeaderboard: () => void
  onHome: () => void
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-cyan-200/15 bg-slate-900/45 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-300">{label}</p>
      <p className="mt-2 font-display text-2xl text-white">{value}%</p>
    </div>
  )
}

export function ResultReveal({ result, onReplay, onLeaderboard, onHome }: ResultRevealProps) {
  const metrics = result.metrics

  return (
    <main className="min-h-screen bg-void px-6 py-8 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel-glass p-8 text-center"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200">Final Score</p>
          <motion.h1
            className="mt-3 font-display text-7xl text-emerald-300"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 130, damping: 20, delay: 0.1 }}
          >
            {result.score}%
          </motion.h1>
          <p className="mt-2 font-mono text-sm text-slate-200">{result.label}</p>
          <p className="mt-1 text-sm text-slate-300">{result.commentary}</p>
          <p className="mt-3 text-xs text-slate-400">Completion Time: {(result.durationMs / 1000).toFixed(2)}s</p>
        </motion.section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <MetricCard label="Radius Consistency" value={Math.round(metrics.radiusConsistency * 100)} />
          <MetricCard label="Regression Accuracy" value={Math.round(metrics.regressionAccuracy * 100)} />
          <MetricCard label="Closure Precision" value={Math.round(metrics.closurePrecision * 100)} />
          <MetricCard label="Smoothness" value={Math.round(metrics.smoothness * 100)} />
          <MetricCard label="Velocity Stability" value={Math.round(metrics.velocityStability * 100)} />
          <MetricCard label="Angular Continuity" value={Math.round(metrics.angularContinuity * 100)} />
        </section>

        <section className="panel-glass p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Deviation Heatmap (MVP Preview)</p>
          <div className="mt-4 rounded-2xl border border-cyan-200/15 bg-gradient-to-r from-cyan-400/15 via-emerald-400/25 to-amber-400/20 p-4 text-sm text-slate-200">
            Worker metrics are live and production-ready. Full path replay and detailed heatmap overlays are scaffolded for next iteration.
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button className="btn-primary" onClick={onReplay}>Replay</button>
          <button className="btn-secondary" onClick={onLeaderboard}>Leaderboard</button>
          <button className="btn-secondary" onClick={onHome}>Home</button>
        </section>
      </div>
    </main>
  )
}
