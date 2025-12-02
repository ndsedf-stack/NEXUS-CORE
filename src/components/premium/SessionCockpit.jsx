import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import '../../styles/premium/cockpit.css';

export default function SessionCockpit({ exercise, onComplete }) {
  const [weight, setWeight] = useState(exercise.weight);
  const [reps, setReps] = useState(
    typeof exercise.reps === 'string' 
      ? parseInt(exercise.reps.split('-')[0]) 
      : exercise.reps
  );
  const [rpe, setRpe] = useState(7);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [breathPhase, setBreathPhase] = useState('inspire');
  
  // Timer repos
  useEffect(() => {
    if (isResting && restTime > 0) {
      const timer = setInterval(() => {
        setRestTime(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isResting, restTime]);
  
  // Respiration guidée
  useEffect(() => {
    if (isResting) {
      const breathTimer = setInterval(() => {
        setBreathPhase(phase => {
          if (phase === 'inspire') return 'hold1';
          if (phase === 'hold1') return 'expire';
          if (phase === 'expire') return 'hold2';
          return 'inspire';
        });
      }, 4000);
      
      return () => clearInterval(breathTimer);
    }
  }, [isResting]);
  
  const handleValidate = () => {
    onComplete({ weight, reps, rpe });
    setIsResting(true);
    setRestTime(exercise.rest || 120);
  };
  
  const adjustWeight = (delta) => {
    setWeight(prev => Math.max(0, prev + delta));
  };
  
  const adjustReps = (delta) => {
    setReps(prev => Math.max(1, prev + delta));
  };
  
  if (isResting) {
    return <RestModule restTime={restTime} breathPhase={breathPhase} />;
  }
  
  const progress = ((exercise.currentSeries || 1) / exercise.sets) * 100;
  
  return (
    <div className="session-cockpit">
      {/* Scanlines */}
      <div className="cockpit-scanlines" />
      
      {/* Vignette */}
      <div className="cockpit-vignette" />
      
      {/* HUD Corners */}
      <div className="hud-corners">
        <div className="hud-corner top-left" />
        <div className="hud-corner top-right" />
        <div className="hud-corner bottom-left" />
        <div className="hud-corner bottom-right" />
      </div>
      
      {/* Header */}
      <motion.div 
        className="cockpit-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="exercise-name font-hud">{exercise.name}</h2>
        <div className="series-indicator">
          SÉRIE {exercise.currentSeries || 1}/{exercise.sets}
        </div>
      </motion.div>
      
      {/* Progress Bar */}
      <div className="progress-bar-container">
        <motion.div 
          className="progress-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
      
      {/* Main Controls */}
      <div className="cockpit-controls">
        {/* Weight Control */}
        <motion.div 
          className="control-module"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="module-label">CHARGE</div>
          <div className="value-display">
            <motion.span
              key={weight}
              initial={{ scale: 1.5, color: '#22d3ee' }}
              animate={{ scale: 1, color: '#fff' }}
              className="value-number"
            >
              {weight}
            </motion.span>
            <span className="value-unit">KG</span>
          </div>
          <div className="button-grid">
            <button className="btn-huge" onClick={() => adjustWeight(-5)}>
              <Minus size={24} />
              <span>5kg</span>
            </button>
            <button className="btn-huge" onClick={() => adjustWeight(-2.5)}>
              <Minus size={20} />
              <span>2.5</span>
            </button>
            <button className="btn-huge" onClick={() => adjustWeight(2.5)}>
              <Plus size={20} />
              <span>2.5</span>
            </button>
            <button className="btn-huge" onClick={() => adjustWeight(5)}>
              <Plus size={24} />
              <span>5kg</span>
            </button>
          </div>
        </motion.div>
        
        {/* Reps Control */}
        <motion.div 
          className="control-module"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="module-label">RÉPÉTITIONS</div>
          <div className="value-display">
            <motion.span
              key={reps}
              initial={{ scale: 1.5, color: '#a78bfa' }}
              animate={{ scale: 1, color: '#fff' }}
              className="value-number"
            >
              {reps}
            </motion.span>
            <span className="value-unit">REPS</span>
          </div>
          <div className="button-grid">
            <button className="btn-huge" onClick={() => adjustReps(-2)}>
              <Minus size={24} />
              <span>2</span>
            </button>
            <button className="btn-huge" onClick={() => adjustReps(-1)}>
              <Minus size={20} />
              <span>1</span>
            </button>
            <button className="btn-huge" onClick={() => adjustReps(1)}>
              <Plus size={20} />
              <span>1</span>
            </button>
            <button className="btn-huge" onClick={() => adjustReps(2)}>
              <Plus size={24} />
              <span>2</span>
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* RPE Slider */}
      <motion.div 
        className="rpe-module"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="rpe-label">INTENSITÉ PERÇUE (RPE)</div>
        <div className="rpe-value">{rpe}/10</div>
        <input
          type="range"
          min="6"
          max="10"
          value={rpe}
          onChange={(e) => setRpe(Number(e.target.value))}
          className="rpe-slider"
        />
        <div className="rpe-markers">
          <span>6</span>
          <span>7</span>
          <span>8</span>
          <span>9</span>
          <span>10</span>
        </div>
      </motion.div>
      
      {/* Validate Button */}
      <motion.button
        className="btn-validate"
        onClick={handleValidate}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span className="btn-validate-icon">✓</span>
        <span className="btn-validate-text">SÉRIE VALIDÉE</span>
        <span className="btn-validate-rpe">RPE {rpe}/10</span>
      </motion.button>
    </div>
  );
}

// Rest Module Component
function RestModule({ restTime, breathPhase }) {
  const minutes = Math.floor(restTime / 60);
  const seconds = restTime % 60;
  const totalSeconds = 120; // Default rest time
  const progress = ((totalSeconds - restTime) / totalSeconds) * 100;
  
  const breathText = {
    inspire: 'INSPIRE',
    hold1: 'MAINTIENS',
    expire: 'EXPIRE',
    hold2: 'MAINTIENS'
  };
  
  const breathScale = {
    inspire: 1.3,
    hold1: 1.3,
    expire: 0.7,
    hold2: 0.7
  };
  
  return (
    <motion.div 
      className="rest-module"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="rest-scanlines" />
      
      <h2 className="rest-title font-hud">RÉCUPÉRATION</h2>
      
      {/* Circular Timer */}
      <div className="circular-timer">
        <svg viewBox="0 0 200 200" className="timer-svg">
          <defs>
            <linearGradient id="timerGradient">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="rgba(34, 211, 238, 0.1)"
            strokeWidth="12"
          />
          
          <motion.circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="url(#timerGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="534"
            initial={{ strokeDashoffset: 534 }}
            animate={{ strokeDashoffset: 534 - (534 * progress / 100) }}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '100px 100px'
            }}
          />
        </svg>
        
        <div className="timer-text">
          <motion.div
            key={restTime}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="timer-value"
          >
            {minutes}:{seconds.toString().padStart(2, '0')}
          </motion.div>
        </div>
      </div>
      
      {/* Breathing Guide */}
      <motion.div 
        className="breath-guide"
        animate={{ 
          scale: breathScale[breathPhase]
        }}
        transition={{ duration: 4, ease: 'easeInOut' }}
      >
        <div className="breath-circle" />
        <div className="breath-text">{breathText[breathPhase]}</div>
      </motion.div>
      
      {restTime <= 10 && restTime > 0 && (
        <motion.div
          className="warning-flash"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          ⚠️ {restTime}s RESTANTES
        </motion.div>
      )}
    </motion.div>
  );
}
