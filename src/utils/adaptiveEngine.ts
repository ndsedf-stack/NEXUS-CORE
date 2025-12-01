// utils/adaptiveEngine.ts
// Intelligent Workout Adaptation Based on Recovery Score

interface Exercise {
  name: string;
  weight: number;
  sets: number;
  reps: string;
  tempo?: string;
  rest?: number;
  technique?: string;
}

interface Workout {
  day: string;
  muscle: string;
  technique: string;
  duration: string;
  exercises: Exercise[];
}

interface AdaptedWorkout extends Workout {
  adapted: boolean;
  adaptationReason?: string;
  originalVolume?: number;
  adaptedVolume?: number;
  exercises: AdaptedExercise[];
}

interface AdaptedExercise extends Exercise {
  originalWeight?: number;
  adapted: boolean;
  adaptationNote?: string;
}

/**
 * Main function to adapt workout based on recovery score
 */
export function adaptWorkout(
  workout: Workout,
  recoveryScore: number
): AdaptedWorkout {
  // No adaptation needed if recovery is optimal
  if (recoveryScore >= 85) {
    return {
      ...workout,
      adapted: false,
      exercises: workout.exercises.map(ex => ({
        ...ex,
        adapted: false
      }))
    };
  }
  
  // Calculate adaptation factor
  const adaptationFactor = calculateAdaptationFactor(recoveryScore);
  
  // Adapt each exercise
  const adaptedExercises = workout.exercises.map(exercise => 
    adaptExercise(exercise, adaptationFactor, recoveryScore)
  );
  
  // Calculate volume change
  const originalVolume = calculateVolume(workout.exercises);
  const adaptedVolume = calculateVolume(adaptedExercises);
  
  return {
    ...workout,
    exercises: adaptedExercises,
    adapted: true,
    adaptationReason: getAdaptationReason(recoveryScore),
    originalVolume,
    adaptedVolume
  };
}

/**
 * Calculate adaptation factor based on recovery score
 */
function calculateAdaptationFactor(recoveryScore: number): number {
  if (recoveryScore >= 85) return 1.0;      // No reduction
  if (recoveryScore >= 80) return 0.95;     // -5%
  if (recoveryScore >= 75) return 0.90;     // -10%
  if (recoveryScore >= 70) return 0.85;     // -15%
  if (recoveryScore >= 65) return 0.80;     // -20%
  if (recoveryScore >= 60) return 0.75;     // -25%
  return 0.70;                               // -30% max
}

/**
 * Adapt individual exercise
 */
function adaptExercise(
  exercise: Exercise,
  adaptationFactor: number,
  recoveryScore: number
): AdaptedExercise {
  const originalWeight = exercise.weight;
  
  // Calculate new weight (rounded to nearest 2.5kg)
  const newWeight = Math.round((originalWeight * adaptationFactor) / 2.5) * 2.5;
  
  // Reduce sets if recovery is very low
  let newSets = exercise.sets;
  if (recoveryScore < 65) {
    newSets = Math.max(exercise.sets - 1, 2);
  }
  
  // Build adaptation note
  const weightDiff = originalWeight - newWeight;
  const setsDiff = exercise.sets - newSets;
  
  let adaptationNote = '';
  if (weightDiff > 0) {
    adaptationNote = `Charge: ${originalWeight}kg → ${newWeight}kg (-${weightDiff}kg)`;
  }
  if (setsDiff > 0) {
    adaptationNote += adaptationNote ? ` • ` : '';
    adaptationNote += `Séries: ${exercise.sets} → ${newSets}`;
  }
  
  return {
    ...exercise,
    weight: newWeight,
    sets: newSets,
    originalWeight,
    adapted: weightDiff > 0 || setsDiff > 0,
    adaptationNote: adaptationNote || undefined
  };
}

/**
 * Calculate total workout volume (kg lifted)
 */
function calculateVolume(exercises: Exercise[]): number {
  return exercises.reduce((total, ex) => {
    // Parse reps (e.g., "8-12" -> 10 average)
    const avgReps = parseReps(ex.reps);
    return total + (ex.weight * ex.sets * avgReps);
  }, 0);
}

/**
 * Parse reps string to average number
 */
function parseReps(reps: string): number {
  if (reps.includes('-')) {
    const [min, max] = reps.split('-').map(Number);
    return (min + max) / 2;
  }
  return Number(reps) || 10;
}

/**
 * Get human-readable adaptation reason
 */
function getAdaptationReason(recoveryScore: number): string {
  if (recoveryScore >= 80) {
    return 'Légère fatigue détectée';
  } else if (recoveryScore >= 75) {
    return 'Fatigue modérée - Réduction volume 10%';
  } else if (recoveryScore >= 70) {
    return 'Fatigue significative - Réduction volume 15%';
  } else if (recoveryScore >= 65) {
    return 'Recovery insuffisante - Réduction volume 20%';
  } else {
    return 'Fatigue critique - Réduction volume 25-30%';
  }
}

/**
 * Get recommended action based on recovery
 */
export function getRecoveryRecommendation(recoveryScore: number): {
  action: 'train' | 'adjust' | 'rest';
  message: string;
  emoji: string;
} {
  if (recoveryScore >= 85) {
    return {
      action: 'train',
      message: 'État optimal. Prêt pour le combat.',
      emoji: '⚡'
    };
  } else if (recoveryScore >= 70) {
    return {
      action: 'adjust',
      message: 'Recovery moyenne. Programme ajusté intelligemment.',
      emoji: '⚠️'
    };
  } else {
    return {
      action: 'rest',
      message: 'Fatigue critique. Repos actif recommandé.',
      emoji: '🛡️'
    };
  }
}

/**
 * Format volume for display
 */
export function formatVolume(volume: number): string {
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}T`;
  }
  return `${Math.round(volume)}kg`;
}

/**
 * Calculate volume difference percentage
 */
export function calculateVolumeChange(
  original: number,
  adapted: number
): number {
  return Math.round(((adapted - original) / original) * 100);
}

/**
 * Suggest tempo adjustment based on recovery
 */
export function suggestTempoAdjustment(
  tempo: string,
  recoveryScore: number
): { adjusted: boolean; newTempo: string; reason?: string } {
  if (recoveryScore >= 80) {
    return { adjusted: false, newTempo: tempo };
  }
  
  // Parse tempo (e.g., "3-0-1-0")
  const parts = tempo.split('-').map(Number);
  if (parts.length !== 4) {
    return { adjusted: false, newTempo: tempo };
  }
  
  const [ecc, iso1, con, iso2] = parts;
  
  // Slow down eccentric for better technique under fatigue
  if (recoveryScore < 80 && ecc < 4) {
    return {
      adjusted: true,
      newTempo: `4-${iso1}-${con}-${iso2}`,
      reason: 'Tempo ralenti (fatigue nerveuse)'
    };
  }
  
  return { adjusted: false, newTempo: tempo };
}

/**
 * Suggest rest period adjustment
 */
export function suggestRestAdjustment(
  currentRest: number,
  recoveryScore: number
): { adjusted: boolean; newRest: number; reason?: string } {
  if (recoveryScore >= 85) {
    return { adjusted: false, newRest: currentRest };
  }
  
  // Add 30s rest if recovery is low
  if (recoveryScore < 75) {
    return {
      adjusted: true,
      newRest: currentRest + 30,
      reason: 'Repos augmenté (+30s)'
    };
  }
  
  return { adjusted: false, newRest: currentRest };
}