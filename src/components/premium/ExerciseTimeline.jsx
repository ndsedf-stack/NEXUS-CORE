import { motion } from 'framer-motion';
import '../../styles/premium/timeline.css';

export default function ExerciseTimeline({ exercises, adapted = false }) {
  return (
    <div className="timeline-container">
      <div className="timeline-line" />
      
      {exercises.map((exercise, index) => (
        <motion.div
          key={index}
          className="timeline-item"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
        >
          <div className="timeline-dot">
            <div className="dot-inner" />
          </div>
          
          <div className="exercise-card glass-card">
            <div className="exercise-header">
              <div className="exercise-number">{String(index + 1).padStart(2, '0')}</div>
              <h3 className="exercise-name font-hud">{exercise.name}</h3>
            </div>
            
            <div className="exercise-metrics">
              <div className="metric">
                <span className="metric-label">SÉRIES</span>
                <span className="metric-value">{exercise.sets}</span>
              </div>
              <div className="metric">
                <span className="metric-label">REPS</span>
                <span className="metric-value">{exercise.reps}</span>
              </div>
              <div className="metric">
                <span className="metric-label">CHARGE</span>
                <span className="metric-value">
                  {exercise.weight}kg
                  {exercise.originalWeight && (
                    <span className="original-weight">({exercise.originalWeight}kg)</span>
                  )}
                </span>
              </div>
            </div>
            
            {exercise.adapted && (
              <motion.div 
                className="adaptation-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                ⚡ Adapté selon recovery
              </motion.div>
            )}
            
            <div className="exercise-details">
              <div className="detail">
                <span className="detail-icon">⏱️</span>
                <span>Tempo: {exercise.tempo}</span>
              </div>
              <div className="detail">
                <span className="detail-icon">💤</span>
                <span>Repos: {exercise.rest}s</span>
              </div>
              {exercise.rpe && (
                <div className="detail">
                  <span className="detail-icon">🎯</span>
                  <span>RPE: {exercise.rpe}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
      
      {/* End marker */}
      <motion.div
        className="timeline-end"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: exercises.length * 0.1 + 0.2 }}
      >
        <div className="end-icon">✓</div>
        <div className="end-text">MISSION COMPLETE</div>
      </motion.div>
    </div>
  );
}
