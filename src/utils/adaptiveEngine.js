/**
 * NEON FIT - Adaptive Workout Engine
 * Ajuste automatiquement les charges selon Recovery Score
 */

export function adaptWorkout(workout, recoveryScore) {
  if (recoveryScore >= 85) {
    return {
      ...workout,
      adapted: false,
      adaptationNote: null
    };
  }
  
  const reductionFactor = recoveryScore / 100;
  
  const adaptedExercises = workout.exercises.map(exercise => {
    const originalWeight = exercise.weight;
    const adaptedWeight = Math.round(originalWeight * reductionFactor * 2) / 2;
    
    return {
      ...exercise,
      weight: adaptedWeight,
      originalWeight: originalWeight,
      adapted: true
    };
  });
  
  if (recoveryScore < 70) {
    adaptedExercises.forEach(ex => {
      ex.sets = Math.max(2, ex.sets - 1);
    });
  }
  
  return {
    ...workout,
    exercises: adaptedExercises,
    adapted: true,
    adaptationNote: `Programme adapté (Recovery ${recoveryScore}%)`,
    weightReduction: Math.round((1 - reductionFactor) * 100)
  };
}

export function getAdaptationMessage(recoveryScore) {
  if (recoveryScore >= 85) {
    return "⚡ État optimal. Programme standard maintenu.";
  }
  
  if (recoveryScore >= 70) {
    const reduction = Math.round((1 - recoveryScore/100) * 100);
    return `⚠️ Charge réduite de ${reduction}% selon recovery.`;
  }
  
  return `🚨 Recovery critique. Programme allégé (-30%, -1 série).`;
}
