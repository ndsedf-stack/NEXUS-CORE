// components/HolographicButton.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface HolographicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: string;
}

const VARIANT_STYLES = {
  primary: {
    gradient: 'from-cyan-500 to-blue-600',
    glow: 'rgba(34, 211, 238, 0.6)',
    border: 'border-cyan-500',
  },
  secondary: {
    gradient: 'from-purple-500 to-pink-600',
    glow: 'rgba(167, 139, 250, 0.6)',
    border: 'border-purple-500',
  },
  danger: {
    gradient: 'from-red-500 to-rose-600',
    glow: 'rgba(239, 68, 68, 0.6)',
    border: 'border-red-500',
  },
};

const SIZE_STYLES = {
  small: 'px-4 py-2 text-sm',
  medium: 'px-6 py-3 text-base',
  large: 'px-8 py-4 text-lg',
};

export const HolographicButton: React.FC<HolographicButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  icon,
}) => {
  const styles = VARIANT_STYLES[variant];
  
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden
        ${SIZE_STYLES[size]}
        ${fullWidth ? 'w-full' : ''}
        font-bold uppercase tracking-wider
        rounded-2xl
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {/* Base gradient background */}
      <div
        className={`
          absolute inset-0
          bg-gradient-to-r ${styles.gradient}
        `}
      />
      
      {/* Animated glow overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: `radial-gradient(circle at 50% 50%, ${styles.glow}, transparent 70%)`,
        }}
      />
      
      {/* Border glow */}
      <motion.div
        className={`absolute inset-0 border-2 ${styles.border} rounded-2xl`}
        animate={{
          boxShadow: [
            `0 0 10px ${styles.glow}`,
            `0 0 30px ${styles.glow}`,
            `0 0 10px ${styles.glow}`,
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Particles */}
      {!disabled && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: [0, Math.cos((i * Math.PI) / 4) * 40],
                y: [0, Math.sin((i * Math.PI) / 4) * 40],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}
      
      {/* Scanline effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.03) 2px,
            rgba(255, 255, 255, 0.03) 4px
          )`,
        }}
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2 text-white drop-shadow-lg">
        {icon && <span className="text-xl">{icon}</span>}
        {children}
      </span>
    </motion.button>
  );
};

export default HolographicButton;