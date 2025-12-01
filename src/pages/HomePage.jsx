import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AICoachMessage from '../components/premium/AICoachMessage';
import { getRecoveryScore } from '../utils/appleHealth';

export default function HomePage() {
  const [recoveryScore, setRecoveryScore] = useState(87);
  
  useEffect(() => {
    getRecoveryScore().then(setRecoveryScore);
  }, []);
  
  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 className="font-hud" style={{ fontSize: '3rem', color: '#22d3ee', marginBottom: '1rem', textAlign: 'center' }}>
        NEON FIT
      </h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
        ⚡ TACTICAL COMMAND CENTER
      </h2>
      
      <AICoachMessage recoveryScore={recoveryScore} muscle="Pectoraux" />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Link to="/briefing/1/dimanche" className="glass-card" style={{ padding: '1.5rem', textDecoration: 'none', color: 'white', display: 'block' }}>
          📋 BRIEFING
        </Link>
        <Link to="/session/1/dimanche" className="glass-card" style={{ padding: '1.5rem', textDecoration: 'none', color: 'white', display: 'block' }}>
          💪 SESSION
        </Link>
        <Link to="/stats" className="glass-card" style={{ padding: '1.5rem', textDecoration: 'none', color: 'white', display: 'block' }}>
          📊 STATS
        </Link>
      </div>
    </div>
  );
}
