export class AudioEngine {
  private context: AudioContext | null = null
  private ambientOsc: OscillatorNode | null = null
  private ambientGain: GainNode | null = null

  async start(): Promise<void> {
    if (!this.context) {
      this.context = new AudioContext()
      this.ambientOsc = this.context.createOscillator()
      this.ambientGain = this.context.createGain()
      this.ambientOsc.type = 'triangle'
      this.ambientOsc.frequency.value = 60
      this.ambientGain.gain.value = 0.0001
      this.ambientOsc.connect(this.ambientGain)
      this.ambientGain.connect(this.context.destination)
      this.ambientOsc.start()
    }

    if (this.context.state === 'suspended') {
      await this.context.resume()
    }
  }

  setIntensity(score: number): void {
    if (!this.context || !this.ambientGain || !this.ambientOsc) return
    const now = this.context.currentTime
    const normalized = Math.max(0, Math.min(1, score / 100))
    const gain = 0.01 + normalized * 0.06
    const freq = 60 + normalized * 120

    this.ambientGain.gain.cancelScheduledValues(now)
    this.ambientGain.gain.linearRampToValueAtTime(gain, now + 0.14)
    this.ambientOsc.frequency.cancelScheduledValues(now)
    this.ambientOsc.frequency.linearRampToValueAtTime(freq, now + 0.16)
  }

  thresholdPulse(): void {
    if (!this.context) return

    const osc = this.context.createOscillator()
    const gain = this.context.createGain()
    osc.type = 'sine'
    osc.frequency.value = 420
    gain.gain.value = 0.0001
    osc.connect(gain)
    gain.connect(this.context.destination)

    const now = this.context.currentTime
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18)
    osc.start(now)
    osc.stop(now + 0.2)
  }
}
