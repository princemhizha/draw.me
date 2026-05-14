import type { DrawPoint, WorkerResponse } from '../../types/drawing'

export class ScoringWorkerClient {
  private worker: Worker

  constructor() {
    this.worker = new Worker(new URL('../workers/scoringWorker.ts', import.meta.url), {
      type: 'module',
    })
  }

  onScore(handler: (response: WorkerResponse) => void): void {
    this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      handler(event.data)
    }
  }

  score(points: DrawPoint[]): void {
    this.worker.postMessage({ type: 'score', points })
  }

  terminate(): void {
    this.worker.terminate()
  }
}
