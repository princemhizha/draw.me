export function scoreLabel(score: number): string {
  if (score >= 98) return 'Almost NASA-Level'
  if (score >= 95) return 'Orbit Master'
  if (score >= 90) return 'Geometry Wizard'
  if (score >= 80) return 'Precision Pilot'
  if (score >= 70) return 'Egg Specialist'
  if (score >= 60) return 'Banana Circle Champion'
  return 'Orbital Trainee'
}

export function precisionStatus(score: number): string {
  if (score >= 95) return 'Legendary'
  if (score >= 90) return 'Elite'
  if (score >= 80) return 'Strong'
  if (score >= 70) return 'Improving'
  return 'Unstable'
}

export function commentaryForScore(score: number): string {
  if (score >= 95) return 'That curve is keynote-level precision.'
  if (score >= 90) return 'Almost perfect. Keep that arc tension.'
  if (score >= 80) return 'Strong control. Maintain closure.'
  if (score >= 70) return 'Good momentum. Smooth your final quadrant.'
  return 'Start wider and keep pressure stable.'
}
