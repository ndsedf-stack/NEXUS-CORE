import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, TrendingUp, Award, Zap, Target, Clock } from 'lucide-react';
import '../styles/debrief.css';

export default function DebriefPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  // Mock data (à remplacer par vraies données)
  const sessionData = {
    workout: "DOS + JAMBES",
    duration: 52,
    totalVolume: 4200,
    totalSeries: 28,
    xpGained: 87,
    prs: [
      { exercise: "Trap Bar Deadlift", weight: 80, improvement: "+5kg" }
    ],
    topMuscle: { name: "DOS", percentage: 92 },
    recommendations: [
      {
        icon: "📈",
        title: "Augmenter la charge",
        message: "Trap Bar Deadlift: +2.5kg recommandé",
        reason: "RPE moyen à 7/10 sur 3 dernières séances"
      },
      {
        icon: "⏱️",
        title: "Ralentir le tempo",
        message: "Phase excentrique: 3-4s recommandé",
        reason: "Tension mécanique sous-optimale"
      },
      {
        icon: "🍗",
        title: "Fenêtre anabolique",
        message: "42g protéines < 2h recommandé",
        reason: "Volume total: 4.2T"
      }
    ]
  };
  
  return (
    <div className="debrief-page">
      {/* Success Banner */}
      <motion.div 
        className="debrief-banner"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="confetti-container">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="confetti"
              initial={{ 
                y: 0, 
                x: 0, 
                opacity: 1,
                rotate: 0 
              }}
              animate={{ 
                y: Math.random() * 200 - 100,
                x: Math.random() * 200 - 100,
                opacity: 0,
                rotate: Math.random() * 360
              }}
              transition={{ 
                duration: 1 + Math.random(),
                delay: Math.random() * 0.5 
              }}
              style={{
                position: 'absolute',
                width: '8px',
                height: '8px',
                background: ['#22d3ee', '#a78bfa', '#fbbf24', '#10b981'][i % 4],
                borderRadius: '2px'
              }}
            />
          ))}
        </div>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <CheckCircle size={64} color="#10b981" strokeWidth={3} />
        </motion.div>
        
        <h1 className="debrief-title font-hud">MISSION ACCOMPLIE</h1>
        <p className="debrief-subtitle">{sessionData.workout}</p>
      </motion.div>
      
      {/* Stats Summary */}
      <div className="debrief-content">
        <motion.section 
          className="summary-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="section-title font-hud">RÉSUMÉ MISSION</h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <Clock size={24} className="stat-icon" />
              <div className="stat-value">{sessionData.duration}</div>
              <div className="stat-label">Minutes</div>
            </div>
            
            <div className="stat-card">
              <Zap size={24} className="stat-icon" />
              <div className="stat-value">{(sessionData.totalVolume / 1000).toFixed(1)}T</div>
              <div className="stat-label">Volume</div>
            </div>
            
            <div className="stat-card">
              <Target size={24} className="stat-icon" />
              <div className="stat-value">{sessionData.totalSeries}</div>
              <div className="stat-label">Séries</div>
            </div>
            
            <div className="stat-card highlight">
              <Award size={24} className="stat-icon" />
              <div className="stat-value">+{sessionData.xpGained}</div>
              <div className="stat-label">XP Gagné</div>
            </div>
          </div>
        </motion.section>
        
        {/* Highlights */}
        {sessionData.prs.length > 0 && (
          <motion.section
            className="highlights-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="section-title font-hud">🏆 HIGHLIGHTS</h2>
            
            <div className="highlight-cards">
              {sessionData.prs.map((pr, i) => (
                <motion.div
                  key={i}
                  className="highlight-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <div className="highlight-badge">🔥 PR</div>
                  <div className="highlight-exercise">{pr.exercise}</div>
                  <div className="highlight-improvement">{pr.improvement}</div>
                </motion.div>
              ))}
              
              <motion.div
                className="highlight-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="highlight-badge">💪 TOP</div>
                <div className="highlight-exercise">Muscle dominant</div>
                <div className="highlight-improvement">
                  {sessionData.topMuscle.name} ({sessionData.topMuscle.percentage}%)
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}
        
        {/* Recommendations */}
        <motion.section
          className="recommendations-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="section-title font-hud">🧠 RECOMMANDATIONS IA</h2>
          
          <div className="recommendations-list">
            {sessionData.recommendations.map((rec, i) => (
              <motion.div
                key={i}
                className="recommendation-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
              >
                <div className="rec-icon">{rec.icon}</div>
                <div className="rec-content">
                  <div className="rec-title">{rec.title}</div>
                  <div className="rec-message">{rec.message}</div>
                  <div className="rec-reason">{rec.reason}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
        
        {/* Actions */}
        <motion.div 
          className="debrief-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <button
            className="btn-secondary"
            onClick={() => navigate('/stats')}
          >
            📊 Voir Stats Complètes
          </button>
          
          <button
            className="btn-primary"
            onClick={() => navigate('/')}
          >
            ✓ Terminer
          </button>
        </motion.div>
      </div>
    </div>
  );
}
