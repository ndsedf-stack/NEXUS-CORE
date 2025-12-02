import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Play, BarChart3, Settings } from 'lucide-react';
import '../../styles/bottom-nav.css';

export default function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/workouts', icon: Calendar, label: 'Programme' },
    { path: '/session/1/dimanche', icon: Play, label: 'Session', primary: true },
    { path: '/stats', icon: BarChart3, label: 'Stats' },
    { path: '/settings', icon: Settings, label: 'Config' }
  ];
  
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive ? 'active' : ''} ${item.primary ? 'primary' : ''}`}
          >
            <div className="nav-icon-wrapper">
              <Icon size={item.primary ? 28 : 24} />
              {isActive && <div className="active-indicator" />}
            </div>
            <span className="nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
