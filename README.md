🔥 NEON FIT V3.0 - Documentation Complète & Mise à Jour
Date de dernière mise à jour : 28 novembre 2024
Version actuelle : V3.0 - Architecture Modulaire Stabilisée
Repo GitHub : ndsedf-stack/neon-fit2

📋 Table des Matières

Vue d'ensemble
Historique complet du projet
Architecture technique
Problèmes rencontrés et solutions
Guide de modification
Roadmap


🎯 Vue d'ensemble
NEON FIT est une Progressive Web App (PWA) de suivi d'entraînement avec esthétique cyberpunk/sci-fi. Elle combine :

Système de gamification (XP, levels, ranks)
Tracker de workout complet (Hybrid Performance Method)
Interface type HUD (Heads-Up Display) futuriste
Mission Briefing System immersif

Technologies

Frontend : HTML5, CSS3, Vanilla JavaScript + React (stats uniquement)
Styling : TailwindCSS (CDN), CSS custom variables
Storage : LocalStorage (pas de backend)
Architecture : Scripts classiques (non ES6 modules pour compatibilité)


📜 Historique Complet du Projet
Phase 1 : Création Initiale (neon-fit)
Période : Avant 26 novembre 2024
État :

Code inline dans 3 fichiers HTML monolithiques
JavaScript minifié, CSS inline
Duplication de code massive
Pas de versioning Git propre

Problèmes :

❌ Maintenance cauchemardesque
❌ Duplication ~60% du code
❌ Pas d'historique de workout
❌ Pas de stats visuelles


Phase 2 : Refactorisation Modulaire (26 nov 2024)
Étape 2.1 - Backup et Reformatage
bash# Backup complet
cp -r ~/desktop/neon-fit neon-fit-BACKUP-20251126-1820

# Reformatage des 3 fichiers pour lisibilité
session.html → session-readable.html
index.html → index-readable.html  
workouts.html → workouts-readable.html
Étape 2.2 - Architecture Modulaire
Modules créés :

app.js : Fonctions communes (Modal, Gamification, Utils, Inputs)
workout-history.js : Historique complet des sets + statistiques
stats.html : Page de statistiques avec React

Étape 2.3 - Migration vers neon-fit2
bash# Création nouveau repo propre
git clone https://github.com/ndsedf-stack/neon-fit2.git

# Migration fichiers + correction syntax errors
# Déploiement GitHub Pages
Résultat : ✅ Architecture modulaire fonctionnelle avec historique

Phase 3 : Mission Briefing System (27-28 nov 2024)
Objectif
Remplacer la modal de détails par une page immersive pré-workout.
Fichiers créés

briefing.html (35KB) :

Background animé : Canvas avec 200+ étoiles scintillantes
Stats dynamiques : Durée, séries, exercices, XP
Liste exercices : Cards détaillées
AI Briefing : Texte personnalisé selon bloc
Bouton "LANCER LA MISSION" → session.html


briefing-integration.js (6KB) :

Override des boutons 👁️ sur index.html et workouts.html
Redirection vers briefing.html au lieu de modal



Problèmes rencontrés

Modal s'ouvre toujours :

❌ Les scan buttons avaient déjà des event listeners
✅ Solution : Cloner les boutons + event en capture phase


Import errors :

❌ CONSTANTS inexistant dans program-data.js
✅ Solution : Supprimer l'import inutile


Scroll bloqué iOS :

❌ position: fixed cassait le scroll
✅ Solution : Revert (problème lié au cache Safari)


Cache Safari tenace :

❌ Modifications non visibles sur iPhone
✅ Solution : Vider cache + versioning ?v=X dans URLs



Résultat : ✅ Briefing fonctionnel, mais problème de cache persiste

Phase 4 : Grande Refonte Index Premium (28 nov 2024)
Objectif
Réduire l'excès de rose/magenta, équilibrer les couleurs, optimiser l'organisation.
Changements Design

Palette Rééquilibrée :

Cyan dominant : 70% (au lieu de 50%)
Rose/Magenta : 10% (au lieu de 40%)
Slate/Gris neutre : 20%


Photos workout cards :

Opacity : 40% → 25% (plus subtiles)
Blur : filter: blur(2px)
Overlay renforcé pour lisibilité


Organisation :

Hero section plus compact
Identity card simplifiée (2 colonnes au lieu de 3)
Protocol widget plus lisible
Height cards : 200px → 190px



Problèmes rencontrés
LE GRAND DRAME : Conversion Modules ES6 → Scripts Classiques
Contexte :
javascript// Code original (modules ES6)
import programData from './program-data.js';
import { Gamification, Utils } from './app.js';
Problème :

❌ Safari bloque les modules ES6 via http-server
❌ window.programData → undefined
❌ Workout cards ne s'affichent pas

Tentatives :

❌ Ajouter --cors au serveur → échec
❌ Changer en <script type="module"> → échec
❌ Vider cache Safari → échec temporaire
❌ Utiliser import() dynamique → échec

Solution finale :

Supprimer TOUS les export :

bashsed -i '' 's/export default programData;//g' program-data.js
sed -i '' 's/export const /const /g' app.js

Exposer globalement via window :

javascript// À la fin de app.js
window.Gamification = Gamification;
window.Utils = Utils;
window.Modal = Modal;
window.programData = programData; // Dans program-data.js

Charger via <script src=""> :

html<head>
  <script src="program-data-v2.js"></script>
  <script src="app-v2.js"></script>
</head>

Supprimer les import :

bashsed -i '' '/import.*from/d' index.html
sed -i '' 's/<script type="module">/<script>/g' index.html

Renommer fichiers pour forcer rechargement cache :

bashcp program-data.js program-data-v2.js
cp app.js app-v2.js
```

**Durée du debug** : ~3 heures
**Nombre de tentatives** : 15+
**Fichiers de backup créés** : 10+

**Résultat** : ✅ TOUT FONCTIONNE (index, workouts, briefing)

---

## 🏗️ Architecture Technique Finale

### Structure des Fichiers
```
neon-fit2/
├── index.html              # Dashboard principal ✅
├── workouts.html           # Liste des workouts ✅
├── session.html            # Session active ✅
├── stats.html              # Statistiques React ✅
├── briefing.html           # Mission Briefing ✅
│
├── program-data-v2.js      # Données programme (global)
├── app-v2.js               # Utilitaires (global)
├── workout-history.js      # Historique (global)
├── briefing-integration.js # Override boutons
│
└── [BACKUPS]
    ├── program-data.js.backup
    ├── app.js.backup
    ├── index.html.backup
    ├── workouts.html.backup
    └── briefing.html.backup
Chargement des Scripts
IMPORTANT : Tous les fichiers HTML utilisent maintenant des scripts classiques (NON modules).
index.html
html<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
  <script src="program-data-v2.js"></script>
  <script src="app-v2.js"></script>
</head>

<script>
  // Pas d'import ! Accès direct :
  window.programData.getWeek(1);
  window.Gamification.addXP(50);
</script>
workouts.html
html<head>
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
  <script src="program-data-v2.js"></script>
  <script src="app-v2.js"></script>
</head>
briefing.html
html<head>
  <script type="module">
    // EXCEPTION : briefing garde les modules (page standalone)
    import programData from './program-data.js';
  </script>
</head>

🐛 Problèmes Rencontrés et Solutions
1. Modules ES6 ne chargent pas (CRITIQUE)
Symptômes :
javascriptconsole.log(window.programData); // undefined
console.log(window.Gamification); // undefined
Erreurs :

SyntaxError: Unexpected keyword 'export'
Can't create duplicate variable: 'Utils'

Causes :

Safari bloque modules ES6 en local
Scripts chargés en double (duplicates)
export incompatible avec <script src="">

Solutions appliquées :

✅ Supprimer TOUS les export des fichiers JS
✅ Exposer via window.X = X
✅ Supprimer TOUS les import des HTML
✅ Changer <script type="module"> → <script>
✅ Renommer fichiers -v2 pour forcer reload
✅ Supprimer duplicates dans HTML (sed cleanup)


2. Stats Page - Historique Vide
Erreur :
javascriptCannot read property 'map' of null
Cause : WorkoutHistory.getAll() retourne null si localStorage vide
Solution :
javascriptgetTotalWorkouts() {
  const history = this.getAll() || []; // Fix
  return history.length;
}
Status : ⚠️ À implémenter

3. Briefing Scroll Bloqué iOS
Problème : Scroll ne fonctionnait pas sur iPhone
Causes testées :

position: fixed sur body (revert car cassait nav)
Cache Safari (vraie cause)

Solution :

Vider cache Safari manuellement
Ajouter ?v=X aux URLs de scripts :

html<script src="briefing-integration.js?v=4"></script>
Workaround : Navigation Privée fonctionne toujours

4. Boutons 👁️ Ouvrent Modal au Lieu de Briefing
Problème : Sur workouts.html, les scan buttons avaient déjà des event listeners
Cause :
javascript// Code original workouts.html
document.querySelectorAll('.scan-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    openDetails(btn.dataset.day); // ← Ouvre modal
  });
});
Solution :
javascript// briefing-integration.js
const newBtn = btn.cloneNode(true); // Clone pour supprimer listeners
btn.parentNode.replaceChild(newBtn, btn);

// Ajoute nouveau listener en capture phase
newBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  window.location.href = `briefing.html?week=${week}&day=${day}`;
}, true); // ← true = capture phase (prioritaire)

5. Import Errors briefing.html
Erreur :
javascriptSyntaxError: Importing binding name 'default' cannot be resolved
Cause : import { CONSTANTS } introuvable dans program-data.js
Solution :
javascript// ❌ Avant
import programData, { CONSTANTS } from './program-data.js';

// ✅ Après
import programData from './program-data.js';

📖 Guide de Modification
Comment ajouter un nouvel exercice au programme ?
Fichier : program-data-v2.js
javascript// 1. Trouve la semaine concernée (ex: semaine 1)
const weekData = {
  week: 1,
  block: 1,
  technique: "tempo",
  rpeTarget: 7,
  
  // 2. Ajoute l'exercice dans le jour voulu
  dimanche: {
    name: "Force/Hybride Inférieur",
    duration: 70,
    exercises: [
      // Exercices existants...
      
      // 3. NOUVEL EXERCICE
      {
        name: "Goblet Squat",
        sets: 3,
        reps: 12,
        rest: 120,
        weight: 20,
        tempo: "3-1-1-0",
        rpe: 7,
        notes: "Tenir KB près du torse",
        muscle: "Quadriceps",
        category: "Compound"
      }
    ]
  }
}
IMPORTANT : Pas besoin de rebuild, rechargez juste la page !

Comment changer les couleurs ?
Fichier : Tous les HTML (inline CSS)
css/* Variables actuelles */
:root {
  --void: #020408;        /* Fond principal */
  --cyan: #22d3ee;        /* Couleur principale */
  --cyan-dim: #06b6d4;    /* Cyan foncé */
  --purple: #c084fc;      /* Violet (peu utilisé) */
  --accent: #f59e0b;      /* Amber (RPE, volume) */
}

/* Pour changer la couleur principale */
--cyan: #00ff88; /* Exemple : vert néon */
Puis :

Chercher toutes les occurrences de var(--cyan) ou #22d3ee
Remplacer par la nouvelle couleur

Fichiers concernés :

index.html
workouts.html
briefing.html
session.html


Comment ajouter une nouvelle page ?
Exemple : Créer profile.html
1. Copier le squelette HTML
html<!DOCTYPE html>
<html lang="fr" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NEON FIT // PROFIL</title>
  
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
  <script src="program-data-v2.js"></script>
  <script src="app-v2.js"></script>
  
  <style>
    /* Copier le CSS d'une page existante */
    :root { --cyan: #22d3ee; ... }
    body { background: #020408; ... }
  </style>
</head>

<body>
  <!-- Contenu -->
  
  <script>
    // JavaScript sans import !
    const data = window.programData.getWeek(1);
    window.Gamification.updateUI();
  </script>
</body>
</html>
2. Ajouter le lien dans la navigation
html<!-- Dans index.html, workouts.html, etc. -->
<nav>
  <button onclick="window.location.href='profile.html'">
    <i data-lucide="user"></i>
    <span>Profil</span>
  </button>
</nav>
3. Tester localement
bashnpx http-server -p 8000 --cors
4. Commit & Push
bashgit add profile.html
git commit -m "✨ Add profile page"
git push origin main

Comment modifier les stats de gamification ?
Fichier : app-v2.js
javascript// Lignes ~10-30
export const CONSTANTS = {
  XP_LEVELS: [
    { level: 1, xp: 0 },
    { level: 2, xp: 1000 },   // Modifier ici pour changer requis
    { level: 3, xp: 2500 },
    { level: 4, xp: 5000 },
    { level: 5, xp: 10000 }
  ],
  
  RANKS: [
    { minLevel: 1, name: 'RECRUE', icon: '🎖️' },
    { minLevel: 2, name: 'OPÉRATEUR', icon: '⚡' },
    { minLevel: 3, name: 'SPÉCIALISTE', icon: '🔥' },
    { minLevel: 4, name: 'ÉLITE', icon: '💎' },
    { minLevel: 5, name: 'LÉGENDE', icon: '👑' }
  ],
  
  XP_PER_SET: 50, // XP gagné par set validé
}
Puis recharger la page (pas de rebuild nécessaire).

Comment débugger les erreurs JavaScript ?
1. Ouvrir la Console

Chrome/Safari : Cmd + Option + I (Mac) ou F12 (Windows)
Firefox : Cmd + Option + K

2. Tester les variables globales
javascript// Dans la console
console.log('programData:', window.programData);
console.log('Gamification:', window.Gamification);
console.log('Week 1:', window.programData.getWeek(1));
3. Si undefined

✅ Vérifier que les scripts sont bien chargés (<script src="program-data-v2.js">)
✅ Vérifier qu'il n'y a pas d'erreurs rouges dans la console
✅ Vider le cache Safari (Cmd + Shift + R)

4. Si erreur "Cannot find X"

✅ Vérifier qu'il n'y a plus d'import dans le HTML
✅ Vérifier que le fichier JS expose bien window.X = X


Comment forcer le rechargement du cache Safari ?
Problème : Modifications invisibles sur iPhone
Solutions :
1. Versioning des scripts (RECOMMANDÉ)
html<!-- Ajouter ?v=X à la fin des URLs -->
<script src="program-data-v2.js?v=5"></script>
<script src="app-v2.js?v=5"></script>
```

Incrémentez `v=X` à chaque modification.

#### 2. Vider cache manuellement (iPhone)
```
Réglages → Safari → Effacer historique et données de sites web
```

#### 3. Navigation Privée
```
Safari → Onglets → Privé → Coller l'URL
```

#### 4. Hard Reload (Desktop Safari)
```
Cmd + Shift + R

🗺️ Roadmap
Priority 1 - Bugs Critiques

 Fix stats.html null reference (workout-history.js:213)
 Implémenter validation complète des inputs (edge cases)
 Résoudre cache Safari définitivement (service worker ?)
 Error boundaries sur toutes les pages

Priority 2 - Fonctionnalités Manquantes

 Charts progression (Line chart, Bar chart dans stats.html)
 PWA complète (manifest.json + service worker)
 Mode offline complet
 Responsive desktop (hover states, grid layout)

Priority 3 - Optimisations

 Migrer Tailwind CDN → Build (production-ready)
 Optimiser images (lazy loading, WebP)
 Code splitting (modules dynamiques)
 Performance audit (Lighthouse)

Priority 4 - Features Avancées

 Sync cloud (Firebase/Supabase)
 Multi-utilisateurs
 Social features (partage records sur Twitter/IG)
 AI coaching (suggestions basées sur historique)
 Preview GIF exercices (API ou assets locaux)
 Dark/Light mode toggle


📊 Métriques Projet V3.0
Code Stats

Total lignes : ~6,200 lignes (+2,300 depuis V1)
Modules : 5 fichiers JS

program-data-v2.js (967 lignes)
app-v2.js (359 lignes)
workout-history.js (400 lignes)
briefing-integration.js (150 lignes)


Pages HTML : 5
Réduction duplication : ~60%
Fichiers de backup : 10+

Commits Clés
bash88d01e4 - 🚧 WIP: Add all files
877a67a - ✨ Integrate modules in index.html and workouts.html
[hash] - ✨ Add Mission Briefing System with stardust background
[hash] - 🔧 Fix workouts.html scan button override
b4288d1 - ✨ Fix index/workouts/briefing - Conversion ES6 → scripts classiques
Temps de Développement

Phase 1 (monolithe) : ~2 semaines
Phase 2 (refacto) : 1 jour
Phase 3 (briefing) : 2 jours
Phase 4 (ES6 debug) : 3 heures 🔥


🤝 Contribution
Setup Dev
bash# Fork le repo
git clone https://github.com/[username]/neon-fit2.git

# Créer une branche
git checkout -b feature/my-feature

# Développer + tester localement
npx http-server -p 8000 --cors

# Commit + push
git add .
git commit -m "✨ Add my feature"
git push origin feature/my-feature
Conventions

Commits : Gitmoji (✨ feature, 🐛 bug, 📝 docs)
Code : 2 espaces indentation, camelCase JS
Comments : En français, clairs


📄 License
Projet personnel - Tous droits réservés

👤 Auteur
Nicolas Di Stefano
GitHub: @ndsedf-stack

🙏 Remerciements

Claude AI : Debug intensif (3h sur ES6 modules 💀)
Hybrid Performance Method : Programme d'entraînement
TailwindCSS : Framework CSS
Canvas API : Stardust background


🔥 Leçons Apprises (Les Trucs Qui Nous Ont Fait Chier)
1. Modules ES6 en Local = ENFER
Ce qu'on a appris :

Safari bloque les modules ES6 via http-server
type="module" marche en prod, pas en local
Solution : Scripts classiques + window.X

À retenir :
javascript// ❌ NE JAMAIS FAIRE EN LOCAL
import X from './file.js';

// ✅ TOUJOURS FAIRE
window.X = X; // Dans le fichier JS
// Puis accès direct dans HTML

2. Cache Safari = Boss Final
Ce qu'on a appris :

Safari met TOUT en cache (HTML, CSS, JS)
Cmd+R ne suffit PAS
Navigation Privée fonctionne toujours

Solution définitive :
html<script src="file.js?v=5"></script>
<!-- Incrémenter v=X à chaque modif -->

3. Event Listeners Multiples
Ce qu'on a appris :

addEventListener ne remplace pas, il ajoute
Problème : clic → 5 handlers déclenchés

Solution :
javascript// Clone le bouton pour tuer tous les listeners
const newBtn = btn.cloneNode(true);
btn.parentNode.replaceChild(newBtn, btn);
// Puis ajouter le nouveau
newBtn.addEventListener('click', handler, true); // true = capture

4. LocalStorage est Fragile
Ce qu'on a appris :

Peut être vidé sans prévenir (mode privé, nettoyage)
getItem() retourne null si clé inexistante

Solution :
javascriptconst data = JSON.parse(localStorage.getItem('key') || '[]');
// Toujours fournir fallback

5. Console.log est Ton Ami
Ce qu'on a appris :

Sans console, debug = impossible
console.log(window.X) résout 80% des bugs

Checklist Debug :

Ouvrir console (Cmd+Opt+I)
console.log(window.programData)
console.log(window.Gamification)
Chercher erreurs rouges
Si undefined → scripts mal chargés


Dernière mise à jour : 28 novembre 2024 - 15h00
Version : V3.0 - Architecture Modulaire Stabilisée
Status : ✅ PRODUCTION READY

---

## 🔧 Maintenance & Git Workflow

### 📦 Structure Finale du Projet (Post-Nettoyage V3.1)

#### ✅ Fichiers Actifs (9 fichiers)
```
neon-fit2/
├── index.html              # Dashboard principal
├── workouts.html           # Liste des workouts
├── session.html            # Session active
├── stats.html              # Statistiques React
├── briefing.html           # Mission Briefing
│
├── app-v2.js               # Module utilitaires (global)
├── program-data-v2.js      # Données programme (global)
├── workout-history.js      # Historique workouts (global)
└── briefing-integration.js # Override boutons scan
```

**Taille totale** : ~800KB  
**Fichiers supprimés** : 13 (backups + versions obsolètes)

---

### 🔄 Workflow Git Standard

#### Commit & Push Classique
```bash
cd ~/Desktop/neon\ fit\ v4\ backup

# Vérifier les changements
git status

# Ajouter tous les fichiers modifiés
git add .

# OU ajouter fichier par fichier
git add index.html
git add app-v2.js

# Commit avec message Gitmoji
git commit -m "✨ Add new feature"
# OU
git commit -m "🐛 Fix bug in stats"
# OU
git commit -m "📝 Update documentation"

# Push vers GitHub
git push origin main
```

#### Convention Commits (Gitmoji)
| Emoji | Code | Usage |
|-------|------|-------|
| ✨ | `:sparkles:` | Nouvelle fonctionnalité |
| 🐛 | `:bug:` | Correction de bug |
| 📝 | `:memo:` | Documentation |
| 🎨 | `:art:` | Amélioration UI/design |
| ⚡ | `:zap:` | Performance |
| 🔧 | `:wrench:` | Configuration |
| 🧹 | `:broom:` | Nettoyage code |
| 🔀 | `:twisted_rightwards_arrows:` | Merge |

---

### ⚠️ Résolution Problèmes Git Courants

#### 1. Push Rejeté (Branches Divergentes)
```bash
# Erreur :
# ! [rejected] main -> main (fetch first)

# Solution :
git pull origin main --no-rebase --no-edit
git push origin main
```

#### 2. Bloqué dans Vim
```bash
# Si l'éditeur Vim s'ouvre lors d'un merge :

# Sortir SANS sauvegarder :
:q!

# Sortir EN sauvegardant :
:wq

# Puis finaliser le merge manuellement :
git commit -m "🔀 Merge remote changes"
git push origin main
```

#### 3. Annuler un Merge en Cours
```bash
git merge --abort
```

#### 4. Voir l'Historique
```bash
# Derniers 10 commits
git log --oneline -10

# Historique graphique
git log --graph --oneline --all
```

#### 5. Revenir en Arrière
```bash
# Annuler le dernier commit (garde les fichiers modifiés)
git reset --soft HEAD~1

# Annuler le dernier commit (SUPPRIME les modifications)
git reset --hard HEAD~1

# Revenir à un commit précis
git reset --hard <commit-hash>
```

---

### 🛠️ Configuration Git Recommandée

#### Éviter Vim par Défaut
```bash
# Utiliser nano (plus simple)
git config --global core.editor "nano"

# OU ne jamais ouvrir d'éditeur pour les merges
git config --global pull.rebase false
```

#### Alias Utiles
```bash
# Créer des raccourcis
git config --global alias.st "status"
git config --global alias.co "checkout"
git config --global alias.br "branch"
git config --global alias.cm "commit -m"
git config --global alias.lg "log --oneline --graph --all"

# Utilisation :
git st        # = git status
git cm "msg"  # = git commit -m "msg"
git lg        # = git log graphique
```

---

### 📊 Monitoring & Maintenance

#### Vérifier la Santé du Repo
```bash
cd ~/Desktop/neon\ fit\ v4\ backup

# Taille du repo
du -sh .

# Nombre de commits
git rev-list --count HEAD

# Dernière modification
git log -1 --format="%cd" --date=relative

# Branches locales
git branch

# Branches distantes
git branch -r
```

#### Nettoyage Périodique
```bash
# Supprimer branches locales mergées
git branch --merged | grep -v "\*" | xargs -n 1 git branch -d

# Optimiser le repo
git gc --aggressive --prune=now

# Vérifier l'intégrité
git fsck
```

---

### 🔒 Backup Strategy

#### Backup Local Avant Modifications Importantes
```bash
cd ~/Desktop

# Backup complet ZIP
zip -r "neon-fit-backup-$(date +%Y%m%d-%H%M).zip" "neon fit v4 backup"

# Backup avec exclusion .git (plus léger)
zip -r "neon-fit-backup-$(date +%Y%m%d-%H%M).zip" "neon fit v4 backup" -x "*.git*"
```

#### Backup Automatique (optionnel)
```bash
# Créer un script backup.sh
cat > backup.sh << 'SCRIPT'
#!/bin/bash
BACKUP_DIR=~/Desktop/neon-fit-backups
mkdir -p $BACKUP_DIR
cd ~/Desktop
zip -r "$BACKUP_DIR/neon-fit-backup-$(date +%Y%m%d-%H%M).zip" "neon fit v4 backup" -x "*.git*"
echo "✅ Backup créé : $BACKUP_DIR"
SCRIPT

# Rendre exécutable
chmod +x backup.sh

# Lancer
./backup.sh
```

---

### 🚀 Déploiement GitHub Pages

#### Vérifier le Déploiement
```bash
# URL de l'app :
https://ndsedf-stack.github.io/neon-fit2/

# Forcer un redéploiement (si nécessaire)
git commit --allow-empty -m "🔄 Trigger GitHub Pages rebuild"
git push origin main
```

#### Vérifier les Logs de Déploiement
1. Aller sur GitHub : `https://github.com/ndsedf-stack/neon-fit2`
2. Onglet **Actions**
3. Voir le dernier workflow **pages build and deployment**

---

### 📅 Changelog Notable

#### V3.1 - Nettoyage & Sync (28 nov 2024)
- 🧹 Suppression 13 fichiers obsolètes (backups + versions test)
- 🔀 Merge branches divergentes GitHub/Local
- 📝 Ajout section Maintenance dans README
- ✅ Repo optimisé : 800KB

#### V3.0 - Architecture Modulaire (27-28 nov 2024)
- ✨ Mission Briefing System avec stardust background
- 🔧 Conversion ES6 modules → Scripts classiques (Safari fix)
- 🎨 Refonte design index.html (équilibrage cyan/rose)
- 📦 9 fichiers actifs finaux

---

### 🆘 Aide Rapide

| Problème | Commande |
|----------|----------|
| Push rejeté | `git pull origin main --no-rebase --no-edit && git push` |
| Bloqué dans Vim | `:q!` puis `git commit -m "msg"` |
| Voir l'état | `git status` |
| Annuler merge | `git merge --abort` |
| Historique | `git log --oneline -10` |
| Taille repo | `du -sh .` |
| Backup rapide | `zip -r backup-$(date +%Y%m%d).zip .` |

---

**Dernière mise à jour** : 28 novembre 2024 - 16h30  
**Version** : V3.1 - Production-Ready & Maintainable ✅

