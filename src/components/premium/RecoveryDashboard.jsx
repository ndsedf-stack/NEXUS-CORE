import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getRecoveryScore, getRecoveryColor, getRecoveryStatus } from '../../utils/appleHealth';
import '../../styles/premium/recovery-dashboard.css';

export default function RecoveryDashboard() {
  const [score, setScore] = useState(87);
  const [trend, setTrend] = useState('+5');
  
  useEffect(() => {
    getRecoveryScore().then(setScore);
  }, []);
  
  const status = getRecoveryStatus(score);
  const color = getRecoveryColor(score);
  const percentage = score;
  const circumference = 2 * Math.PI * 80;
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="recovery-dashboard">
      <h2 className="dashboard-title font-hud">RECOVERY SCORE</h2>
      
      <div className="recovery-circle-container">
        <svg viewBox="0 0 200 200" className="recovery-svg">
          <defs>
            <linearGradient id="recoveryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="rgba(34, 211, 238, 0.1)"
            strokeWidth="12"
          />
          
          <motion.circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="url(#recoveryGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '100px 100px',
              filter: 'url(#glow)'
            }}
          />
        </svg>
        
        <div className="recovery-content">
          <motion.div
            className="recovery-score"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            style={{ color }}
          >
            {score}
          </motion.div>
          <div className="recovery-label">%</div>
          <div className="recovery-trend" style={{ color }}>
            {trend} vs hier
          </div>
        </div>
      </div>
      
      <div className="recovery-status" style={{ borderColor: color, color }}>
        <div className="status-icon">
          {status === 'optimal' && '⚡'}
          {status === 'suboptimal' && '⚠️'}
          {status === 'critical' && '🚨'}
        </div>
        <div className="status-text">
          {status === 'optimal' && 'ÉTAT OPTIMAL'}
          {status === 'suboptimal' && 'SUBOPTIMAL'}
          {status === 'critical' && 'CRITIQUE'}
        </div>
      </div>
      
      <div className="recovery-metrics">
        <div className="metric-card">
          <div className="metric-icon">❤️</div>
          <div className="metric-label">HRV</div>
          <div className="metric-value">68ms</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">😴</div>
          <div className="metric-label">SOMMEIL</div>
          <div className="metric-value">7.2h</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">🔥</div>
          <div className="metric-label">STRESS</div>
          <div className="metric-value">Bas</div>
        </div>
      </div>
    </div>
  );
}
