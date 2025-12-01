/**
 * NEON FIT - Apple Health Integration
 * Récupère HRV + Sommeil pour calculer Recovery Score
 */

// Simulation pour développement (remplacer par vrai API en production)
export async function getRecoveryScore() {
  // Simule un score qui varie selon l'heure
  const hour = new Date().getHours();
  const baseScore = hour < 12 ? 90 : 75;
  const variation = Math.random() * 10 - 5;
  
  return Math.round(Math.max(60, Math.min(100, baseScore + variation)));
}

export function getRecoveryStatus(score) {
  if (score >= 85) return 'optimal';
  if (score >= 70) return 'suboptimal';
  return 'critical';
}

export function getRecoveryColor(score) {
  if (score >= 85) return '#22d3ee'; // cyan
  if (score >= 70) return '#fbbf24'; // amber
  return '#ef4444'; // red
}
