// components/ExerciseDetailCard.tsx - CINEMATIC UPGRADE
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Zap, Target, Clock } from 'lucide-react';
import HeroHeader from './HeroHeader';
import HolographicButton from './HolographicButton';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  weight: number;
  rest: number;
  tempo?: string;
  notes?: string;
  adapted?: boolean;
  adaptationNote?: string;
}

interface ExerciseDetailCardProps {
  workout: {
    muscle: string;
    technique: string;
    duration: string;
    exercises: Exercise[];
  };
  recoveryScore?: number;
  onStart: () => void;
}

export const ExerciseDetailCard: React.FC<ExerciseDetailCardProps> = ({
  workout,
  recoveryScore = 87,
  onStart,
}) => {
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);
  
  const totalExercises = workout.exercises.length;
  const estimatedXP = totalExercises * 15;
  const rpeTarget = workout.technique === 'FORCE' ? '7-9' : '6-8';
  
  return (
    <div className="min-h-screen bg-void text-white pb-24">
      {/* Hero Header */}
      <HeroHeader
        title={`MISSION: ${workout.muscle.toUpperCase()}`}
        subtitle={workout.technique}
        stats={[
          { icon: '⚡', value: workout.technique, label: 'Technique' },
          { icon: '⏱️', value: workout.duration, label: 'Durée' },
          { icon: '🎯', value: `RPE ${rpeTarget}`, label: 'Intensité' },
          { icon: '💎', value: `${estimatedXP} XP`, label: 'Potentiel' },
        ]}
      />
      
      {/* Mission Intel Cards */}
      <div className="px-4 -mt-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            className="
              p-4
              bg-glass-dark backdrop-blur-xl
              border border-cyan-500/30
              rounded-2xl
            "
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-xs text-cyan-400 uppercase tracking-wider mb-1">
              Technique
            </div>
            <div className="text-lg font-bold">{workout.technique}</div>
          </motion.div>
          
          <motion.div
            className="
              p-4
              bg-glass-dark backdrop-blur-xl
              border border-purple-500/30
              rounded-2xl
            "
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-xs text-purple-400 uppercase tracking-wider mb-1">
              Intensité
            </div>
            <div className="text-lg font-bold">RPE {rpeTarget}</div>
          </motion.div>
        </div>
      </div>
      
      {/* Recovery Adaptation Warning (if adapted) */}
      {recoveryScore < 85 && (
        <motion.div
          className="mx-4 mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div className="flex-1">
              <div className="font-bold text-amber-400 mb-1">
                Programme Adapté
              </div>
              <div className="text-sm text-amber-200/80">
                Recovery à {recoveryScore}%. Charges et volume ajustés automatiquement.
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Timeline Section Title */}
      <div className="px-4 mb-4">
        <h2 className="text-2xl font-black uppercase tracking-wider flex items-center gap-2">
          <Zap className="text-cyan-400" size={24} />
          Plan de Mission
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          {totalExercises} exercices • Timeline tactique
        </p>
      </div>
      
      {/* Timeline */}
      <div className="relative px-4">
        {/* Vertical line */}
        <div
          className="absolute left-8 top-0 bottom-0 w-0.5"
          style={{
            background: 'linear-gradient(to bottom, transparent, #22d3ee 20%, #22d3ee 80%, transparent)',
            boxShadow: '0 0 10px rgba(34, 211, 238, 0.5)',
          }}
        />
        
        {/* Exercise cards */}
        <div className="space-y-4">
          {workout.exercises.map((exercise, index) => (
            <motion.div
              key={index}
              className="relative pl-12"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              {/* Timeline dot */}
              <motion.div
                className="
                  absolute left-6 top-6
                  w-4 h-4
                  rounded-full
                  bg-cyan-400
                  border-2 border-void
                "
                animate={{
                  boxShadow: [
                    '0 0 10px rgba(34, 211, 238, 0.5)',
                    '0 0 20px rgba(34, 211, 238, 0.8)',
                    '0 0 10px rgba(34, 211, 238, 0.5)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              />
              
              {/* Exercise card */}
              <motion.div
                className="
                  bg-glass-dark backdrop-blur-xl
                  border border-cyan-500/30
                  rounded-2xl
                  overflow-hidden
                "
                whileHover={{ scale: 1.02 }}
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedExercise(
                    expandedExercise === index ? null : index
                  )}
                >
                  {/* Exercise name */}
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-2">
                    {exercise.name}
                  </h3>
                  
                  {/* Exercise meta */}
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-cyan-400 font-medium">
                      {exercise.sets} × {exercise.reps}
                    </span>
                    <span className="text-purple-400 font-medium">
                      @ {exercise.weight}kg
                    </span>
                  </div>
                  
                  {/* Adaptation note (if exists) */}
                  {exercise.adapted && exercise.adaptationNote && (
                    <motion.div
                      className="mt-2 p-2 bg-amber-500/10 border-l-2 border-amber-400 rounded"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <div className="text-xs text-amber-300">
                        ⚡ {exercise.adaptationNote}
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Expand icon */}
                  <div className="flex justify-end mt-2">
                    {expandedExercise === index ? (
                      <ChevronUp className="text-cyan-400" size={20} />
                    ) : (
                      <ChevronDown className="text-gray-400" size={20} />
                    )}
                  </div>
                </div>
                
                {/* Expanded details */}
                <AnimatePresence>
                  {expandedExercise === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-cyan-500/30 overflow-hidden"
                    >
                      <div className="p-4 space-y-3 bg-void/50">
                        {/* Tempo */}
                        {exercise.tempo && (
                          <div>
                            <div className="text-xs text-gray-400 uppercase mb-1">
                              Tempo
                            </div>
                            <div className="flex gap-2">
                              {exercise.tempo.split('-').map((phase, i) => (
                                <div
                                  key={i}
                                  className="
                                    px-3 py-1
                                    bg-cyan-500/10
                                    border border-cyan-500/30
                                    rounded-lg
                                    text-sm font-mono
                                  "
                                >
                                  {phase}s
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Rest */}
                        <div>
                          <div className="text-xs text-gray-400 uppercase mb-1">
                            Repos
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-purple-400" />
                            <span className="text-sm font-medium">
                              {exercise.rest}s entre séries
                            </span>
                          </div>
                        </div>
                        
                        {/* Notes */}
                        {exercise.notes && (
                          <div>
                            <div className="text-xs text-gray-400 uppercase mb-1">
                              💡 Conseil
                            </div>
                            <p className="text-sm text-gray-300 italic">
                              {exercise.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Sticky CTA at bottom */}
      <motion.div
        className="
          fixed bottom-0 left-0 right-0
          p-4
          bg-gradient-to-t from-void via-void/95 to-transparent
          backdrop-blur-lg
          border-t border-cyan-500/20
        "
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 100 }}
      >
        <HolographicButton
          onClick={onStart}
          variant="primary"
          size="large"
          fullWidth
          icon="🚀"
        >
          Lancer la Mission
        </HolographicButton>
      </motion.div>
    </div>
  );
};

export default ExerciseDetailCard;