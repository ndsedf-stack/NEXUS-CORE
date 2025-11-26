# 🔥 NEON FIT V2.0 - Documentation Complète

## 📋 Table des Matières
- [Vue d'ensemble](#vue-densemble)
- [Historique du projet](#historique-du-projet)
- [Architecture](#architecture)
- [Installation](#installation)
- [Structure des fichiers](#structure-des-fichiers)
- [Fonctionnalités](#fonctionnalités)
- [Améliorations V2](#améliorations-v2)
- [Bugs connus](#bugs-connus)
- [Roadmap](#roadmap)

---

## 🎯 Vue d'ensemble

**NEON FIT** est une application web progressive (PWA) de suivi d'entraînement avec une esthétique cyberpunk. Elle combine un système de gamification (XP, levels, ranks) avec un tracker de workout complet pour le programme Hybrid Performance Method.

### Technologies
- HTML5 / CSS3 / Vanilla JavaScript
- TailwindCSS (CDN)
- LocalStorage pour la persistance
- Architecture modulaire ES6

### Repo GitHub
- **Ancien repo**: `ndsedf-stack/neon-fit` (version monolithique)
- **Nouveau repo**: `ndsedf-stack/neon-fit2` (version modulaire)

---

## 📜 Historique du Projet

### Phase 1 : Création Initiale (neon-fit)
- Code inline dans 3 fichiers HTML monolithiques
- JavaScript minifié et CSS inline
- Fonctionnalités de base : dashboard, workouts, sessions
- **Problèmes** : Code dupliqué, difficile à maintenir, pas d'historique

### Phase 2 : Refactorisation (26 nov 2024)
#### Étape 1 - Backup et Reformatage
```bash
# Backup complet du repo original
cp -r ~/desktop/neon-fit neon-fit-BACKUP-20251126-1820

# Reformatage des 3 fichiers HTML pour lisibilité
- session.html → session-readable.html
- index.html → index-readable.html  
- workouts.html → workouts-readable.html
```

#### Étape 2 - Architecture Modulaire
**Nouveaux modules créés** :
- `app.js` - Fonctions communes (Modal, Gamification, Utils, Inputs)
- `workout-history.js` - Système complet d'historique et statistiques
- `stats.html` - Nouvelle page de statistiques

#### Étape 3 - Migration vers neon-fit2
```bash
# Création du nouveau repo
git clone https://github.com/ndsedf-stack/neon-fit2.git

# Migration des fichiers
- Copie des nouveaux modules (app.js, workout-history.js)
- Copie de session-final.html (version intégrée)
- Copie de stats.html
- Migration de program-data.js
- Modification de index.html et workouts.html via script Python
```

#### Étape 4 - Corrections
```bash
# Fix syntax errors
- index.html : Suppression code dupliqué (lignes 449-481)
- workouts.html : Correction weekData.blockName undefined
- Déploiement sur GitHub
```

---

## 🏗️ Architecture

### Structure Modulaire

```
neon-fit2/
├── index.html              # Dashboard principal
├── workouts.html           # Liste des workouts
├── session.html            # Interface session active
├── stats.html              # Statistiques et historique
├── program-data.js         # Données du programme (semaines, exercices)
├── app.js                  # Module utilitaires communs
└── workout-history.js      # Gestion historique et stats
```

### Modules JavaScript

#### `app.js` - Utilitaires Communs
```javascript
export const CONSTANTS = { XP_LEVELS, RANKS, QUOTES, ... }
export const Modal = { open(), close() }
export const Gamification = { updateUI(), addXP(), getLevel(), ... }
export const Utils = { formatDate(), vibrate(), ... }
export const Inputs = { modWeight(), modReps(), modRest() }
export const ErrorHandler = { handle() }
```

#### `workout-history.js` - Historique & Stats
```javascript
export const WorkoutHistory = {
  add(entry),           // Ajouter un set
  getAll(),             // Récupérer tout l'historique
  getByWeek(week),      // Filtrer par semaine
  getByExercise(name),  // Filtrer par exercice
  getTotalWorkouts(),   // Nombre total
  clear(),              // Reset
  export(),             // Export JSON
  import(data)          // Import JSON
}

export const WorkoutStats = {
  getTotalVolume(),     // Volume total
  getAverageWeight(),   // Poids moyen
  getPersonalBests(),   // Records
  getProgressionRate()  // Taux de progression
}

export const ProgressTracker = {
  compareWeeks(w1, w2),     // Comparaison semaines
  getWeeklyProgress(),      // Progression hebdomadaire
  getTrends()               // Tendances
}
```

---

## 🚀 Installation

### 1. Cloner le Repo
```bash
git clone https://github.com/ndsedf-stack/neon-fit2.git
cd neon-fit2
```

### 2. Lancer Localement
```bash
# Serveur Python
python3 -m http.server 8000

# Ou serveur Node
npx http-server -p 8000
```

### 3. Ouvrir dans le Navigateur
```
http://localhost:8000
```

### 4. Activer GitHub Pages (Production)
```
Settings → Pages → Source: main branch → Save
URL: https://ndsedf-stack.github.io/neon-fit2/
```

---

## 📁 Structure des Fichiers

### `index.html` - Dashboard
- **Hero Section** : Identité utilisateur, rank, XP
- **Protocol Widget** : Semaine actuelle, bloc, technique
- **Workout Cards** : 4 jours (Dimanche, Mardi, Vendredi, Maison)
- **Canvas Animation** : Reactor core animé
- **Navigation** : Liens vers workouts, stats

### `workouts.html` - Liste Workouts
- **Timeline** : Navigation semaines (48 semaines)
- **Week Chips** : Sélection rapide semaine active
- **Workout Cards** : 4 jours avec preview exercices
- **Modal** : Détails workout (exercices, séries, reps)
- **Achievements** : Système de badges (désactivé)

### `session.html` - Session Active
- **Header** : Semaine, jour, exercice actuel, timer
- **Exercise Display** : Nom, série actuelle, état (work/rest)
- **Inputs** : Poids, reps, repos (modifiables)
- **Controls** : Valider set, skip, play/pause timer
- **Progress** : Dots pour tracking séries
- **Reactor Core** : Animation état (work/rest)

### `stats.html` - Statistiques
- **Overview** : Total workouts, volume, records
- **Recent History** : Liste des 50 derniers sets
- **Export/Import** : Sauvegarde/restauration données
- **Charts** : (À implémenter)

---

## ✨ Fonctionnalités

### Système de Gamification
- **XP** : +50 XP par set validé
- **Levels** : 5 niveaux (1000, 2500, 5000, 10000 XP)
- **Ranks** : Recruit → Operator → Specialist → Elite → Legend
- **Flash Effect** : Animation visuelle à chaque gain XP
- **Progress Bar** : Barre XP animée
- **Random Quotes** : Citations motivantes

### Tracking Workout
- **Timer Repos** : Décompte visuel + vibration
- **Modification Inputs** : Poids (±2.5kg), Reps (±1), Repos (±15s)
- **Validation Sets** : Sauvegarde automatique dans historique
- **Progress Dots** : Indicateur séries complétées
- **Skip Exercise** : Passer à l'exercice suivant
- **Auto-save** : LocalStorage (poids, reps, repos)

### Historique & Stats
- **Logging Complet** : Date, semaine, jour, exercice, poids, reps
- **Filtres** : Par semaine, par exercice
- **Statistiques** : Volume total, poids moyen, records
- **Comparaison** : Progression semaine N vs N-1
- **Export/Import** : JSON pour backup/transfert

### UX Mobile
- **Safe Areas** : Support iPhone (env(safe-area-inset-*))
- **Touch Optimization** : touch-action: manipulation
- **Animations** : touch-pop, card-sheen, reactor core
- **Vibration** : Feedback haptique
- **PWA Ready** : Installable, fonctionne offline (à activer)

---

## 🆕 Améliorations V2

### Code Quality
✅ **Architecture modulaire** : Séparation app.js, workout-history.js  
✅ **DRY** : Fonctions communes, plus de duplication  
✅ **Lisibilité** : Code formaté, commentaires, sections claires  
✅ **Error Handling** : Try/catch sur fonctions critiques  
✅ **Validation** : Min/max sur inputs (poids, reps, repos)

### Fonctionnalités
✅ **Historique workout** : Sauvegarde complète de chaque set  
✅ **Page Stats** : Vue d'ensemble, historique récent  
✅ **Export/Import** : Backup et restauration données  
✅ **Comparaison perfs** : Semaine actuelle vs précédente  
✅ **Personal Bests** : Tracking des records

### Performance
✅ **Canvas optimisé** : Pause animation si page hidden  
✅ **LocalStorage** : Sauvegarde incrémentale efficace

---

## 🐛 Bugs Connus

### 1. Stats Page - Historique Vide
**Problème** : `workout-history.js:213` - Cannot read 'map' of null  
**Cause** : `WorkoutHistory.getAll()` retourne null si historique vide  
**Status** : ⚠️ À corriger  
**Fix** :
```javascript
// Ligne 213 de workout-history.js
getTotalWorkouts() {
  const history = this.getAll() || []; // Ajouter || []
  return history.length;
}
```

### 2. Effets Visuels Desktop
**Problème** : Hover effects peu visibles sur desktop  
**Cause** : App optimisée pour mobile (touch events)  
**Status** : ℹ️ Comportement normal  
**Note** : Tester avec Chrome DevTools → Toggle device toolbar

### 3. Tailwind CDN Warning
**Problème** : "cdn.tailwindcss.com should not be used in production"  
**Cause** : Utilisation CDN au lieu de build Tailwind  
**Status** : ⚠️ Non-bloquant  
**Fix** : Installer Tailwind CLI pour production

### 4. Deprecated Meta Tag
**Problème** : `<meta name="apple-mobile-web-app-capable">`  
**Status** : ℹ️ Non-bloquant  
**Fix** : Remplacer par `<meta name="mobile-web-app-capable">`

---

## 🗺️ Roadmap

### Priority 1 - Bugs Critiques
- [ ] Fix stats.html null reference error
- [ ] Validation complète inputs (edge cases)
- [ ] Error boundaries sur toutes les pages

### Priority 2 - Fonctionnalités Manquantes
- [ ] Charts progression (Line chart, Bar chart)
- [ ] PWA manifest.json + service worker
- [ ] Mode offline complet
- [ ] Responsive desktop (hover states, grid layout)

### Priority 3 - Optimisations
- [ ] Migrer Tailwind CDN → Build
- [ ] Optimiser images (lazy loading, WebP)
- [ ] Code splitting (modules dynamiques)
- [ ] Performance audit (Lighthouse)

### Priority 4 - Features Avancées
- [ ] Sync cloud (Firebase/Supabase)
- [ ] Multi-utilisateurs
- [ ] Social features (partage records)
- [ ] AI coaching (suggestions basées sur historique)

---

## 📊 Métriques Projet

### Code Stats
- **Total lignes** : ~3,900 lignes
- **Modules** : 4 fichiers JS (app.js, workout-history.js, program-data.js)
- **Pages HTML** : 4 (index, workouts, session, stats)
- **Réduction duplication** : ~60% (estimation)

### Commits Clés
```bash
88d01e4 - 🚧 WIP: Add all files (index & workouts need modifications)
877a67a - ✨ Integrate modules in index.html and workouts.html
[à venir] - 🐛 Fix stats.html null reference error
```

---

## 🤝 Contribution

### Setup Dev
```bash
# Fork le repo
git clone https://github.com/[username]/neon-fit2.git

# Créer une branche
git checkout -b feature/my-feature

# Développer + tester localement
python3 -m http.server 8000

# Commit + push
git add .
git commit -m "✨ Add my feature"
git push origin feature/my-feature

# Créer Pull Request sur GitHub
```

### Conventions
- **Commits** : Utiliser gitmoji (✨ feature, 🐛 bug, 📝 docs, etc.)
- **Code** : 2 espaces indentation, camelCase pour JS
- **Comments** : En français, clairs et concis

---

## 📄 License

Projet personnel - Tous droits réservés

---

## 👤 Auteur

**Nicolas Di Stefano**  
GitHub: [@ndsedf-stack](https://github.com/ndsedf-stack)

---

## 🙏 Remerciements

- **Claude AI** : Assistance développement et refactorisation
- **Hybrid Performance Method** : Programme d'entraînement
- **TailwindCSS** : Framework CSS

---

*Dernière mise à jour : 26 novembre 2024*
MISE A JOUR 2 

# 🦾 NeonFit Stat - Documentation Technique & Design System

## 1. Philosophie du Design (The "Why")

NeonFit Stat n'est pas un simple dashboard ; c'est une interface de type **HUD (Heads-Up Display)** inspirée du style Cyberpunk/Sci-Fi. 

L'objectif visuel est de simuler un **équipement physique rétro-futuriste** (écrans OLED, jauges analogiques-numériques, châssis en carbone) tout en restant une application web fluide.

### Les Piliers Esthétiques :
1.  **Noir Profond & Contrastes** : Nous n'utilisons pas simplement `black`. Nous utilisons des nuances précises :
    *   `#010101` (Fond global)
    *   `#050505` (Headers des cartes)
    *   `#020202` (Corps des cartes)
    *   `#080808` (Footers)
2.  **Lumière & Néon** : Les couleurs ne sont pas plates. Elles doivent "émettre" de la lumière via des ombres portées (`box-shadow` ou `drop-shadow` en CSS).
    *   Cyan (`#22d3ee`) : État nominal / Info.
    *   Amber (`#f59e0b`) : Optimisation / Gold standard.
    *   Red (`#ef4444`) : Alerte / Intense.
3.  **Contenant Technique** : Chaque composant est encapsulé dans une "Coque" (Shell) avec des bordures très fines (`border-white/10`) pour imiter des jointures de panneaux métalliques.

---

## 2. Intégration & Data Flow (IMPORTANT)

Cette application de statistiques est construite en React mais conçue pour s'intégrer dans un environnement Vanilla JS existant via le fichier `stats.html`.

### Comment envoyer des données à la page stats ?

La page écoute les changements dans le `localStorage` du navigateur. Voici comment mettre à jour les jauges depuis votre application principale :

```javascript
// Dans votre app Vanilla JS (quand un exercice est fini)
function updateStats(newScore, newVolume, newSets) {
    const statsData = {
        score: newScore,     // 0-100
        volume: newVolume,   // en kg
        sets: newSets,       // nombre total
        sessions: 4          // nombre de séances
    };

    // 1. Sauvegarder dans le storage
    localStorage.setItem('NEONFIT_DATA', JSON.stringify(statsData));

    // 2. (Optionnel) Si la page stats est ouverte dans un autre onglet, 
    // elle se mettra à jour automatiquement.
}
```

### Structure du fichier `stats.html`
C'est un fichier "Standalone". Il ne nécessite **aucun serveur de build** (pas de `npm run build`).
*   Il charge React, ReactDOM et Babel depuis des CDN (`esm.sh`, `unpkg`).
*   Il compile le code React à la volée dans le navigateur.
*   Il contient TOUS les composants (NeonTracker, VolumeGauge, etc.) à l'intérieur de la balise `<script>`.

---

## 3. Architecture Technique

### Stack
*   **React 19** : Pour la gestion d'état et le cycle de vie des composants.
*   **Tailwind CSS** : Pour le styling utilitaire rapide.
*   **HTML5 Canvas** : Pour les jauges complexes (NeonTracker, VolumeGauge) nécessitant 60fps sans surcharge du DOM.
*   **SVG** : Pour les graphiques vectoriels interactifs (Radar Chart, Turbine, Courbes).

### Typographie
Le choix des polices est critique pour l'effet HUD :
*   **Orbitron** (`font-display`) : Titres, gros chiffres, jauges. Aspect futuriste.
*   **JetBrains Mono** (`font-mono`) : Labels techniques, petits détails, données brutes.
*   **Inter** (`font-sans`) : Texte de lecture standard (rarement utilisé).

---

## 4. Analyse Détaillée des Composants

### A. NeonTracker
**Type** : Canvas 2D
**Fonctionnement** : C'est le cœur du système. Il utilise un `<canvas>` pour dessiner des arcs concentriques.
*   **Logique** : Utilise `requestAnimationFrame` pour interpoler les valeurs (Lerp) afin que les jauges se remplissent avec fluidité.

### B. VolumeGauge
**Type** : Canvas 2D
**Particularité** : L'aiguille physique.
*   **Physique** : Contrairement à une animation CSS linéaire, l'aiguille utilise une fonction d'amortissement (Damping) pour avoir un mouvement organique.

### C. MuscleHud
**Type** : SVG Interactif (Radar Chart)
**Mathématiques** : Utilise la trigonométrie pour placer les points sur un cercle.
*   **Style Harmonisé** : Cadre gris (`border-white/10`), fond noir, pas de halo bleu externe pour respecter la charte.

---

## 5. Comment créer un nouveau composant ?

Si vous devez créer un nouveau composant (ex: "Sleep Analysis"), suivez strictement ce **Template d'Anatomie** pour garantir l'harmonie :

```tsx
export const NewComponent = () => {
  return (
    // 1. LE CONTENEUR (Shell)
    // Toujours : bg-black, border-white/10, rounded-3xl, overflow-hidden
    <div className="relative w-full bg-black border-[2px] border-white/10 rounded-3xl flex flex-col overflow-hidden group">
      
      {/* 2. LE HEADER */}
      {/* Toujours : bg-[#050505], border-b border-white/10 */}
      <div className="bg-[#050505] px-6 py-4 border-b border-white/10 flex justify-between">
         {/* Titre avec icône et sous-titre mono */}
      </div>

      {/* 3. LE CORPS (Body) */}
      {/* Toujours : bg-[#020202] */}
      <div className="flex-1 bg-[#020202] p-6 relative">
         {/* Votre contenu (Canvas, SVG, etc.) */}
      </div>

      {/* 4. LE FOOTER */}
      {/* Toujours : bg-[#080808], border-t border-white/10 */}
      <div className="bg-[#080808] border-t border-white/10">
         {/* Stats secondaires */}
      </div>
    </div>
  )
}
```
