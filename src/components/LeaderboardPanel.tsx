import type { LeaderboardEntry } from '../types/game'

interface LeaderboardPanelProps {
  entries: LeaderboardEntry[]
  onBack: () => void
}

export function LeaderboardPanel({ entries, onBack }: LeaderboardPanelProps) {
  return (
    <main className="min-h-screen bg-void px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl panel-glass p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-4xl">Leaderboard</h1>
          <button onClick={onBack} className="btn-secondary px-4 py-2 text-sm">Back</button>
        </div>

        <div className="mt-6 space-y-2">
          {entries.map((entry, i) => (
            <div key={entry.id} className="grid grid-cols-[64px_1fr_120px_120px] items-center rounded-xl border border-cyan-200/10 bg-slate-900/35 px-3 py-3 text-sm">
              <span className="font-mono text-cyan-200">#{i + 1}</span>
              <span>{entry.name}</span>
              <span className="font-mono text-slate-300">{entry.mode}</span>
              <span className="font-display text-emerald-300">{entry.score}%</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
