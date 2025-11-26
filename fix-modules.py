#!/usr/bin/env python3
"""
Script pour modifier index.html et workouts.html
pour qu'ils utilisent les modules app.js et workout-history.js
"""

import re

print("🔧 Modification des fichiers HTML...")
print()

# ============================================
# MODIFIER INDEX.HTML
# ============================================

print("📝 Modification de index.html...")

with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

# 1. Ajouter les imports au début du script
index_content = index_content.replace(
    "import programData from './program-data.js';",
    "import programData from './program-data.js';\n    import { Gamification, Utils, Modal, initIcons } from './app.js';"
)

# 2. Remplacer toute la fonction loadGamification
# Trouver le début et la fin de la fonction
pattern = r'function loadGamification\(\) \{.*?(?=\n    \/\/ =|function |window\.|const |init)'
replacement = '''function loadGamification() {
      Gamification.updateUI();
      
      const quoteEl = document.getElementById('daily-quote');
      const randomQuote = Gamification.getRandomQuote();
      const parts = randomQuote.split('.');
      
      if (parts.length > 1) {
        quoteEl.innerHTML = `${parts[0]}. <span class="text-[var(--magenta)] font-bold text-shadow-magenta">${parts[1]}</span>`;
      } else {
        quoteEl.textContent = randomQuote;
      }
    }

    '''

index_content = re.sub(pattern, replacement, index_content, flags=re.DOTALL)

# 3. Remplacer window.openDetails
pattern_open = r'window\.openDetails = \(day\) => \{.*?document\.getElementById\(\'details-modal\'\)\.classList\.add\(\'open\'\);.*?\};'
replacement_open = '''window.openDetails = (day) => {
      const currentWeek = Utils.getCurrentWeek();
      const workout = programData.getWorkout(currentWeek, day);
      
      Modal.open(
        day.toUpperCase(),
        workout.name,
        workout.exercises,
        () => window.location.href = `session.html?week=${currentWeek}&day=${day}`
      );
    };'''

index_content = re.sub(pattern_open, replacement_open, index_content, flags=re.DOTALL)

# 4. Remplacer tous les lucide.createIcons() par initIcons()
index_content = index_content.replace('lucide.createIcons()', 'initIcons()')

# Sauvegarder
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(index_content)

print("✅ index.html modifié avec succès")
print()

# ============================================
# MODIFIER WORKOUTS.HTML
# ============================================

print("📝 Modification de workouts.html...")

with open('workouts.html', 'r', encoding='utf-8') as f:
    workouts_content = f.read()

# 1. Ajouter les imports
workouts_content = workouts_content.replace(
    "import programData from './program-data.js';",
    "import programData from './program-data.js';\n    import { Utils, Modal, initIcons } from './app.js';"
)

# 2. Remplacer currentWeek
workouts_content = workouts_content.replace(
    "let currentWeek = parseInt(localStorage.getItem('hybrid_current_week') || 1);",
    "let currentWeek = Utils.getCurrentWeek();"
)

# 3. Remplacer localStorage.setItem
workouts_content = workouts_content.replace(
    "localStorage.setItem('hybrid_current_week', i);",
    "Utils.setCurrentWeek(i);"
)

# 4. Remplacer window.openDetails (même code que index)
workouts_content = re.sub(pattern_open, replacement_open, workouts_content, flags=re.DOTALL)

# 5. Remplacer lucide.createIcons()
workouts_content = workouts_content.replace('lucide.createIcons()', 'initIcons()')

# Sauvegarder
with open('workouts.html', 'w', encoding='utf-8') as f:
    f.write(workouts_content)

print("✅ workouts.html modifié avec succès")
print()

print("🎉 Tous les fichiers ont été modifiés !")
print()
print("Prochaines étapes:")
print("  1. git add .")
print("  2. git commit -m '✨ Integrate modules in index.html and workouts.html'")
print("  3. git push origin main")
