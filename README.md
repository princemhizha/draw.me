# CircleSync

CircleSync is a premium real-time precision challenge where participants draw a circle and receive live geometric scoring with cinematic feedback.

## Stack

- React + TypeScript + Vite
- TailwindCSS
- Framer Motion
- Zustand
- HTML5 Canvas API
- Web Worker scoring pipeline

## Implemented MVP

- Landing experience with animated hero and action modes
- Solo Challenge mode
- Time Attack mode (30-second pressure timer)
- Pointer Events drawing engine (mouse, touch, pen)
- Canvas rendering loop with low-latency updates
- Worker-based geometric scoring in real time
- Dynamic HUD: accuracy, stability, smoothness, speed, commentary
- Threshold events (70/80/90/95) with audio pulses
- Result reveal screen with metric breakdown and labels
- Leaderboard scaffold
- Settings scaffold
- Mobile-first responsive layout

## Scoring Dimensions

- Radius consistency
- Circle regression accuracy (best-fit circle)
- Closure precision
- Smoothness
- Velocity stability
- Wobble control
- Angular continuity

## Project Structure

- src/components
- src/engine/scoring
- src/engine/geometry
- src/engine/rendering
- src/engine/effects
- src/engine/workers
- src/hooks
- src/store
- src/pages
- src/styles
- src/utils
- src/types

## Scripts

- `npm run dev` starts local development server
- `npm run build` builds production assets
- `npm run preview` previews production build
- `npm run lint` runs ESLint

## Notes

- Full multiplayer room logic, QR join, live overlays, and backend integrations are scaffold-ready but not implemented in this MVP.
- Heatmap and replay visualization are marked as next-step enhancements.
