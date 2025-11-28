# NEON FIT V3.0 - Configuration & Documentation

## Overview
NEON FIT is a PWA fitness tracker with cyberpunk/sci-fi aesthetics. Built for iOS Safari compatibility.

**Version**: V3.0  
**Language**: French (FR)  
**Architecture**: Express.js backend + Static frontend  

## File Structure
```
.
├── server/                  # Backend Express.js
│   ├── index.js            # Main server, routes, static files
│   ├── replitAuth.js       # Replit Auth (OpenID Connect)
│   └── db.js               # PostgreSQL connection & queries
│
├── index.html              # Dashboard principal (QG)
├── workouts.html           # Liste des workouts (OPS)
├── session.html            # Session d'entraînement active
├── stats.html              # Statistiques React (STATS)
├── briefing.html           # Mission Briefing pre-workout
│
├── app-v2.js               # Gamification, Utils, UI helpers
├── program-data-v2.js      # 4-week workout program data
├── workout-history-v2.js   # Workout history CRUD
├── stats-data.js           # Stats aggregation from history
├── cloud-sync.js           # Auth UI + cloud sync logic
├── briefing-integration.js # Briefing page button handlers
│
├── app.js                  # ES6 module version (session.html only)
├── program-data.js         # ES6 module version (session.html only)
├── workout-history.js      # ES6 module version (session.html only)
│
├── sw.js                   # Service Worker for PWA
└── version.js              # Version timestamp
```

## Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: TailwindCSS CDN + Custom CSS
- **Stats Page**: React 18 + Babel (in-browser compilation)
- **Backend**: Express.js with Replit Auth (OIDC)
- **Database**: PostgreSQL (Neon-backed via Replit)
- **Storage**: LocalStorage (offline-first) + Cloud sync

## How to Run
The app runs via `node server/index.js` on port 5000.
Server serves static files AND provides API endpoints.

## API Endpoints
```
GET  /api/auth/status   - Check if user is logged in
GET  /api/login         - Start OAuth login flow
GET  /api/callback      - OAuth callback handler
GET  /api/logout        - Logout and clear session
GET  /api/sync/data     - Get all user data from cloud
POST /api/sync/data     - Push single key-value to cloud
POST /api/sync/bulk     - Push all data to cloud
```

---

## GUIDE FOR AI: How to Modify the App

### Safari Compatibility (CRITICAL)
Use **classic scripts** (NOT ES6 modules) for all pages except session.html.
All modules must expose via `window`:
```javascript
// In JavaScript file:
window.MyModule = MyModule;

// In HTML:
<script src="my-module.js"></script>
```

### Styling System
The app uses **TailwindCSS CDN** with custom config:
```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        neon: { cyan: '#06b6d4', magenta: '#d946ef', lime: '#84cc16' }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Orbitron', 'sans-serif'],
      }
    }
  }
}
```

#### Color Palette (Cyberpunk Theme)
- **Primary Cyan**: `text-cyan-400`, `bg-cyan-500`, `border-cyan-500/30`
- **Accent Magenta**: `text-fuchsia-400`, `bg-fuchsia-500`
- **Warning Amber**: `text-amber-400`, `bg-amber-500`
- **Success Green**: `text-emerald-400`, `bg-emerald-500`
- **Background**: `bg-black`, `bg-[#050505]`, `bg-[#0a0a0a]`
- **Borders**: `border-white/10`, `border-cyan-500/30`

#### Common Effects
```html
<!-- Glow effect -->
<div class="shadow-[0_0_30px_rgba(34,211,238,0.3)]">

<!-- Glass card -->
<div class="bg-black/80 backdrop-blur-md border border-white/10 rounded-xl">

<!-- Neon text -->
<span class="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
```

### Stats Page Components (stats.html)
Stats uses React with in-browser Babel. Components:

1. **NeonTracker** - Radial gauge showing score, sessions, sets
2. **WeeklyProgress** - Path visualization of weekly progression
3. **MuscleMatrix** - HUD-style muscle breakdown grid
4. **IntensityZones** - Force/Hypertrophie/Endurance bars
5. **MuscleTurbine** - Rotating wheel of muscle volumes

#### Adding a New Stat Widget
```jsx
const MyNewWidget = ({ data }) => {
  return (
    <div className="bg-black border border-white/10 rounded-2xl p-4">
      <div className="bg-[#050505] px-4 py-3 border-b border-white/10">
        <h2 className="font-display font-bold text-white tracking-wider uppercase flex items-center gap-2">
          <Icon className="text-cyan-400" size={18} />
          WIDGET TITLE
        </h2>
      </div>
      <div className="p-4">
        {/* Widget content */}
      </div>
    </div>
  );
};
```

#### Stats Data Format (stats-data.js)
Data comes from `window.StatsData`:
```javascript
// Zones (intensity distribution)
StatsData.getZonesData() => [
  { id: 'force', label: 'FORCE', range: '1-5 RM', percent: 25, sets: 10, color: 'bg-amber-500' },
  { id: 'hyper', label: 'HYPERTROPHIE', range: '6-12 RM', percent: 50, sets: 20, color: 'bg-violet-500' },
  { id: 'endu', label: 'ENDURANCE', range: '15+ RM', percent: 25, sets: 10, color: 'bg-cyan-500' }
]

// Muscles (volume per group)
StatsData.getMusclesData() => [
  { id: 'm1', name: 'DOS', volume: 15000, color: '#3b82f6' },
  { id: 'm2', name: 'PECTORAUX', volume: 12000, color: '#22d3ee' },
  ...
]

// Summary (global stats)
StatsData.getSummary() => {
  score: 75,           // 0-100
  sessions: 3,         // completed workouts
  maxSessions: 5,      // target per week
  sets: 45,            // total sets done
  maxSets: 60,         // target sets
  volume: 25000,       // total kg lifted
  xp: 1500             // gamification XP
}
```

### Workout History Format
Stored in LocalStorage key `neon_fit_workout_history`:
```javascript
[
  {
    id: 'uuid',
    date: '2025-11-28',
    week: 1,
    day: 'dimanche',
    exercise: 'Trap Bar Deadlift',
    muscle: ['dos', 'jambes'],
    reps: 8,
    weight: 100,
    rpe: 7,
    completed: true,
    timestamp: 1732801234567
  },
  ...
]
```

### Program Data Structure (program-data-v2.js)
```javascript
window.programData = {
  program: {
    week1: {
      weekNumber: 1,
      block: 1,
      technique: 'Tempo 3-1-2',
      rpeTarget: '6-7',
      dimanche: {
        name: 'DOS + JAMBES LOURDES + BRAS',
        duration: 68,
        totalSets: 31,
        exercises: [
          {
            id: 'w1_dim_1',
            name: 'Trap Bar Deadlift',
            category: 'compound',
            muscle: ['dos', 'jambes', 'fessiers'],
            sets: 5,
            reps: '6-8',
            weight: 75,
            rest: 120,
            tempo: '3-1-2'
          },
          ...
        ]
      },
      mardi: { ... },
      jeudi: { ... },
      samedi: { ... }
    },
    week2: { ... },
    week3: { ... },
    week4: { ... }
  }
}
```

### Cloud Sync Flow (cloud-sync.js)
```
1. User clicks "Sync Cloud" button
2. If not logged in: redirects to /api/login
3. OAuth flow via Replit Auth (Apple ID, Google, etc.)
4. On success: callback to /api/callback, session created
5. Auto-sync every 60s pushes LocalStorage to cloud
6. On page load: pulls cloud data and merges with local
```

### Adding a New Page
1. Create `newpage.html` with standard structure:
```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <title>NeonFit - Page Title</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Tailwind config and fonts... -->
  <script src="cloud-sync.js"></script>
</head>
<body class="bg-black text-white">
  <!-- Content -->
  <script src="program-data-v2.js"></script>
  <script src="app-v2.js"></script>
</body>
</html>
```

2. Add to navigation in other pages
3. Add to sw.js urlsToCache array

---

## LocalStorage Keys
- `hybrid_xp` - User XP points (number)
- `hybrid_current_week` - Current program week (1-4)
- `neon_fit_workout_history` - Array of workout entries
- `cloudSyncLastSync` - Timestamp of last cloud sync

## Database Tables (PostgreSQL)
```sql
-- Users table
users (
  id TEXT PRIMARY KEY,          -- Replit user ID
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Sessions table (for auth)
sessions (
  sid VARCHAR NOT NULL PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
)

-- Workout data table
workout_data (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  data_key TEXT NOT NULL,       -- e.g. 'workout_history', 'xp'
  data_value JSONB NOT NULL,
  updated_at TIMESTAMP
  UNIQUE(user_id, data_key)
)
```

## User Preferences
- Language: French (FR)
- Indentation: 2 spaces
- JS naming: camelCase
- Commit style: Gitmoji

## iOS Compatibility Checklist
- [x] viewport-fit=cover
- [x] safe-area-inset padding
- [x] -webkit-backdrop-filter
- [x] -webkit-tap-highlight-color: transparent
- [x] -webkit-overflow-scrolling: touch
- [x] apple-mobile-web-app meta tags
- [x] Classic scripts (no ES6 modules)
