import { LandingHero } from '../components/LandingHero'
import { useGameStore } from '../store/useGameStore'

export function LandingPage() {
  const startAttempt = useGameStore((s) => s.startAttempt)
  const setScreen = useGameStore((s) => s.setScreen)

  return (
    <LandingHero
      onStartSolo={() => startAttempt('solo')}
      onStartTimeAttack={() => startAttempt('timeAttack')}
      onLeaderboard={() => setScreen('leaderboard')}
      onSettings={() => setScreen('settings')}
    />
  )
}
