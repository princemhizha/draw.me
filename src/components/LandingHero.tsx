import { motion } from 'framer-motion'

interface LandingHeroProps {
  onStartSolo: () => void
  onStartTimeAttack: () => void
  onLeaderboard: () => void
  onSettings: () => void
}

const particles = new Array(18).fill(0)

export function LandingHero({ onStartSolo, onStartTimeAttack, onLeaderboard, onSettings }: LandingHeroProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-void text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(25,143,131,0.35),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(15,88,122,0.25),transparent_40%)]" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(24,51,66,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(24,51,66,0.35) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      {particles.map((_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute h-1 w-1 rounded-full bg-emerald-300"
          style={{ left: `${(i * 13) % 100}%`, top: `${(i * 17) % 100}%` }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.85, 0.2] }}
          transition={{ duration: 4 + (i % 5), repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-sm uppercase tracking-[0.4em] text-emerald-200/85"
        >
          CircleSync · Conference Precision Challenge
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08 }}
          className="mt-6 max-w-4xl font-display text-5xl leading-[1.04] text-white sm:text-7xl"
        >
          One Circle. One Room. One Collective Reaction.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.16 }}
          className="mt-7 max-w-2xl text-base text-slate-300 sm:text-lg"
        >
          Draw the most mathematically perfect orbit possible and watch live scoring, cinematic feedback,
          and audience hype converge in real time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="mt-12 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <button onClick={onStartSolo} className="btn-primary">Start Challenge</button>
          <button onClick={onStartTimeAttack} className="btn-secondary">Time Attack</button>
          <button onClick={onLeaderboard} className="btn-secondary">Leaderboard</button>
          <button onClick={onSettings} className="btn-secondary">Settings</button>
        </motion.div>
      </section>
    </main>
  )
}
