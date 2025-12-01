import { motion } from 'framer-motion';
import '../../styles/premium/ai-coach.css';

const MESSAGES = {
  optimal: [
    { icon: "⚡", text: "Systèmes au maximum. Prêt pour le combat." },
    { icon: "🎯", text: "État peak. C'est le moment de viser un PR." },
    { icon: "💪", text: "Recovery complète. Charge maximale autorisée." },
    { icon: "🔥", text: "Tous feux verts. Déploiement optimal confirmé." }
  ],
  suboptimal: [
    { icon: "⚠️", text: "Fatigue nerveuse détectée. Charge réduite." },
    { icon: "🛡️", text: "Recovery à {score}%. Programme adapté." },
    { icon: "🔋", text: "Batteries à {score}%. Tempo ralenti." }
  ],
  critical: [
    { icon: "🚨", text: "Niveau critique. Repos actif obligatoire." },
    { icon: "⛔", text: "Recovery insuffisante. Mission annulée." },
    { icon: "🏥", text: "Protocole récupération activé." }
  ]
};

export default function AICoachMessage({ recoveryScore = 87, muscle = null }) {
  const category = 
    recoveryScore >= 85 ? 'optimal' :
    recoveryScore >= 70 ? 'suboptimal' : 'critical';
  
  const messages = MESSAGES[category];
  const message = messages[Math.floor(Math.random() * messages.length)];
  const text = message.text.replace('{score}', `${recoveryScore}%`);
  
  const colorClass = 
    category === 'optimal' ? 'status-optimal' :
    category === 'suboptimal' ? 'status-warning' : 'status-critical';
  
  return (
    <motion.div 
      className={`ai-coach-banner ${colorClass}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="ai-icon">🧠</div>
      <div className="ai-content">
        <div className="ai-label">AI TACTICAL ADVISOR</div>
        <div className="ai-message">
          <span className="message-icon">{message.icon}</span>
          <span className="message-text">{text}</span>
        </div>
        {muscle && (
          <div className="ai-target">Target: {muscle.toUpperCase()}</div>
        )}
      </div>
      <motion.div 
        className="ai-pulse"
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}
