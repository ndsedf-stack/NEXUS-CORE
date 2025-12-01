// components/HeroHeader.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface HeroHeaderProps {
  title: string;
  subtitle?: string;
  stats?: Array<{
    icon: string;
    value: string;
    label?: string;
  }>;
  imageUrl?: string;
  height?: 'small' | 'medium' | 'large';
}

const HEIGHT_CLASSES = {
  small: 'h-[30vh]',
  medium: 'h-[40vh]',
  large: 'h-[50vh]',
};

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  title,
  subtitle,
  stats,
  imageUrl = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop',
  height = 'medium',
}) => {
  return (
    <div className={`relative ${HEIGHT_CLASSES[height]} overflow-hidden`}>
      {/* Background Image */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${imageUrl})`,
            filter: 'blur(2px)',
          }}
        />
      </motion.div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-void/30 via-void/80 to-void" />
      
      {/* Scanlines effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(34, 211, 238, 0.03) 2px,
            rgba(34, 211, 238, 0.03) 4px
          )`,
        }}
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 pb-8">
        {/* Title with glitch effect */}
        <motion.h1
          className="text-5xl md:text-6xl font-black uppercase tracking-wider mb-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            background: 'linear-gradient(135deg, #22d3ee, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 40px rgba(34, 211, 238, 0.4)',
          }}
        >
          {title}
        </motion.h1>
        
        {/* Subtitle */}
        {subtitle && (
          <motion.p
            className="text-cyan-300 text-lg font-medium mb-4 tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {subtitle}
          </motion.p>
        )}
        
        {/* Stats Row */}
        {stats && stats.length > 0 && (
          <motion.div
            className="flex gap-4 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="
                  px-4 py-2
                  bg-glass-dark
                  backdrop-blur-lg
                  border border-cyan-500/30
                  rounded-full
                  flex items-center gap-2
                "
                whileHover={{ scale: 1.05 }}
                animate={{
                  boxShadow: [
                    '0 0 10px rgba(34, 211, 238, 0.2)',
                    '0 0 20px rgba(34, 211, 238, 0.4)',
                    '0 0 10px rgba(34, 211, 238, 0.2)',
                  ],
                }}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3,
                  },
                }}
              >
                <span className="text-xl">{stat.icon}</span>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm">
                    {stat.value}
                  </span>
                  {stat.label && (
                    <span className="text-cyan-400 text-xs uppercase tracking-wider">
                      {stat.label}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      
      {/* Bottom fade edge */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-void to-transparent" />
    </div>
  );
};

export default HeroHeader;