import { useEffect, useRef, useState } from 'react'
import type { DrawPoint, LiveScore } from '../types/drawing'
import { ScoringWorkerClient } from '../engine/scoring/workerClient'

export function useScoringWorker() {
  const clientRef = useRef<ScoringWorkerClient | null>(null)
  const [liveScore, setLiveScore] = useState<LiveScore | null>(null)

  useEffect(() => {
    const client = new ScoringWorkerClient()
    client.onScore((response) => {
      setLiveScore(response.payload)
    })
    clientRef.current = client

    return () => {
      client.terminate()
      clientRef.current = null
    }
  }, [])

  const scorePoints = (points: DrawPoint[]) => {
    clientRef.current?.score(points)
  }

  return { liveScore, scorePoints }
}
