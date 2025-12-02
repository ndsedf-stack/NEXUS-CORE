import RecoveryDashboard from '../components/premium/RecoveryDashboard';
import { motion } from 'framer-motion';

export default function StatsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#020408', paddingBottom: '6rem' }}>
      {/* Header */}
      <motion.div
        style={{
          padding: '2rem 1rem 1rem',
          textAlign: 'center',
          borderBottom: '1px solid rgba(34, 211, 238, 0.2)'
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-hud" style={{
          fontSize: '2rem',
          color: '#22d3ee',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          textShadow: '0 0 30px rgba(34, 211, 238, 0.6)'
        }}>
          ANALYTICS
        </h1>
      </motion.div>
      
      {/* Recovery Dashboard */}
      <RecoveryDashboard />
      
      {/* Quick Stats */}
      <div style={{ padding: '0 1rem 2rem' }}>
        <h3 className="font-hud" style={{
          fontSize: '1.2rem',
          color: '#a78bfa',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '1rem'
        }}>
          CETTE SEMAINE
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem'
        }}>
          <motion.div
            className="glass-card"
            style={{ padding: '1.5rem', textAlign: 'center' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏋️</div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#22d3ee', fontFamily: 'Chakra Petch' }}>3</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Sessions</div>
          </motion.div>
          
          <motion.div
            className="glass-card"
            style={{ padding: '1.5rem', textAlign: 'center' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚡</div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#a78bfa', fontFamily: 'Chakra Petch' }}>12.5</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Tonnes</div>
          </motion.div>
          
          <motion.div
            className="glass-card"
            style={{ padding: '1.5rem', textAlign: 'center' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔥</div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#fbbf24', fontFamily: 'Chakra Petch' }}>142</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Séries</div>
          </motion.div>
          
          <motion.div
            className="glass-card"
            style={{ padding: '1.5rem', textAlign: 'center' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⏱️</div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#10b981', fontFamily: 'Chakra Petch' }}>4.2</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Heures</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
