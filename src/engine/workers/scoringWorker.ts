/// <reference lib="webworker" />

import { calculateLiveScore } from '../scoring/scoreCircle'
import type { WorkerRequest, WorkerResponse } from '../../types/drawing'

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  if (event.data.type !== 'score') return

  const payload = calculateLiveScore(event.data.points)
  const response: WorkerResponse = {
    type: 'score',
    payload,
  }

  self.postMessage(response)
}
