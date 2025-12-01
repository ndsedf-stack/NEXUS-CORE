// components/AICoachMessage.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface AICoachMessageProps {
  recoveryScore: number;
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
  muscle?: string;
}

// Coach message library organized by recovery status and context
const COACH_MESSAGES = {
  optimal: {
    morning: [
      '⚡ Systèmes au maximum. Prêt pour le combat.',
      '☀️ Morning, Operator. État peak détecté.',
      '🎯 Recovery complète. C\'est le moment de viser un PR.',
      '💪 Batteries chargées à 100%. Full throttle autorisé.',
    ],
    afternoon: [
      '⚡ Afternoon fuel. État optimal maintenu.',
      '🔥 Pic de performance. Time to ignite.',
      '🎯 Systèmes prêts. Charge maximale autorisée.',
      '💥 État de combat optimal. Deploy mission.',
    ],
    evening: [
      '🌙 Evening protocol. Systèmes opérationnels.',
      '⚡ Last mission of the day. Full capacity.',
      '🎯 État stable. Prêt pour dernière séance.',
      '💪 Recovery excellente. Go for night ops.',
    ],
  },
  suboptimal: {
    morning: [
      '⚠️ Fatigue nerveuse détectée. Charge réduite de 10%.',
      '🛡️ Recovery à {score}%. On ajuste intelligemment.',
      '🔋 Batteries à {score}%. Tempo ralenti recommandé.',
      '⚠️ Système en cours de récupération. Programme adapté.',
    ],
    afternoon: [
      '⚠️ Fatigue détectée. Volume ajusté automatiquement.',
      '🛡️ État suboptimal. Tactical adjustment activé.',
      '🔋 Recovery partielle. On travaille smart, pas hard.',
      '⚠️ Niveau énergétique moyen. Adaptation en cours.',
    ],
    evening: [
      '⚠️ Fatigue en hausse. Charges allégées.',
      '🛡️ Recovery insuffisante. Mode conservation.',
      '🔋 Evening fatigue. Programme light activé.',
      '⚠️ État limite. Séance ajustée prudemment.',
    ],
  },
  fatigue: {
    morning: [
      '🚨 Niveau critique. Repos actif obligatoire.',
      '⛔ Recovery insuffisante. Mission annulée.',
      '🏥 Protocole récupération activé. Pas d\'entraînement.',
      '🚨 Systèmes en alerte. Tactical retreat recommandé.',
    ],
    afternoon: [
      '🚨 Fatigue excessive. Repos nécessaire.',
      '⛔ État critique. Abort mission.',
      '🏥 Recovery prioritaire. Pas de combat aujourd\'hui.',
      '🚨 Niveau danger. Rest day obligatoire.',
    ],
    evening: [
      '🚨 Épuisement détecté. Sleep protocol activé.',
      '⛔ Fatigue critique. Repos immédiat.',
      '🏥 Recovery urgente. Early sleep recommandé.',
      '🚨 Système overload. Recuperation nécessaire.',
    ],
  },
};

// Muscle-specific motivation (when recovery is optimal)
const MUSCLE_SPECIFIC = {
  pectoraux: '🎯 Target Lock: Pectoraux. Prêt à déployer la puissance.',
  dos: '🎯 Target Lock: Dos. Prépare-toi à tirer fort.',
  jambes: '🎯 Target Lock: Jambes. Foundation day. All systems go.',
  épaules: '🎯 Target Lock: Épaules. Delts precision strike ready.',
  bras: '🎯 Target Lock: Bras. Pump protocol initiated.',
};

/**
 * Determine time of day category
 */
function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

/**
 * Get recovery status category
 */
function getRecoveryStatus(score: number): 'optimal' | 'suboptimal' | 'fatigue' {
  if (score >= 85) return 'optimal';
  if (score >= 70) return 'suboptimal';
  return 'fatigue';
}

/**
 * Select random message from array
 */
function selectRandomMessage(messages: string[], recoveryScore: number): string {
  const index = Math.floor(Math.random() * messages.length);
  return messages[index].replace('{score}', recoveryScore.toString());
}

export const AICoachMessage: React.FC<AICoachMessageProps> = ({
  recoveryScore,
  timeOfDay,
  muscle,
}) => {
  const time = timeOfDay || getTimeOfDay();
  const status = getRecoveryStatus(recoveryScore);
  
  // Get main message
  const messages = COACH_MESSAGES[status][time];
  const mainMessage = selectRandomMessage(messages, recoveryScore);
  
  // Add muscle-specific message if optimal and muscle provided
  const muscleMessage = 
    status === 'optimal' && muscle 
      ? MUSCLE_SPECIFIC[muscle.toLowerCase() as keyof typeof MUSCLE_SPECIFIC]
      : null;
  
  // Determine color based on status
  const colorClasses = {
    optimal: 'from-cyan-500 to-blue-500',
    suboptimal: 'from-amber-500 to-orange-500',
    fatigue: 'from-red-500 to-rose-500',
  };
  
  const bgClasses = {
    optimal: 'bg-cyan-500/10',
    suboptimal: 'bg-amber-500/10',
    fatigue: 'bg-red-500/10',
  };
  
  const borderClasses = {
    optimal: 'border-cyan-500/30',
    suboptimal: 'border-amber-500/30',
    fatigue: 'border-red-500/30',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`
        relative overflow-hidden
        px-4 py-3 mb-4
        ${bgClasses[status]}
        backdrop-blur-lg
        border ${borderClasses[status]}
        rounded-2xl
      `}
    >
      {/* Animated gradient border glow */}
      <motion.div
        className={`
          absolute inset-0
          bg-gradient-to-r ${colorClasses[status]}
          opacity-20
        `}
        animate={{
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex items-start gap-3">
        {/* AI Icon with pulse */}
        <motion.div
          className={`
            flex-shrink-0
            w-10 h-10
            flex items-center justify-center
            rounded-full
            bg-gradient-to-br ${colorClasses[status]}
            text-white text-lg font-bold
          `}
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 0 10px rgba(34, 211, 238, 0.3)',
              '0 0 20px rgba(34, 211, 238, 0.5)',
              '0 0 10px rgba(34, 211, 238, 0.3)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          🧠
        </motion.div>
        
        {/* Message content */}
        <div className="flex-1 pt-1">
          <motion.p
            className="text-sm font-medium text-white/90 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {mainMessage}
          </motion.p>
          
          {muscleMessage && (
            <motion.p
              className="text-xs font-medium text-cyan-400 mt-1"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {muscleMessage}
            </motion.p>
          )}
        </div>
        
        {/* Recovery score badge */}
        <motion.div
          className={`
            flex-shrink-0
            px-2 py-1
            rounded-full
            bg-gradient-to-br ${colorClasses[status]}
            text-white text-xs font-bold
          `}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          {recoveryScore}%
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AICoachMessage;