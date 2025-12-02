import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SessionCockpit from '../components/premium/SessionCockpit';
import programData from '../program-data-v2.js';

export default function SessionPage() {
  const { week, day } = useParams();
  const [workout, setWorkout] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSeries, setCurrentSeries] = useState(1);
  const [sessionData, setSessionData] = useState([]);
  
  useEffect(() => {
    // Charger workout
    const weekData = programData.getWeek(parseInt(week));
    if (weekData && weekData[day]) {
      setWorkout(weekData[day]);
    }
  }, [week, day]);
  
  const handleSerieComplete = (data) => {
    // Sauvegarder les données de la série
    setSessionData(prev => [...prev, {
      exercise: workout.exercises[currentExerciseIndex].name,
      series: currentSeries,
      ...data,
      timestamp: new Date().toISOString()
    }]);
    
    // Passer à la série suivante ou exercice suivant
    if (currentSeries < workout.exercises[currentExerciseIndex].sets) {
      setCurrentSeries(prev => prev + 1);
    } else {
      // Exercice suivant
      if (currentExerciseIndex < workout.exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSeries(1);
      } else {
        // Session terminée
        window.location.href = `/debrief/${Date.now()}`;
      }
    }
  };
  
  if (!workout) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Loading workout...</h2>
      </div>
    );
  }
  
  const currentExercise = {
    ...workout.exercises[currentExerciseIndex],
    currentSeries: currentSeries
  };
  
  return (
    <SessionCockpit 
      exercise={currentExercise}
      onComplete={handleSerieComplete}
    />
  );
}
