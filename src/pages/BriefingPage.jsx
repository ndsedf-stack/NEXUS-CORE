import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HeroHeader from '../components/premium/HeroHeader';
import ExerciseTimeline from '../components/premium/ExerciseTimeline';
import AICoachMessage from '../components/premium/AICoachMessage';
import { getRecoveryScore } from '../utils/appleHealth';
import { adaptWorkout } from '../utils/adaptiveEngine';
import programData from '../program-data-v2.js';

export default function BriefingPage() {
  const { week, day } = useParams();
  const [recoveryScore, setRecoveryScore] = useState(87);
  const [workout, setWorkout] = useState(null);
  
  useEffect(() => {
    getRecoveryScore().then(score => {
      setRecoveryScore(score);
      
      // Charger workout depuis programData
      const weekData = programData.getWeek(parseInt(week));
      if (weekData && weekData[day]) {
        const workoutData = weekData[day];
        const adapted = adaptWorkout(workoutData, score);
        setWorkout(adapted);
      }
    });
  }, [week, day]);
  
  if (!workout) {
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }
  
  const stats = [
    { icon: "⚡", value: workout.technique || "FORCE" },
    { icon: "⏱️", value: workout.duration || "52 MIN" },
    { icon: "🎯", value: `RPE ${workout.rpeTarget || "7-8"}` }
  ];
  
  return (
    <div>
      <HeroHeader 
        title={`MISSION: ${day?.toUpperCase()}`}
        subtitle={workout.name || "DOS + JAMBES"}
        stats={stats}
      />
      
      <div style={{ padding: '0 1rem 2rem' }}>
        <AICoachMessage 
          recoveryScore={recoveryScore} 
          muscle={workout.muscle}
        />
        
        <ExerciseTimeline 
          exercises={workout.exercises}
          adapted={workout.adapted}
        />
        
        <button 
          className="glass-card"
          style={{
            width: '100%',
            padding: '1.5rem',
            marginTop: '2rem',
            background: 'linear-gradient(135deg, #22d3ee, #0ea5e9)',
            border: 'none',
            borderRadius: '16px',
            color: '#020408',
            fontSize: '1.2rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(34, 211, 238, 0.4)'
          }}
          onClick={() => window.location.href = `/session/${week}/${day}`}
        >
          🚀 LANCER LA MISSION
        </button>
      </div>
    </div>
  );
}
