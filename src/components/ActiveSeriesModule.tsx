// components/ActiveSeriesModule.tsx - CINEMATIC UPGRADE
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';

interface ActiveSeriesModuleProps {
  exercise: {
    name: string;
    sets: number;
    reps: string;
    weight: number;
    rest: number;
    tempo?: string;
  };
  currentSeries: number;
  onValidate: (weight: number, reps: number, rpe: number) => void;
}

export const ActiveSeriesModule: React.FC<ActiveSeriesModuleProps> = ({
  exercise,
  currentSeries,
  onValidate,
}) => {
  const [weight, setWeight] = useState(exercise.weight);
  const [reps, setReps] = useState(10);
  const [rpe, setRpe] = useState(7);
  const [phase, setPhase] = useState<'work' | 'rest'>('work');
  const [restTime, setRestTime] = useState(exercise.rest);
  const [breathPhase, setBreathPhase] = useState<'inspire' | 'hold' | 'expire'>('inspire');
  
  const progress = (currentSeries / exercise.sets) * 100;
  
  // Rest timer
  useEffect(() => {
    if (phase === 'rest' && restTime > 0) {
      const timer = setInterval(() => {
        setRestTime(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    } else if (restTime === 0 && phase === 'rest') {
      setPhase('work');
      setRestTime(exercise.rest);
    }
  }, [phase, restTime, exercise.rest]);
  
  // Breathing cycle (4-4-4-4)
  useEffect(() => {
    if (phase === 'rest') {
      const breathTimer = setInterval(() => {
        setBreathPhase(prev => {
          if (prev === 'inspire') return 'hold';
          if (prev === 'hold') return 'expire';
          return 'inspire';
        });
      }, 4000);
      return () => clearInterval(breathTimer);
    }
  }, [phase]);
  
  const handleValidate = () => {
    onValidate(weight, reps, rpe);
    if (currentSeries < exercise.sets) {
      setPhase('rest');
    }
  };
  
  // WORK PHASE
  if (phase === 'work') {
    return (
      <div className="fixed inset-0 bg-void text-white overflow-hidden">
        {/* Scanlines effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(34, 211, 238, 0.1) 2px,
              rgba(34, 211, 238, 0.1) 3px
            )`,
          }}
          animate={{ y: [0, 100, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
        
        {/* HUD Corners */}
        <div className="absolute inset-0 pointer-events-none">
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => (
            <div
              key={pos}
              className={`
                absolute w-10 h-10
                border-2 border-cyan-400
                ${pos.includes('top') ? 'top-4' : 'bottom-4'}
                ${pos.includes('left') ? 'left-4' : 'right-4'}
                ${pos.includes('top') && pos.includes('left') && 'border-r-0 border-b-0'}
                ${pos.includes('top') && pos.includes('right') && 'border-l-0 border-b-0'}
                ${pos.includes('bottom') && pos.includes('left') && 'border-r-0 border-t-0'}
                ${pos.includes('bottom') && pos.includes('right') && 'border-l-0 border-t-0'}
              `}
              style={{
                boxShadow: '0 0 10px rgba(34, 211, 238, 0.5)',
              }}
            />
          ))}
        </div>
        
        {/* Top Status Bar */}
        <div className="relative z-10 pt-16 px-6">
          <motion.div
            className="flex items-center justify-between mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-xs text-gray-400 uppercase tracking-wider">
              Mission Active
            </div>
            <div className="text-xs text-cyan-400 uppercase tracking-wider">
              Série {currentSeries}/{exercise.sets}
            </div>
          </motion.div>
          
          {/* Progress bar */}
          <div className="w-full h-1 bg-cyan-500/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              style={{
                boxShadow: '0 0 10px rgba(34, 211, 238, 0.8)',
              }}
            />
          </div>
        </div>
        
        {/* Exercise Name with Glitch */}
        <motion.h1
          className="
            text-center text-3xl font-black uppercase tracking-widest
            mt-8 mb-12 px-6
          "
          animate={{
            textShadow: [
              '0 0 10px rgba(34, 211, 238, 0.8)',
              '2px 2px 10px rgba(34, 211, 238, 0.8), -2px -2px 10px rgba(167, 139, 250, 0.8)',
              '0 0 10px rgba(34, 211, 238, 0.8)',
            ],
          }}
          transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 5 }}
          style={{
            background: 'linear-gradient(135deg, #22d3ee, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {exercise.name}
        </motion.h1>
        
        {/* 3D Progress Ring */}
        <div className="flex justify-center mb-12">
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 200 200" className="transform -rotate-90">
              <defs>
                <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
              
              {/* Background ring */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="rgba(34, 211, 238, 0.1)"
                strokeWidth="12"
              />
              
              {/* Animated progress ring */}
              <motion.circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="url(#ringGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray="502"
                initial={{ strokeDashoffset: 502 }}
                animate={{ strokeDashoffset: 502 - (502 * progress / 100) }}
                filter="url(#glow)"
              />
            </svg>
            
            {/* Center series count */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                key={currentSeries}
                initial={{ scale: 0, rotateX: 90 }}
                animate={{ scale: 1, rotateX: 0 }}
                className="text-6xl font-black"
                style={{
                  background: 'linear-gradient(135deg, #22d3ee, #a78bfa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 40px rgba(34, 211, 238, 0.8)',
                }}
              >
                {currentSeries}
              </motion.div>
              <div className="text-gray-400 text-sm">/ {exercise.sets}</div>
            </div>
          </div>
        </div>
        
        {/* Holographic Data Panels */}
        <div className="px-6 mb-8">
          {/* Weight Control */}
          <motion.div
            className="mb-6"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-xs text-cyan-400 uppercase tracking-wider mb-2 text-center">
              Weight
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setWeight(w => Math.max(0, w - 5))}
                className="
                  w-20 h-20
                  bg-glass-dark backdrop-blur-xl
                  border-2 border-cyan-500/50
                  rounded-2xl
                  flex items-center justify-center
                  text-cyan-400
                  active:scale-95
                  transition-transform
                "
                style={{
                  boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)',
                }}
              >
                <Minus size={32} strokeWidth={3} />
              </button>
              
              <div className="
                px-8 py-4
                bg-gradient-to-br from-cyan-500/20 to-purple-500/20
                backdrop-blur-xl
                border-2 border-cyan-500/50
                rounded-2xl
                text-center
                min-w-[120px]
              "
              style={{
                boxShadow: '0 0 30px rgba(34, 211, 238, 0.4)',
              }}>
                <div className="text-4xl font-black">{weight}</div>
                <div className="text-xs text-cyan-400 uppercase">KG</div>
              </div>
              
              <button
                onClick={() => setWeight(w => w + 5)}
                className="
                  w-20 h-20
                  bg-glass-dark backdrop-blur-xl
                  border-2 border-cyan-500/50
                  rounded-2xl
                  flex items-center justify-center
                  text-cyan-400
                  active:scale-95
                  transition-transform
                "
                style={{
                  boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)',
                }}
              >
                <Plus size={32} strokeWidth={3} />
              </button>
            </div>
          </motion.div>
          
          {/* Reps Control */}
          <motion.div
            className="mb-6"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-xs text-purple-400 uppercase tracking-wider mb-2 text-center">
              Reps
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setReps(r => Math.max(1, r - 1))}
                className="
                  w-20 h-20
                  bg-glass-dark backdrop-blur-xl
                  border-2 border-purple-500/50
                  rounded-2xl
                  flex items-center justify-center
                  text-purple-400
                  active:scale-95
                  transition-transform
                "
                style={{
                  boxShadow: '0 0 20px rgba(167, 139, 250, 0.3)',
                }}
              >
                <Minus size={32} strokeWidth={3} />
              </button>
              
              <div className="
                px-8 py-4
                bg-gradient-to-br from-purple-500/20 to-pink-500/20
                backdrop-blur-xl
                border-2 border-purple-500/50
                rounded-2xl
                text-center
                min-w-[120px]
              "
              style={{
                boxShadow: '0 0 30px rgba(167, 139, 250, 0.4)',
              }}>
                <div className="text-4xl font-black">{reps}</div>
                <div className="text-xs text-purple-400 uppercase">REPS</div>
              </div>
              
              <button
                onClick={() => setReps(r => r + 1)}
                className="
                  w-20 h-20
                  bg-glass-dark backdrop-blur-xl
                  border-2 border-purple-500/50
                  rounded-2xl
                  flex items-center justify-center
                  text-purple-400
                  active:scale-95
                  transition-transform
                "
                style={{
                  boxShadow: '0 0 20px rgba(167, 139, 250, 0.3)',
                }}
              >
                <Plus size={32} strokeWidth={3} />
              </button>
            </div>
          </motion.div>
          
          {/* RPE Slider */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 text-center">
              RPE: {rpe}/10
            </div>
            <input
              type="range"
              min="6"
              max="10"
              value={rpe}
              onChange={(e) => setRpe(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-6
                [&::-webkit-slider-thumb]:h-6
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-gradient-to-br
                [&::-webkit-slider-thumb]:from-cyan-400
                [&::-webkit-slider-thumb]:to-purple-500
                [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(34,211,238,0.6)]
              "
            />
          </motion.div>
        </div>
        
        {/* Validate Button */}
        <motion.div
          className="px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={handleValidate}
            className="
              w-full h-20
              bg-gradient-to-r from-cyan-500 to-blue-600
              rounded-2xl
              text-xl font-black uppercase tracking-wider
              relative overflow-hidden
            "
            whileTap={{ scale: 0.98 }}
            style={{
              boxShadow: '0 0 40px rgba(34, 211, 238, 0.6)',
            }}
          >
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <span className="relative z-10">✓ SÉRIE VALIDÉE (RPE {rpe}/10)</span>
          </motion.button>
        </motion.div>
      </div>
    );
  }
  
  // REST PHASE
  return (
    <div className="fixed inset-0 bg-void/95 backdrop-blur-xl text-white flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center px-6"
      >
        <h2 className="text-2xl font-black uppercase tracking-wider mb-8 text-cyan-400">
          Repos
        </h2>
        
        {/* Circular Timer */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg viewBox="0 0 200 200" className="transform -rotate-90">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="rgba(34, 211, 238, 0.2)"
              strokeWidth="8"
            />
            <motion.circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="502"
              animate={{
                strokeDashoffset: 502 - (502 * (exercise.rest - restTime) / exercise.rest),
              }}
              style={{
                filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.8))',
              }}
            />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              key={restTime}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-6xl font-black"
            >
              {Math.floor(restTime / 60)}:{(restTime % 60).toString().padStart(2, '0')}
            </motion.div>
          </div>
        </div>
        
        {/* Breathing Guide */}
        <motion.div
          animate={{
            scale: breathPhase === 'inspire' ? 1.2 : breathPhase === 'expire' ? 0.8 : 1,
          }}
          transition={{ duration: 4, ease: 'easeInOut' }}
          className="mb-8"
        >
          <div className="text-xl font-bold uppercase tracking-wider">
            {breathPhase === 'inspire' && '↑ INSPIRE'}
            {breathPhase === 'hold' && '• MAINTIENS'}
            {breathPhase === 'expire' && '↓ EXPIRE'}
          </div>
        </motion.div>
        
        {restTime <= 10 && (
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-amber-400 text-lg font-bold"
          >
            ⚠️ 10 SECONDES
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ActiveSeriesModule;