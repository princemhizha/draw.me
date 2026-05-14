import { useGameStore } from '../store/useGameStore'

export function SettingsPage() {
  const setScreen = useGameStore((s) => s.setScreen)

  return (
    <main className="min-h-screen bg-void px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl panel-glass p-8">
        <h1 className="font-display text-4xl">Settings</h1>
        <p className="mt-3 text-slate-300">Conference profile presets, SFX packs, and stage controls are scaffolded for future releases.</p>
        <button className="btn-secondary mt-6" onClick={() => setScreen('landing')}>Back</button>
      </div>
    </main>
  )
}
