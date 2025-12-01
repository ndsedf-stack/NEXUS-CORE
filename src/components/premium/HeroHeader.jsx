import { motion } from 'framer-motion';
import '../../styles/premium/hero.css';

export default function HeroHeader({ 
  title, 
  subtitle, 
  stats = [],
  imageUrl = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200'
}) {
  return (
    <div className="hero-container">
      {/* Background Image */}
      <div className="hero-background">
        <img src={imageUrl} alt="" className="hero-image" />
        <div className="hero-gradient" />
      </div>
      
      {/* Scanlines */}
      <div className="hero-scanlines" />
      
      {/* Content */}
      <div className="hero-content">
        <motion.h1
          className="hero-title font-hud"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h1>
        
        {subtitle && (
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {subtitle}
          </motion.p>
        )}
        
        {stats.length > 0 && (
          <motion.div 
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {stats.map((stat, i) => (
              <div key={i} className="hero-stat">
                <span className="stat-icon">{stat.icon}</span>
                <span className="stat-value">{stat.value}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
      
      {/* Corner brackets */}
      <div className="hero-brackets">
        <div className="bracket top-left" />
        <div className="bracket top-right" />
        <div className="bracket bottom-left" />
        <div className="bracket bottom-right" />
      </div>
    </div>
  );
}
