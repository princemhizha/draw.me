import { LeaderboardPanel } from './components/LeaderboardPanel'
import { ResultReveal } from './components/ResultReveal'
import { ChallengePage } from './pages/ChallengePage'
import { LandingPage } from './pages/LandingPage'
import { SettingsPage } from './pages/SettingsPage'
import { useGameStore } from './store/useGameStore'

function App() {
  const screen = useGameStore((s) => s.screen)
  const result = useGameStore((s) => s.result)
  const leaderboard = useGameStore((s) => s.leaderboard)
  const mode = useGameStore((s) => s.mode)
  const setScreen = useGameStore((s) => s.setScreen)
  const startAttempt = useGameStore((s) => s.startAttempt)

  if (screen === 'landing') return <LandingPage />
  if (screen === 'solo' || screen === 'timeAttack') return <ChallengePage mode={mode} />
  if (screen === 'leaderboard') return <LeaderboardPanel entries={leaderboard} onBack={() => setScreen('landing')} />
  if (screen === 'settings') return <SettingsPage />

  if (screen === 'result' && result) {
    return (
      <ResultReveal
        result={result}
        onReplay={() => startAttempt(result.mode)}
        onLeaderboard={() => setScreen('leaderboard')}
        onHome={() => setScreen('landing')}
      />
    )
  }

  return <LandingPage />
}

export default App
