/**
 * NEON FIT - Workout History Management (Classic Script Version)
 * Handles logging, retrieving, and analyzing workout data
 * Non-module version for Safari compatibility
 */

(function() {
  const STORAGE_KEY = 'neon_fit_workout_history';
  const MAX_HISTORY_ITEMS = 1000;

  function safeParseJSON(data, fallback) {
    try {
      return data ? JSON.parse(data) : fallback;
    } catch(e) {
      return fallback;
    }
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  const WorkoutHistory = {
    logSet: function(setData) {
      try {
        const entry = {
          id: generateId(),
          timestamp: new Date().toISOString(),
          date: new Date().toLocaleDateString('fr-FR'),
          week: setData.week,
          day: setData.day,
          exercise: setData.exercise,
          exerciseId: setData.exerciseId || null,
          exerciseIndex: setData.exerciseIndex || 0,
          setNumber: setData.setNumber,
          weight: setData.weight,
          reps: setData.reps,
          targetWeight: setData.targetWeight || setData.weight,
          targetReps: setData.targetReps || setData.reps,
          rpe: setData.rpe || null,
          technique: setData.technique || 'STANDARD',
          notes: setData.notes || '',
          completed: true
        };
        
        const history = WorkoutHistory.getAll() || [];
        history.push(entry);
        
        if (history.length > MAX_HISTORY_ITEMS) {
          history.shift();
        }
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        return true;
      } catch (error) {
        console.error('Error logging set:', error);
        return false;
      }
    },
    
    getAll: function() {
      return safeParseJSON(localStorage.getItem(STORAGE_KEY), []);
    },
    
    getByWeek: function(week) {
      return (WorkoutHistory.getAll() || []).filter(function(entry) {
        return entry.week === week;
      });
    },
    
    getByDay: function(week, day) {
      return (WorkoutHistory.getAll() || []).filter(function(entry) {
        return entry.week === week && entry.day === day;
      });
    },
    
    getByExercise: function(exerciseName, limit) {
      var results = (WorkoutHistory.getAll() || []).filter(function(entry) {
        return entry.exercise === exerciseName || entry.exerciseId === exerciseName;
      });
      
      results.sort(function(a, b) {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      
      return limit ? results.slice(0, limit) : results;
    },

    getByExerciseId: function(exerciseId) {
      return (WorkoutHistory.getAll() || []).filter(function(entry) {
        return entry.exerciseId === exerciseId;
      });
    },

    getCompletedSetsForExercise: function(exerciseId, week, day) {
      return (WorkoutHistory.getAll() || []).filter(function(entry) {
        return (entry.exerciseId === exerciseId || entry.exercise === exerciseId) &&
               entry.week === week &&
               entry.day === day &&
               entry.completed;
      });
    },
    
    getLastWorkout: function(exerciseName) {
      var history = WorkoutHistory.getByExercise(exerciseName, 1);
      return history.length > 0 ? history[0] : null;
    },
    
    getComparison: function(currentWeek, day, exerciseName) {
      var all = WorkoutHistory.getAll() || [];
      
      var current = all.filter(function(entry) {
        return entry.week === currentWeek && 
               entry.day === day && 
               entry.exercise === exerciseName;
      });
      
      var previous = all.filter(function(entry) {
        return entry.week === currentWeek - 1 && 
               entry.day === day && 
               entry.exercise === exerciseName;
      });
      
      var improvement = null;
      
      if (current.length > 0 && previous.length > 0) {
        var currentAvg = {
          weight: current.reduce(function(sum, s) { return sum + s.weight; }, 0) / current.length,
          reps: current.reduce(function(sum, s) { return sum + s.reps; }, 0) / current.length
        };
        
        var previousAvg = {
          weight: previous.reduce(function(sum, s) { return sum + s.weight; }, 0) / previous.length,
          reps: previous.reduce(function(sum, s) { return sum + s.reps; }, 0) / previous.length
        };
        
        improvement = {
          weightDiff: currentAvg.weight - previousAvg.weight,
          repsDiff: currentAvg.reps - previousAvg.reps,
          volumeDiff: (currentAvg.weight * currentAvg.reps) - (previousAvg.weight * previousAvg.reps)
        };
      }
      
      return { current: current, previous: previous, improvement: improvement };
    },
    
    clear: function() {
      if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ?')) {
        localStorage.removeItem(STORAGE_KEY);
        return true;
      }
      return false;
    },
    
    export: function() {
      var history = WorkoutHistory.getAll() || [];
      return JSON.stringify(history, null, 2);
    },
    
    import: function(jsonData) {
      try {
        var imported = JSON.parse(jsonData);
        if (Array.isArray(imported)) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(imported));
          return true;
        }
        return false;
      } catch (error) {
        console.error('Import error:', error);
        return false;
      }
    }
  };

  var WorkoutStats = {
    getTotalWorkouts: function() {
      var history = WorkoutHistory.getAll() || [];
      var uniqueWorkouts = {};
      history.forEach(function(entry) {
        uniqueWorkouts[entry.week + '-' + entry.day] = true;
      });
      return Object.keys(uniqueWorkouts).length;
    },
    
    getTotalSets: function() {
      return (WorkoutHistory.getAll() || []).length;
    },
    
    getTotalVolume: function() {
      return (WorkoutHistory.getAll() || []).reduce(function(total, entry) {
        return total + (entry.weight * entry.reps);
      }, 0);
    },
    
    getAverageWeight: function(exerciseName) {
      var sets = WorkoutHistory.getByExercise(exerciseName);
      if (sets.length === 0) return 0;
      
      var total = sets.reduce(function(sum, set) { return sum + set.weight; }, 0);
      return Math.round(total / sets.length * 10) / 10;
    },
    
    getPersonalRecords: function(exerciseName) {
      var sets = WorkoutHistory.getByExercise(exerciseName);
      
      if (sets.length === 0) {
        return { maxWeight: 0, maxReps: 0, maxVolume: 0 };
      }
      
      var weights = sets.map(function(s) { return s.weight; });
      var reps = sets.map(function(s) { return s.reps; });
      var volumes = sets.map(function(s) { return s.weight * s.reps; });
      
      return {
        maxWeight: Math.max.apply(null, weights),
        maxReps: Math.max.apply(null, reps),
        maxVolume: Math.max.apply(null, volumes)
      };
    },
    
    getStreak: function() {
      var history = WorkoutHistory.getAll() || [];
      if (history.length === 0) return 0;
      
      var datesSet = {};
      history.forEach(function(entry) { datesSet[entry.date] = true; });
      var dates = Object.keys(datesSet).sort();
      
      var streak = 1;
      var currentStreak = 1;
      
      for (var i = 1; i < dates.length; i++) {
        var prev = new Date(dates[i - 1].split('/').reverse().join('-'));
        var curr = new Date(dates[i].split('/').reverse().join('-'));
        
        var diffDays = Math.floor((curr - prev) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentStreak++;
          streak = Math.max(streak, currentStreak);
        } else {
          currentStreak = 1;
        }
      }
      
      return streak;
    },
    
    getWeeklySummary: function(week) {
      var sets = WorkoutHistory.getByWeek(week);
      
      var daysSet = {};
      var exercisesSet = {};
      sets.forEach(function(s) {
        daysSet[s.day] = true;
        exercisesSet[s.exercise] = true;
      });
      
      var workouts = Object.keys(daysSet).length;
      var totalVolume = sets.reduce(function(sum, s) { return sum + (s.weight * s.reps); }, 0);
      var exercises = Object.keys(exercisesSet).length;
      
      return {
        week: week,
        workouts: workouts,
        totalSets: sets.length,
        totalVolume: totalVolume,
        exercises: exercises,
        avgVolumePerWorkout: workouts > 0 ? Math.round(totalVolume / workouts) : 0
      };
    }
  };

  var ProgressTracker = {
    checkProgress: function(exerciseName, currentWeek) {
      var all = WorkoutHistory.getAll() || [];
      
      var current = all.filter(function(entry) {
        return entry.week === currentWeek && entry.exercise === exerciseName;
      });
      
      var previous = all.filter(function(entry) {
        return entry.week === currentWeek - 1 && entry.exercise === exerciseName;
      });
      
      if (current.length === 0 || previous.length === 0) {
        return null;
      }
      
      var currentVolumes = current.map(function(s) { return s.weight * s.reps; });
      var previousVolumes = previous.map(function(s) { return s.weight * s.reps; });
      
      var currentBest = Math.max.apply(null, currentVolumes);
      var previousBest = Math.max.apply(null, previousVolumes);
      
      var improvement = currentBest - previousBest;
      var improvementPercent = (improvement / previousBest) * 100;
      
      return {
        improved: improvement > 0,
        improvement: improvement,
        improvementPercent: Math.round(improvementPercent * 10) / 10,
        currentBest: currentBest,
        previousBest: previousBest
      };
    },
    
    getChartData: function(exerciseName, limit) {
      limit = limit || 10;
      var sets = WorkoutHistory.getByExercise(exerciseName);
      
      var sessions = {};
      
      sets.forEach(function(set) {
        var key = 'W' + set.week + '-' + set.day;
        if (!sessions[key]) {
          sessions[key] = {
            label: key,
            week: set.week,
            day: set.day,
            date: set.date,
            maxWeight: 0,
            totalVolume: 0,
            sets: []
          };
        }
        
        sessions[key].maxWeight = Math.max(sessions[key].maxWeight, set.weight);
        sessions[key].totalVolume += set.weight * set.reps;
        sessions[key].sets.push(set);
      });
      
      var data = Object.keys(sessions).map(function(k) { return sessions[k]; });
      data.sort(function(a, b) { return a.week - b.week; });
      
      return limit ? data.slice(-limit) : data;
    }
  };

  window.WorkoutHistory = WorkoutHistory;
  window.WorkoutStats = WorkoutStats;
  window.ProgressTracker = ProgressTracker;
})();
